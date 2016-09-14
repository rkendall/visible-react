'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _deepCopy = require('deep-copy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Method = require('./Method');

var _Method2 = _interopRequireDefault(_Method);

var _styles = require('../styles/styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LifeCycle = function (_Component) {
	_inherits(LifeCycle, _Component);

	function LifeCycle() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, LifeCycle);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LifeCycle.__proto__ || Object.getPrototypeOf(LifeCycle)).call.apply(_ref, [this].concat(args))), _this), _this.styles = {
			container: {
				width: '900px',
				minWidth: '900px',
				padding: '10px',
				backgroundColor: 'lightblue'
			},
			title: {
				display: 'flex',
				justifyContent: 'space-around',
				marginBottom: '15px',
				fontSize: '18px',
				fontWeight: 'bold'
			},
			heading: {
				display: 'flex',
				justifyContent: 'space-around',
				marginBottom: '0',
				fontSize: '13px',
				fontWeight: 'bold'
			},
			toggleContainer: {
				position: 'absolute',
				float: 'left',
				cursor: 'pointer'
			},
			toggle: {
				cursor: 'pointer'
			},
			text: {
				textIndent: '-10px'
			},
			left: {
				display: 'flex',
				justifyContent: 'flex-start'
			},
			right: {
				display: 'flex',
				justifyContent: 'flex-end'
			},
			both: {
				display: 'flex',
				justifyContent: 'space-between'
			},
			center: {
				display: 'flex',
				justifyContent: 'center'
			},
			arrows: {
				display: 'flex',
				justifyContent: 'space-around',
				margin: '0 0 10px 0',
				fontSize: '16px',
				fontWeight: 'bold'
			}
		}, _this.getArrows = function () {
			if (!_this.props.isCompactView) {
				return _react2.default.createElement(
					'div',
					{ style: _this.styles.arrows },
					_react2.default.createElement(
						'div',
						null,
						'↓'
					),
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
			} else {
				return false;
			}
		}, _this.handleSetCompactView = function (event) {
			var value = event.target.checked;
			_this.props.dispatch(setCompactView(value));
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(LifeCycle, [{
		key: 'render',
		value: function render() {

			var logEntry = this.props.logEntry;
			if (!Object.keys(logEntry).length) {
				return false;
			}
			var methods = logEntry.methods;
			var isChanged = logEntry.isChanged;

			return _react2.default.createElement(
				'div',
				{ style: this.styles.container },
				_react2.default.createElement(
					'div',
					{ style: this.styles.heading },
					_react2.default.createElement(
						'div',
						null,
						'Called on Initial Render'
					),
					_react2.default.createElement(
						'div',
						null,
						'Called on Each Rerender'
					),
					_react2.default.createElement(
						'div',
						null,
						'Called on Removal from DOM'
					)
				),
				this.getArrows(),
				_react2.default.createElement(
					'div',
					{ style: this.styles.both },
					_react2.default.createElement(_Method2.default, { methodObj: methods.constructor, isChanged: isChanged, showFullText: this.props.showFullText }),
					_react2.default.createElement(_Method2.default, { methodObj: methods.componentWillUnmount, isChanged: isChanged, showFullText: this.props.showFullText })
				),
				_react2.default.createElement(
					'div',
					{ style: this.styles.center },
					_react2.default.createElement(_Method2.default, { methodObj: methods.componentWillReceiveProps, isChanged: isChanged, showFullText: this.props.showFullText })
				),
				_react2.default.createElement(
					'div',
					{ style: this.styles.center },
					_react2.default.createElement(_Method2.default, { methodObj: methods.shouldComponentUpdate, isChanged: isChanged, showFullText: this.props.showFullText })
				),
				_react2.default.createElement(
					'div',
					{ style: this.styles.left },
					_react2.default.createElement(_Method2.default, { methodObj: methods.componentWillMount, isChanged: isChanged, showFullText: this.props.showFullText }),
					_react2.default.createElement(_Method2.default, { methodObj: methods.componentWillUpdate, isChanged: isChanged, showFullText: this.props.showFullText })
				),
				_react2.default.createElement(
					'div',
					{ style: this.styles.left },
					_react2.default.createElement(_Method2.default, { methodObj: methods.render, isChanged: isChanged, showFullText: this.props.showFullText })
				),
				_react2.default.createElement(
					'div',
					{ style: this.styles.left },
					_react2.default.createElement(_Method2.default, { methodObj: methods.componentDidMount, isChanged: isChanged, showFullText: this.props.showFullText }),
					_react2.default.createElement(_Method2.default, { methodObj: methods.componentDidUpdate, isChanged: isChanged, showFullText: this.props.showFullText })
				)
			);
		}
	}]);

	return LifeCycle;
}(_react.Component);

exports.default = (0, _radium2.default)(LifeCycle);
module.exports = exports['default'];