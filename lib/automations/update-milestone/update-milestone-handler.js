/**
 * External dependencies
 */
const core = require( '@actions/core' );

module.exports = async ( context, octokit ) => {
	const type = context.payload.ref_type;
	core.debug( 'Received config in runner: ' + JSON.stringify( context ) );
	core.debug( 'Received octokit in runner: ' + JSON.stringify( octokit ) );
	core.debug( 'Received type in runner: ' + JSON.stringify( type ) );
	console.log( 'inside update milestone handler' );
};
