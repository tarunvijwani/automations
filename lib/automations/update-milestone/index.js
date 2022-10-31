const runner = require( './runner' );

module.exports = {
	name: 'update-milestone',
	events: [ 'workflow_dispatch' ],
	//actions: [ 'update-milestone' ],
	runner,
};
