const runner = require( './runner' );
const debug = require( '../../debug' );
const { getConfig } = require( './get-config' );

debug( 'runner: ' + JSON.stringify( runner ) );
debug( `Debug Runner: ${ runner }.` );
module.exports = {
	name: 'update-milestone',
	events: [ 'workflow_dispatch' ],
	actions: [ 'update-milestone' ],
	runner,
	getConfig,
};
