'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cell = require('fixed-data-table').Cell;
Cell = (0, _radium2.default)(Cell);

var TableCell = function (_Component) {
	_inherits(TableCell, _Component);

	function TableCell() {
		_classCallCheck(this, TableCell);

		return _possibleConstructorReturn(this, (TableCell.__proto__ || Object.getPrototypeOf(TableCell)).apply(this, arguments));
	}

	_createClass(TableCell, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps) {
			if (nextProps.isScrolling) {
				return false;
			}
			return this.props.rowIndex !== nextProps.rowIndex || this.props.data !== nextProps.data || !(0, _shallowequal2.default)(this.props.style, nextProps.style) || !(0, _shallowequal2.default)(this.props.childStyle, nextProps.childStyle);
		}
	}, {
		key: 'render',
		value: function render() {

			//console.debug('cell rendering', this.props.rowIndex, this.props.data);

			var _props = this.props;
			var data = _props.data;
			var style = _props.style;
			var childStyle = _props.childStyle;

			var props = _objectWithoutProperties(_props, ['data', 'style', 'childStyle']);

			return _react2.default.createElement(
				Cell,
				_extends({}, props, { style: style }),
				_react2.default.createElement(
					'div',
					{ style: childStyle },
					data
				)
			);
		}
	}]);

	return TableCell;
}(_react.Component);

exports.default = TableCell;
module.exports = exports['default'];