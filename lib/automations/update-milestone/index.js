const runner = require( './runner' );
const debug = require( '../../debug' );

debug( 'runner: ' + JSON.stringify( runner ) );
debug( `Debug Runner: ${ runner }.` );
module.exports = {
	name: 'update-milestone',
	events: [ 'workflow_dispatch' ],
	actions: [ 'update-milestone' ],
	runner,
};
