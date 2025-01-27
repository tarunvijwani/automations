/**
 * External dependencies
 */
const { setFailed, getInput: coreGetInput } = require( '@actions/core' );

const inputs = {
	targetMilestone: {
		input: 'target_milestone',
		default: '',
		required: false,
	},
};

const getInput = ( input ) => {
	const value = coreGetInput( input.input ) || input.default;
	if ( input.required && ! value ) {
		throw new Error(
			`Missing required input ${ input.input } your input: ${ input }`
		);
	}

	return value;
};

module.exports = async () => {
	try {
		return {
			targetMilestone: getInput( inputs.targetMilestone ),
		};
	} catch ( error ) {
		setFailed( `Target milestone: ${ error }` );
	}
};
