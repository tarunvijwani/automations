const runner = require( './runner' );
const debug = require( '../../debug' );
const { getOctokit } = require( '@actions/github' );

debug( `Debug Runner: ${ runner }.` );
module.exports = {
	name: 'update-milestone',
	events: [ 'workflow_dispatch' ],
	actions: [ 'update-milestone' ],
	runner,
	getOctokit,
};
