'use strict';

const log = {
	config: {
		constructor: {
			setStateType: 'none',
			value: ''
		},
		componentWillMount: {
			setStateType: 'none',
			value: ''
		},
		componentDidMount: {
			setStateType: 'none',
			value: ''
		},
		componentWillReceiveProps: {
			setStateType: 'none',
			value: ''
		},
		componentDidUpdate: {
			setStateType: 'none',
			value: ''
		}
	},
	set: (settings) => {
		log.config[settings.name] = {
			setStateType: settings.setStateType,
			value: settings.value
		};
	},
	init: () => {
		const methodNames = [
			'constructor',
			'componentWillMount',
			'componentDidMount',
			'componentWillReceiveProps',
			'shouldComponentUpdate',
			'componentWillUpdate',
			'render',
			'componentDidUpdate',
			'componentWillUnmount'
		];
		let logObj = {};
		methodNames.forEach((name) => {
			logObj[name] = {
				name,
				called: false,
				count: 0,
				props: null,
				state: null,
				args: [],
				isInfiniteLoop: false
			}
		});
		return logObj;
	}
};

export default log;