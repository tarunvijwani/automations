/**
 * External dependencies
 */
const core = require( '@actions/core' );

/**
 * Internal dependencies
 */
const { getTemplate, TEMPLATES, compile } = require( './templates' );
const { lineBreak } = require( '../../utils' );
const debug = require( '../../debug' );
const {
	getReleaseVersion,
	isPatchRelease,
	getReleaseBranch,
	duplicateChecker,
	hasMilestone: getHasMilestone,
} = require( './utils' );
const {
	getChangelog,
	getChangelogItems,
	getDevNoteItems,
} = require( '../../utils/changelog' );

/**
 * @typedef {import('../../typedefs').GitHubContext} GitHubContext
 * @typedef {import('../../typedefs').GitHub} GitHub
 * @typedef {import('../../typedefs').ReleaseConfig} ReleaseConfig
 */

/**
 * Inserts the new changelog entry into the readme file contents
 * @param {string} contents The contents of the readme.txt file
 * @param {string} changelog The changelog to insert into the readme.txt file
 * @param {string} releaseVersion The version being released.
 * @return {string} The new content of the readme.txt file containing the new changelog.
 */
const insertNewChangelogEntry = ( contents, changelog, releaseVersion ) => {
	const regex = /== Changelog ==\n/;
	return contents.replace(
		regex,
		`== Changelog ==\n\n= ${ releaseVersion } - ${
			new Date().toISOString().split( 'T' )[ 0 ]
		} =\n\n${ changelog }`
	);
};
/**
 * @param {GitHubContext} context
 * @param {GitHub} octokit
 * @param {ReleaseConfig} config
 */
const branchHandler = async ( context, octokit, config ) => {
	core.debug(
		'Received config in branchHandler: ' + JSON.stringify( config )
	);
	// get release version.
	const releaseVersion = getReleaseVersion( context.payload );
	if ( ! releaseVersion ) {
		debug( `releaseAutomation: branch created is not a release` );
		return;
	}

	let base,
		pullRequestTemplate,
		initialChecklistTemplate,
		changelog = '',
		devNoteItems = '';

	const prTitle = `Release: ${ releaseVersion }`;

	// if there's already a pull request for this release, then bail.
	const matchingPullRequest = await duplicateChecker(
		context,
		octokit,
		prTitle
	);

	if ( matchingPullRequest ) {
		debug(
			`releaseAutomation: Already have a pr for the branch with title: ${ prTitle }`
		);
		return;
	}

	// is this a patch release?
	if ( isPatchRelease( releaseVersion ) ) {
		base =
			( await getReleaseBranch( releaseVersion, context, octokit ) ) ||
			context.payload.master_branch;
		pullRequestTemplate = await getTemplate(
			TEMPLATES.patchReleasePullRequest,
			context,
			octokit
		);
		initialChecklistTemplate = await getTemplate(
			TEMPLATES.patchInitialChecklist,
			context,
			octokit
		);
	} else {
		base = context.payload.master_branch;
		pullRequestTemplate = await getTemplate(
			TEMPLATES.releasePullRequest,
			context,
			octokit
		);
		initialChecklistTemplate = await getTemplate(
			TEMPLATES.releaseInitialChecklist,
			context,
			octokit
		);
	}

	// get changelog
	const hasMilestone = await getHasMilestone(
		releaseVersion,
		context,
		octokit
	);
	core.debug( `Has milestone: ${ hasMilestone }` );
	try {
		if ( ! hasMilestone ) {
			throw new Error(
				'Changelog could not be generated because there is no milestone for the release branch that was pushed. Double-check the spelling on the release branch and ensure that you have a milestone corresponding to the version in the branch name. If you found the error, you can restart by deleting the branch and this pull and pushing a new branch.'
			);
		}
		const changelogItems = await getChangelogItems(
			context,
			octokit,
			releaseVersion,
			config
		);
		changelog = await getChangelog( changelogItems, config );
		devNoteItems = getDevNoteItems( changelogItems, config );
		const milestones = await octokit.rest.issues.listMilestones( {
			owner: 'woocommerce',
			repo: 'woocommerce-blocks',
			state: 'open',
		} );
		const milestoneNumber = milestones[ 0 ].number;
		const milestoneUpdate = octokit.rest.issues.updateMilestone( {
			owner: 'woocommerce',
			repo: 'woocommerce-blocks',
			milestone_number: milestoneNumber,
			state: 'close',
		} );
		if ( ! milestoneUpdate ) {
			throw new Error( 'Current Milestone not closed.' );
		}
		if ( ! isPatchRelease( releaseVersion ) ) {
			// newMilestone=parseInt(releaseVersion.replaceAll('.', ''))+10;
			const releaseVersionArray = releaseVersion.split( '.' );
			const nextMilestone =
				releaseVersionArray[ 1 ] < 9
					? `${ releaseVersionArray[ 0 ] }.${
							releaseVersionArray[ 1 ] + 1
					  }.0`
					: `${ releaseVersionArray[ 0 ] + 1 }.0.0`;
		}
	} catch ( e ) {
		core.debug( `Error ${ e }` );
		// @todo Handle re-attempting creation of changelog after resolving error.
		//
		// Currently, the changelog error is a consistent error message string
		// so that future pushes where the pull already exists can optionally retry.
		changelog =
			`> Changelog Error: ${ e.message }` +
			'\n' +
			"> You'll need to edit this section manually";
		devNoteItems =
			`> Devnotes Error: ${ e.message }` +
			'\n' +
			"> PRs tagged for dev notes cannot be found, you'll need to edit this section manually.";
	}

	const templateData = {
		...context.repo,
		changelog,
		devNoteItems,
		version: releaseVersion,
		releaseBranch: context.payload.ref,
		username: context.payload.sender.login,
	};

	const body = lineBreak( compile( pullRequestTemplate )( templateData ) );

	const { owner, repo } = context.repo;

	debug(
		`releaseAutomation: Creating release pull request in [${ owner }/${ repo }] for ${ context.payload.ref }`
	);

	const prCreated = await octokit.pulls.create( {
		...context.repo,
		title: prTitle,
		head: context.payload.ref,
		base,
		body,
	} );

	if ( ! prCreated ) {
		debug( `releaseAutomation: Creation of pull request failed.` );
		return;
	}

	const readmeResponse = await octokit.repos.getContent( {
		...context.repo,
		path: 'readme.txt',
	} );

	if ( ! readmeResponse ) {
		debug(
			`releaseAutomation: Could not read readme.txt file from repository.`
		);
		return;
	}

	// Content comes from GH API in base64 so convert it to utf-8 string.
	const readmeBuffer = new Buffer.from(
		readmeResponse.data.content,
		'base64'
	);
	const readmeContents = readmeBuffer.toString( 'utf-8' );

	// Need to convert back to base64 to write to the repo.
	const updatedReadmeContentBuffer = new Buffer.from(
		insertNewChangelogEntry( readmeContents, changelog, releaseVersion ),
		'utf-8'
	);
	const updatedReadmeContent = updatedReadmeContentBuffer.toString(
		'base64'
	);

	const readmeSha = readmeResponse.data.sha;
	const updatedReadmeCommit = await octokit.repos.createOrUpdateFileContents(
		{
			...context.repo,
			message: 'Update changelog in readme.txt',
			path: 'readme.txt',
			content: updatedReadmeContent,
			sha: readmeSha,
			branch: context.payload.ref,
		}
	);

	if ( ! updatedReadmeCommit ) {
		debug( `releaseAutomation: Automatic update of readme failed.` );
		return;
	}

	// Add initial Action checklist as comment.
	const commentBody = lineBreak(
		compile( initialChecklistTemplate )( templateData )
	);

	await octokit.issues.createComment( {
		...context.repo,
		issue_number: prCreated.data.number,
		body: commentBody,
	} );
};

/**
 * @param {GitHubContext} context
 * @param {GitHub} octokit
 * @param {ReleaseConfig} config
 */
module.exports = async ( context, octokit, config ) => {
	const type = context.payload.ref_type;
	core.debug( 'Received config in runner: ' + JSON.stringify( config ) );
	let handler;
	switch ( type ) {
		case 'branch':
			handler = branchHandler;
			break;
		case 'tag':
			handler = () => void null;
			break;
		default:
			return null;
	}
	await handler( context, octokit, config );
};
