'use strict';

import clone from 'deep-copy';

let consoleWindow = null;

const log = {
	entries: {},
	add: (name, key) => {
		const id = log.makeId(name, key);
		const entry = {
			id,
			name,
			key,
			methods: {
				...log.init()
			}
		};
		log.entries[id] = entry;
		return id;
	},
	update: (id, value) => {
		log.entries[id] = value;
	},
	get: (id) => {
		return log.entries[id];
	},
	makeId: (name, key) => {
		return key ? `${name}-${key}` : name;
	},
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
	},
	getWindow: () => {
		if (consoleWindow === null || consoleWindow.closed) {
			consoleWindow = window.open(
				'index.html',
				'console',
				"width=1200,height=800,resizable,scrollbars=yes,status=1"
			);
			if (!consoleWindow) {
				alert('You must disable your popup blocker to use the Life Insurance Console.');
			}
			consoleWindow.focus();
			consoleWindow.log = {
				entries: clone(log.entries)
			};
			consoleWindow.postMessage('update', window.location.href);
		}
		window.onbeforeunload = () => {
			consoleWindow.close();
		};
		return consoleWindow;
	}
};

export default log;