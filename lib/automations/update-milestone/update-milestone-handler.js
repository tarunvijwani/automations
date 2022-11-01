/**
 * External dependencies
 */
const core = require( '@actions/core' );

const debug = require( '../../debug' );
const { getMilestoneByTitle } = require( '../../utils' );

module.exports = async ( context, octokit, config ) => {
	const targetMilestone = await getMilestoneByTitle(
		context,
		octokit,
		config.targetMilestone,
		'closed'
	);
	if ( ! targetMilestone ) {
		debug(
			`Update Milestone: Could not find the target milestone: ${ config.targetMilestone }`
		);
		return;
	}
	debug(
		`Update Milestone: Found the target milestone: ${ config.targetMilestone }`
	);
	debug( `Update Milestone: octokit: ${ JSON.stringify( octokit ) }` );

	const updateDueDate = ( milestoneNumber, dueDate ) => {
		return octokit.issues.updateMilestone( {
			owner: context.repo.owner,
			repo: context.repo.repo,
			milestone_number: milestoneNumber,
			due_on: dueDate,
		} );
	};

	const date = new Date();
	const dueDate = date.toISOString();
	debug( `Due date: ${ dueDate }` );
	debug( `targetMilestone.number: ${ targetMilestone.number }` );
	const milestoneUpdate = await updateDueDate(
		targetMilestone.number,
		dueDate
	);
	if ( ! milestoneUpdate ) {
		debug(
			`Update Milestone: Could not update the due date of the milestone: ${ config.targetMilestone }`
		);
		return;
	}
	debug(
		`Update Milestone: Milstone ${ config.targetMilestone } successfully updated with the ${ dueDate } due date.`
	);
};
