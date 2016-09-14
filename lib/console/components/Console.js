'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _deepCopy = require('deep-copy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _reactDraggable = require('react-draggable');

var _reactDraggable2 = _interopRequireDefault(_reactDraggable);

var _diff = require('diff');

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _ComponentList = require('./ComponentList');

var _ComponentList2 = _interopRequireDefault(_ComponentList);

var _LifeCycle = require('./LifeCycle');

var _LifeCycle2 = _interopRequireDefault(_LifeCycle);

var _styles = require('../styles/styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Console = function (_Component) {
	_inherits(Console, _Component);

	function Console(props) {
		_classCallCheck(this, Console);

		var _this = _possibleConstructorReturn(this, (Console.__proto__ || Object.getPrototypeOf(Console)).call(this, props));

		_this.draggableWindowDimensions = {
			width: 800,
			height: 600
		};
		_this.styles = {
			container: _extends({
				display: 'flex',
				height: '100%',
				overflow: 'hidden'
			}, _styles2.default.base),
			lifeCycle: {
				flex: '2',
				height: '100%',
				overflowX: 'hidden',
				overflowY: 'auto'
			},
			draggableWindowHidden: {
				display: 'none'
			},
			draggableWindow: {
				display: 'flex',
				flexDirection: 'column',
				position: 'absolute',
				top: '10px',
				left: '10px',
				backgroundColor: 'white',
				border: '1px solid gray',
				boxShadow: '5px 5px 6px rgba(0, 0, 0, .4)',
				zIndex: '100'
			},
			// draggableWindowOpen: {
			// 	display: 'block',
			// 	opacity: '0',
			// 	animation: 'x .4s ease-in',
			// 	animationName: Radium.keyframes({
			// 		'0%': {opacity: '0'},
			// 		'50%': {opacity: '1'},
			// 		'100%': {opacity: '1'}
			// 	}),
			// 	zIndex: '100'
			// },
			// draggableWindowClosed: {
			// 	opacity: '1',
			// 	animation: 'x .4s ease-in',
			// 	animationName: Radium.keyframes({
			// 		'0%': {opacity: '1'},
			// 		'50%': {opacity: '0'},
			// 		'100%': {opacity: '0'}
			// 	})
			// },
			handle: {
				display: 'flex',
				justifyContent: 'flex-end',
				alignItems: 'center',
				height: '30px',
				backgroundColor: 'lightgray',
				cursor: 'move'
			},
			windowContent: {
				minWidth: _this.draggableWindowDimensions.width + 'px',
				height: '600px',
				margin: '0',
				padding: '10px',
				overflow: 'auto',
				resize: 'both'
			},
			close: {
				marginRight: '5px',
				cursor: 'pointer'
			},
			added: {
				backgroundColor: (0, _color2.default)('#4caf50').lighten(.5).hexString()
			},
			removed: {
				backgroundColor: (0, _color2.default)('red').lighten(.5).hexString()
			}
		};

		_this.handleConfigChange = function (option) {
			_this.setState(option);
		};

		_this.openDraggableWindow = function (type, value, methodObj) {
			var fullText = '';
			var nameSuffix = type[0].toUpperCase() + type.substr(1);
			if (methodObj.oldState && methodObj.newState) {
				fullText = _this.diffText(JSON.stringify(methodObj['old' + nameSuffix], null, 2), JSON.stringify(methodObj['new' + nameSuffix], null, 2));
			} else {
				fullText = JSON.stringify(value, null, 2);
			}
			_this.setState({
				showFullText: true,
				fullText: fullText
			});
		};

		_this.diffText = function (before, after) {
			var self = _this;
			var diff = (0, _diff.diffJson)(before, after);
			var html = [];
			diff.forEach(function (part, ind) {
				// green for additions, red for deletions
				// grey for common parts
				var color = part.added ? 'added' : part.removed ? 'removed' : 'unchanged';
				html.push(_react2.default.createElement(
					'span',
					{ key: 'diff-' + ind, style: self.styles[color] },
					part.value
				));
			});
			return html;
		};

		_this.closeDraggableWindow = function () {
			//const draggableWindow = ReactDOM.findDOMNode(this.refs.draggableWindow);
			_this.setState({
				showFullText: false
			});
		};

		var initialSelectedComponentId = props.logEntries ? Object.keys(props.logEntries)[0] : '';
		_this.state = {
			initialSelectedComponentId: initialSelectedComponentId,
			selectedComponentId: initialSelectedComponentId,
			showFullText: false
		};
		return _this;
	}

	_createClass(Console, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			return nextState !== this.state || nextProps !== this.props || !(0, _deepEqual2.default)(nextState, this.state, { strict: true }) || !(0, _deepEqual2.default)(nextProps, this.props, { strict: true });
		}

		// updateLog = (event) => {
		// 	if (!deepEqual(window.logEntries, this.state.logEntries, {strict: true})) {
		// 		this.setState({
		// 			log: {
		// 				entries: clone(window.logEntries)
		// 			}
		// 		});
		// 	}
		// };

		// TODOD Clean this up

	}, {
		key: 'render',


		// TODO Replace this animation with CSS
		value: function render() {

			var draggableWindowStyle = this.state.showFullText ? this.styles.draggableWindow : this.styles.draggableWindowHidden;
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ style: this.styles.container },
					_react2.default.createElement(_ComponentList2.default, {
						logEntries: this.props.logEntries,
						onChange: this.handleConfigChange,
						initialSelectedComponentId: this.state.initialSelectedComponentId
					}),
					_react2.default.createElement(
						'div',
						{ style: this.styles.lifeCycle },
						_react2.default.createElement(_LifeCycle2.default, {
							logEntry: this.props.logEntries[this.state.selectedComponentId],
							showFullText: this.openDraggableWindow
						})
					),
					_react2.default.createElement(
						_reactDraggable2.default,
						{
							handle: '.handle',
							bounds: 'parent'
						},
						_react2.default.createElement(
							'div',
							{ style: draggableWindowStyle },
							_react2.default.createElement(
								'div',
								{ className: 'handle', style: this.styles.handle },
								_react2.default.createElement(
									'div',
									{ onClick: this.closeDraggableWindow, style: this.styles.close },
									'close'
								)
							),
							_react2.default.createElement(
								'pre',
								{ style: this.styles.windowContent },
								this.state.fullText
							)
						)
					)
				)
			);
		}
	}]);

	return Console;
}(_react.Component);

exports.default = (0, _radium2.default)(Console);
module.exports = exports['default'];