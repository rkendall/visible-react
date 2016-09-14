'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// TODO Rewrite this file


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _radium = require('radium');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _deepCopy = require('deep-copy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _PopoutWindow = require('../../console/components/PopoutWindow');

var _PopoutWindow2 = _interopRequireDefault(_PopoutWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var consoleWindow = null;

var log = {

	entries: {},

	add: function add(name, key) {
		var id = log.makeId(name, key);
		if (!log.entries.hasOwnProperty(id)) {
			var entry = {
				id: id,
				displayName: log.makeDisplayName(name, key),
				name: name,
				key: key,
				renderCount: 0,
				unnecessaryUpdatesPrevented: 0,
				isMounted: false,
				isChanged: {
					props: null,
					state: null
				},
				methods: _extends({}, log.init())
			};
			log.entries[id] = entry;
		}
		return id;
	},

	update: function update(id, value) {
		console.debug('updating', id);
		log.entries[id] = value;
	},

	get: function get(id) {
		return (0, _deepCopy2.default)(log.entries[id]);
	},

	makeId: function makeId(name, key) {
		return key ? name + '-' + key : name;
	},

	makeDisplayName: function makeDisplayName(name, key) {
		var formattedName = log.removeComponentWrapperNames(name);
		return key ? formattedName + ' (' + key + ')' : formattedName;
	},

	removeComponentWrapperNames: function removeComponentWrapperNames(name) {
		var wrapperPattern = /[^\(]+\(([^\)]+)\)/;
		while (wrapperPattern.test(name)) {
			name = name.replace(/[^\(]+\(([^\)]+)\)/, '$1');
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

	set: function set(settings) {
		log.config[settings.name] = {
			setStateType: settings.setStateType,
			value: settings.value
		};
	},

	init: function init() {
		var methodNames = ['constructor', 'componentWillMount', 'componentDidMount', 'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate', 'render', 'componentDidUpdate', 'componentWillUnmount'];
		var logObj = {};
		methodNames.forEach(function (name) {
			logObj[name] = {
				name: name,
				isMethodOverridden: false,
				called: false,
				count: 0,
				oldState: null,
				newState: null,
				oldProps: null,
				newProps: null,
				updatedNewState: null,
				isInfiniteLoop: false
			};
		});
		return logObj;
	},

	updateWindow: function updateWindow() {
		if (consoleWindow === null || consoleWindow.closed) {
			return;
		}
		setTimeout(function () {
			var container = consoleWindow.document.getElementById('visible-react');
			_reactDom2.default.render(_react2.default.createElement(
				_radium.StyleRoot,
				null,
				_react2.default.createElement(_PopoutWindow2.default, {
					logEntries: (0, _deepCopy2.default)(log.entries)
				})
			), container);
		}, 0);
	},

	getWindow: function getWindow() {
		if (!window) {
			return;
		}
		if (consoleWindow === null || consoleWindow.closed) {
			consoleWindow = window.open('', 'console', "width=1350,height=900,resizable,scrollbars=yes,status=1");
			if (!consoleWindow) {
				alert('You must disable your popup blocker to use the Visible React Console.');
			}
			consoleWindow.document.title = 'Visible React';
			var container = consoleWindow.document.createElement('div');
			container.id = 'visible-react';
			consoleWindow.document.body.appendChild(container);
			consoleWindow.focus();
			log.updateWindow();
		}
		window.onbeforeunload = function () {
			consoleWindow.close();
		};
		return consoleWindow;
	}
};

exports.default = log;
module.exports = exports['default'];