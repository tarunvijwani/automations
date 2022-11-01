/**
 * External dependencies
 */
const core = require( '@actions/core' );

module.exports = async ( context, octokit ) => {
	const { owner, repo } = context.repo;
	core.debug( 'context: ' + JSON.stringify( context ) );
};
