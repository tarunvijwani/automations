/**
 * External dependencies
 */
const core = require( '@actions/core' );

const debug = require( '../../debug' );
const { getMilestoneByTitle } = require( '../../utils' );

module.exports = async ( context, octokit, config ) => {
	const targetMilestone = await getMilestoneByTitle(
		context,
		octokit,
		config.targetMilestone,
		'closed'
	);
	core.debug(
		'Found milestone to update ' + JSON.stringify( targetMilestone )
	);

	const updateDueDate = ( milestoneNumber, dueDate ) => {
		return octokit.rest.issues.updateMilestone( {
			owner: context.repo.owner,
			repo: context.repo.repo,
			milestone_number: milestoneNumber,
			due_on: dueDate,
		} );
	};
	const date = new Date();
	const dueDate = date.toISOString();
	const milestoneUpdate = await updateDueDate(
		targetMilestone.number,
		dueDate
	);
	if ( ! milestoneUpdate ) {
		debug(
			`Update Milestone: Could not update the due date of the milestone: ${ config.targetMilestone }`
		);
		return;
	}
	debug(
		`Update Milestone: Milstone ${ config.targetMilestone } successfully updated with the ${ dueDate } due date.`
	);
};
