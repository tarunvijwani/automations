/**
 * External dependencies
 */
const core = require( '@actions/core' );

module.exports = async ( context, octokit, config ) => {
	const type = context.payload.ref_type;
	core.debug( 'Received config in runner: ' + JSON.stringify( config ) );
};
