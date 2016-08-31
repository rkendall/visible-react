'use strict';

// TODO Rewrite this file
import clone from 'deep-copy';

let consoleWindow = null;

const log = {
	entries: {},
	add: (name, key) => {
		const id = log.makeId(name, key);
		if (!log.entries.hasOwnProperty(id)) {
			const entry = {
				id,
				displayName: log.makeDisplayName(name, key),
				name,
				key,
				renderCount: 0,
				unnecessaryUpdatesPrevented: 0,
				isMounted: false,
				oldProps: null,
				newProps: null,
				methods: {
					...log.init()
				}
			};
			log.entries[id] = entry;
		}
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
	makeDisplayName: (name, key) => {
		const formattedName = log.removeComponentWrapperNames(name);
		return key ? `${formattedName} (${key})` : formattedName;
	},
	removeComponentWrapperNames: (name) => {
		const wrapperPattern = /[^\(]+\(([^\)]+)\)/;
		while (wrapperPattern.test(name)) {
			name = name.replace(/[^\(]+\(([^\)]+)\)/, '$1')
		}
		return name;
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
				isMethodOverridden: false,
				called: false,
				count: 0,
				oldState: null,
				newState: null,
				updatedNewState: null,
				isInfiniteLoop: false
			}
		});
		return logObj;
	},
	getWindow: () => {
		if (consoleWindow === null || consoleWindow.closed) {
			consoleWindow = window.open(
				'../../dist/console.html',
				'console',
				"width=1300,height=900,resizable,scrollbars=yes,status=1"
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