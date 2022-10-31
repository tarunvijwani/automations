/**
 * External dependencies
 */
const debug = require( '../../debug' );
const { setFailed, debug: coreDebug } = require( '@actions/core' );

const updateMilestoneHandler = require( './update-milestone-handler' );

/**
 * @typedef {import('@actions/github').GitHub} GitHub
 * @typedef {import('@actions/github').context} GitHubContext
 * @typedef {import('../../typedefs').AutomationTaskRunner} AutomationTaskRunner
 */
const runnerMatrix = {
	workflow_dispatch: updateMilestoneHandler,
	release: {
		published: updateMilestoneHandler,
	},
};
const getRunnerTask = ( eventName, action ) => {
	console.log( 'Inside getRunnerTask' );
	if ( ! runnerMatrix[ eventName ] ) {
		return;
	}
	return action === undefined
		? runnerMatrix[ eventName ]
		: runnerMatrix[ eventName ][ action ];
};

/**
 * The task runner for this action
 *
 * @param {GitHubContext} context Context for the job run (github).
 * @param {GitHub}        octokit GitHub api helper.
 * @param {Object}        config  Config object.
 *
 * @return {AutomationTaskRunner} task runner.
 */
const runner = async ( context, octokit, config ) => {
	console.log( 'Inside runner' );
	const task = getRunnerTask( context.eventName, context.payload.action );
	if ( typeof task === 'function' ) {
		debug( `assignMilestoneRunner: Executing the ${ task.name } task.` );
		await task( context, octokit, config );
	} else {
		setFailed(
			`assignMilestoneRunner: There is no configured task for the event = '${ context.eventName }' and the payload action = '${ context.payload.action }'`
		);
	}
};
debug( 'runner inside runner: ' + runner );
export default runner;
