/**
 * External dependencies
 */
const core = require( '@actions/core' );

module.exports = async ( context, octokit ) => {
	core.debug( 'Received context in runner: ' + JSON.stringify( context ) );
	core.debug( 'Received octokit in runner: ' + JSON.stringify( octokit ) );
	console.log( 'inside update milestone handler' );
};
