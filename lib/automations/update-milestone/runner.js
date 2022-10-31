/**
 * External dependencies
 */
const debug = require( '../../debug' );
const { setFailed, debug: coreDebug } = require( '@actions/core' );
debug( `I'm running this code` );
const runner = async ( context, octokit, config ) => {
	coreDebug( `eventName: ${ context.eventName }.` );
	debug( `eventName: ${ context.eventName }.` );
	coreDebug( `payload: ${ context.payload.action }.` );
};

export default runner;
