const runner = require( './runner' );
console.log( 'runner:', runner );
module.exports = {
	name: 'update-milestone',
	events: [ 'workflow_dispatch' ],
	actions: [ 'update-milestone' ],
	runner,
};
