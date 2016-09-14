'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TableCell = require('./TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _styles = require('../styles/styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataIconCell = function (_Component) {
	_inherits(DataIconCell, _Component);

	function DataIconCell() {
		_classCallCheck(this, DataIconCell);

		return _possibleConstructorReturn(this, (DataIconCell.__proto__ || Object.getPrototypeOf(DataIconCell)).apply(this, arguments));
	}

	_createClass(DataIconCell, [{
		key: 'shouldComponentMount',
		value: function shouldComponentMount(nextProps, nextState) {
			return this.props.isChanged.props !== nextProps.isChanged.props || this.props.isChanged.state !== nextProps.isChanged.state;
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props;
			var isChanged = _props.isChanged;

			var props = _objectWithoutProperties(_props, ['isChanged']);

			var propsIcon = isChanged.props ? _react2.default.createElement(
				'div',
				{ style: _styles2.default.props },
				'•'
			) : '';
			var stateIcon = isChanged.state ? _react2.default.createElement(
				'div',
				{ style: _styles2.default.state },
				'•'
			) : '';
			var data = _react2.default.createElement(
				'div',
				null,
				propsIcon,
				stateIcon
			);
			return _react2.default.createElement(_TableCell2.default, _extends({
				data: data
			}, props));
		}
	}]);

	return DataIconCell;
}(_react.Component);

exports.default = DataIconCell;
;
module.exports = exports['default'];