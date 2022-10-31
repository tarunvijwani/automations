/**
 * External dependencies
 */
const debug = require( '../../debug' );
const { setFailed, debug: coreDebug } = require( '@actions/core' );
debug( `I'm running this code updated` );
const runner = async ( context, octokit, config ) => {
	console.log( 'I am inside the runner' );
	console.log( 'context.eventName', context.eventName );
	console.log( 'context.payload.action', context.payload.action );
	debug( `eventName: ${ context.eventName }.` );
	coreDebug( `payload: ${ context.payload.action }.` );
};

export default runner;
