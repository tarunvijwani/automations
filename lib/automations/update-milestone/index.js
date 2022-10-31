const runner = require( './runner' );
debug( `I'm running this codess` );
module.exports = {
	name: 'update-milestone',
	events: [ 'workflow_dispatch' ],
	//actions: [ 'update-milestone' ],
	runner,
};
