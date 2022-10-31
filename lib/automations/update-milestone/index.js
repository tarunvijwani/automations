const runner = require( './runner' );
const debug = require( '../../debug' );

debug( `Debug Runner: ${ runner }.` );
module.exports = {
	name: 'update-milestone',
	events: [ 'workflow_dispatch' ],
	runner,
};
