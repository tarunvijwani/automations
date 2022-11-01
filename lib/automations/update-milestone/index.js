const runner = require( './runner' );
const getConfig = require( './get-config' );

module.exports = {
	name: 'update-milestone',
	events: [ 'workflow_dispatch' ],
	runner,
	getConfig,
};
