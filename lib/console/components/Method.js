'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _styles = require('../styles/styles');

var _styles2 = _interopRequireDefault(_styles);

var _methods = require('../../insure/shared/constants/methods.js');

var _methods2 = _interopRequireDefault(_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Method = function (_Component) {
	_inherits(Method, _Component);

	function Method(props) {
		_classCallCheck(this, Method);

		var _this = _possibleConstructorReturn(this, (Method.__proto__ || Object.getPrototypeOf(Method)).call(this, props));

		_this.styles = {
			section: {
				width: '275px',
				margin: '0 10px',
				padding: '10px 10px 5px 10px',
				backgroundColor: 'white'
			},
			active: {
				boxShadow: '0 0 10px 6px #2d7188',
				fontWeight: 'bold',
				animation: 'x .7s ease-out',
				animationName: _radium2.default.keyframes({
					'0%': { boxShadow: 'none' },
					'40%': { boxShadow: '0 0 14px 9px ' + (0, _color2.default)('#2d7188').lighten(0.5).hexString() },
					'100%': { boxShadow: '0 0 10px 6px #2d7188' }
				})
			},
			inactive: {
				fontWeight: 'normal',
				boxShadow: 'none'
			},
			methodName: {
				display: 'flex',
				alignItems: 'baseline',
				fontWeight: 'bold',
				wordBreak: 'break-word'
			},
			methodIcon: {
				marginRight: '5px',
				color: 'limegreen',
				fontSize: '12px',
				cursor: 'default'
			},
			propsAndState: {
				display: 'flex',
				alignItems: 'center'
			},
			line: {
				display: 'flex'
			},
			valueContainer: {
				overflow: 'hidden'
			},
			value: {
				marginLeft: '5px',
				fontWeight: 'normal',
				cursor: 'pointer',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap'
			},
			times: {
				display: 'flex',
				justifyContent: 'space-between',
				marginTop: '5px'
			},
			warning: {
				color: 'red'
			},
			message: {
				marginTop: '5px',
				color: 'red'
			},
			setState: {
				display: 'flex',
				alignItems: 'center',
				margin: '5px -5px 0 -5px',
				padding: '5px',
				backgroundColor: 'rgba(76, 175, 80, .5)'
			},
			arrow: {
				display: 'flex',
				justifyContent: 'space-around',
				alignItems: 'center',
				margin: '5px 0 7px 0',
				fontSize: '16px',
				fontWeight: 'bold'
			},
			hidden: {
				opacity: '0'
			},
			input: {
				width: '100%',
				marginLeft: '5px'
			}
		};

		_this.getMethodName = function () {
			var methodObj = _this.props.methodObj;
			var args = _this.getArgNames(methodObj).str;
			var name = methodObj.name === 'constructor' ? 'constructor(' + args + ') or getInitialState()' : methodObj.name + '(' + args + ')';
			var iconMessage = 'This method exists in the wrapped component';
			var methodIcon = methodObj.isMethodOverridden ? _react2.default.createElement(
				'div',
				{ style: _this.styles.methodIcon, title: iconMessage },
				'⬤'
			) : '';
			return _react2.default.createElement(
				'div',
				{ key: name + '-name-icon' },
				_react2.default.createElement(
					'div',
					{ style: _this.styles.methodName },
					methodIcon,
					_react2.default.createElement(
						'div',
						null,
						name
					)
				)
			);
		};

		_this.getArgNames = function (methodObj) {
			var args = _methods2.default[methodObj.name].args;
			return {
				str: args.join(', '),
				arr: args
			};
		};

		_this.getActivityStyle = function (methodObj) {
			var isActive = methodObj.called;
			var style = isActive ? _this.styles.active : _this.styles.inactive;
			if (methodObj.name === 'render') {
				style.width = '560px';
			}
			return Object.assign({}, _this.styles.section, style);
		};

		_this.getTimesCalled = function (methodObj) {
			var loop = methodObj.isInfiniteLoop ? _react2.default.createElement(
				'div',
				{ style: _this.styles.warning },
				'(infinite loop terminated)'
			) : false;
			return _react2.default.createElement(
				'div',
				{ style: _this.styles.times },
				_react2.default.createElement(
					'div',
					null,
					'Times called: ',
					methodObj.count
				),
				loop
			);
		};

		_this.getPropsAndStates = function () {
			var types = ['props', 'state'];
			var methodObj = _this.props.methodObj;
			return types.map(function (type) {
				var items = _methods2.default[methodObj.name][type].slice();
				var names = items.map(function (item, ind) {
					var isSecond = ind > 0;
					return _this.getPropAndStateNames(item.name, type, isSecond);
				});
				// Display both values only if one has changed
				var itemsForValues = _this.props.isChanged[type] ? items.slice() : [items.slice()[0]];
				var values = itemsForValues.map(function (item) {
					if (!item) {
						return '';
					}
					return _this.getPropAndStateValues(methodObj[item.value], type);
				});
				var baseKey = methodObj.name + '-' + type;
				return _react2.default.createElement(
					'div',
					{ key: baseKey, style: _this.styles.propsAndState },
					_react2.default.createElement(
						'div',
						{ key: baseKey + '-label', style: _this.styles.label },
						names
					),
					_react2.default.createElement(
						'div',
						{ key: baseKey + '-value', style: _this.styles.valueContainer },
						values
					)
				);
			});
		};

		_this.getPropAndStateNames = function (name, type, isSecond) {
			var arrow = isSecond ? '↳' : '';
			return _react2.default.createElement(
				'div',
				{ style: _this.styles.line },
				_react2.default.createElement(
					'div',
					null,
					arrow,
					name,
					':'
				)
			);
		};

		_this.getPropAndStateValues = function (value, type) {
			return _react2.default.createElement(
				'div',
				{
					onClick: _this.showFullText.bind(_this, type, value, _this.props.methodObj),
					style: [_this.styles.value, _styles2.default[type]]
				},
				value ? JSON.stringify(value) : ''
			);
		};

		_this.showFullText = function (type, value, methodObj) {
			_this.props.showFullText(type, value, methodObj);
		};

		_this.getUnnecessaryUpdatePrevented = function () {
			return _this.props.methodObj.isUnnecessaryUpdatePrevented ? _react2.default.createElement(
				'div',
				{ style: _this.styles.message },
				'Unnecessary rerender prevented (props and state values have not changed)'
			) : false;
		};

		_this.getDescription = function () {
			var description = _methods2.default[_this.props.methodObj.name].description;
			if (description) {
				return _react2.default.createElement(
					'div',
					{ style: _styles2.default.description },
					description
				);
			} else {
				return false;
			}
		};

		_this.getSetState = function (methodObj) {
			var validMethods = ['constructor', 'componentWillMount', 'componentDidMount', 'componentWillReceiveProps', 'componentDidUpdate'];
			var name = methodObj.name;
			if (!validMethods.includes(name)) {
				return false;
			}
			var label = methodObj.name === 'constructor' ? 'this.state can be set here' : 'this.setState is available here';
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ style: _this.styles.setState },
					label
				),
				_this.getDescription()
			);
		};

		_this.getArrow = function () {
			if (_this.props.isCompactView) {
				return _react2.default.createElement('div', { style: _this.styles.arrow });
			} else if (_this.props.methodObj.name === 'render') {
				return _react2.default.createElement(
					'div',
					{ style: _this.styles.arrow },
					_react2.default.createElement(
						'div',
						null,
						'↓'
					),
					_react2.default.createElement(
						'div',
						null,
						'↓'
					)
				);
			} else if (!_methods2.default[_this.props.methodObj.name].terminal) {
				return _react2.default.createElement(
					'div',
					{ style: _this.styles.arrow },
					'↓'
				);
			} else {
				return _react2.default.createElement(
					'div',
					{ style: [_this.styles.arrow, _this.styles.hidden] },
					'↓'
				);
			}
		};

		_this.handleInputChange = function (event) {
			_this.setState({
				value: event.target.value
			});
		};

		_this.state = {
			showFullText: false,
			fadeDraggableWindow: false
		};
		return _this;
	}

	_createClass(Method, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			return nextProps !== this.props || !(0, _shallowequal2.default)(nextState, this.state) || !(0, _deepEqual2.default)(nextProps, this.props, { strict: true });
		}

		// TODO Refactor for clarity

	}, {
		key: 'render',
		value: function render() {
			var methodObj = this.props.methodObj;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ style: this.getActivityStyle(methodObj) },
					this.getMethodName(),
					this.getTimesCalled(methodObj),
					this.getPropsAndStates(),
					this.getUnnecessaryUpdatePrevented(),
					this.getSetState(methodObj)
				),
				this.getArrow()
			);
		}
	}]);

	return Method;
}(_react.Component);

Method.propTypes = {
	methodObj: _react.PropTypes.shape({
		name: _react.PropTypes.string,
		called: _react.PropTypes.bool,
		count: _react.PropTypes.number,
		props: _react.PropTypes.object,
		state: _react.PropTypes.object,
		args: _react.PropTypes.array
	}).isRequired
};
exports.default = (0, _radium2.default)(Method);
module.exports = exports['default'];