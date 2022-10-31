/**
 * External dependencies
 */
const debug = require( '../../debug' );
const { setFailed, debug: coreDebug } = require( '@actions/core' );

const updateMilestoneHandler = require( './update-milestone-handler' );

const runnerMatrix = {
	workflow_dispatch: updateMilestoneHandler,
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
 *
 * @return {AutomationTaskRunner} task runner.
 */
/**
 * The task runner for the Todos action
 *
 * @param {GitHubContext} context Context for the job run (github).
 * @param {GitHub}        octokit GitHub api helper.
 *
 * @return {AutomationTaskRunner} task runner.
 */
const runner = async ( context, octokit ) => {
	console.log( 'Inside runner so runner is running' );
	const task = getRunnerTask( context.eventName, context.payload.action );
	if ( typeof task === 'function' ) {
		debug( `updateMilestone: Executing the ${ task.name } task.` );
		await task( context, octokit );
	} else {
		setFailed(
			`updateMilestone: There is no configured task for the event = '${ context.eventName }' and the payload action = '${ context.payload.action }'`
		);
	}
};

module.exports = runner;
debug( 'runner inside runner: ' + runner );
