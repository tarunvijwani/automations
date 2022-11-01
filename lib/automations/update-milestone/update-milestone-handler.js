/**
 * External dependencies
 */
const core = require( '@actions/core' );

module.exports = async ( context, octokit, config ) => {
	const { owner, repo } = context.repo;
	core.debug( 'Milestone: ' + config.targetMilestone );
	core.debug( 'MIlestone: ' + JSON.stringify( config.targetMilestone ) );
	core.debug( 'context: ' + JSON.stringify( context ) );
};
