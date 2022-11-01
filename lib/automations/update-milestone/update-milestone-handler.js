/**
 * External dependencies
 */
const core = require( '@actions/core' );
const { getMilestoneByTitle } = require( '../../utils' );

module.exports = async ( context, octokit, config ) => {
	const { owner, repo } = context.repo;
	const targetMilestone = config.targetMilestone;
	// Get existing milestone
	const milestone = await getMilestoneByTitle(
		context,
		octokit,
		targetMilestone,
		'closed'
	);
	core.debug( 'milestone: ' + JSON.stringify( milestone ) );
};
