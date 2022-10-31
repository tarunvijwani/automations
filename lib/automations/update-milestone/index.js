const runner = require( './runner' );
const debug = require( '../../debug' );
console.log( 'runner:', runner );
debug( `Debug Runner: ${ runner }.` );
module.exports = {
	name: 'update-milestone',
	events: [ 'workflow_dispatch' ],
	actions: [ 'update-milestone' ],
	runner,
};
