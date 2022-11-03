/**
 * External dependencies
 */
const { setFailed, debug: coreDebug } = require( '@actions/core' );

const debug = require( '../../debug' );

const updateMilestoneHandler = require( './update-milestone-handler' );

const runnerMatrix = {
	release: {
		published: updateMilestoneHandler,
	},
};
const getRunnerTask = ( eventName, action ) => {
	if (
		! runnerMatrix[ eventName ] ||
		! runnerMatrix[ eventName ][ action ]
	) {
		return;
	}
	return runnerMatrix[ eventName ][ action ];
};

const runner = async ( context, octokit, config ) => {
	const task = getRunnerTask( context.eventName, context.payload.action );
	if ( typeof task === 'function' ) {
		debug( `updateMilestone: Executing the ${ task.name } task.` );
		await task( context, octokit, config );
	} else {
		setFailed(
			`updateMilestone: There is no configured task for the event = '${ context.eventName }' and the payload action = '${ context.payload.action }'`
		);
	}
};

module.exports = runner;
