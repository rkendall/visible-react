'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _deepCopy = require('deep-copy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _log = require('../../insure/shared/log');

var _log2 = _interopRequireDefault(_log);

var _Console = require('./Console');

var _Console2 = _interopRequireDefault(_Console);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Component) {
	_inherits(_class, _Component);

	function _class() {
		_classCallCheck(this, _class);

		return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
	}

	_createClass(_class, [{
		key: 'render',


		// constructor(props) {
		// 	super(props);
		// 	this.state = {
		// 		logEntries: props.logEntries
		// 	}
		// }
		//
		// componentDidMount() {
		// 	this.props.setUpdateWindow(this.updateWindow);
		// }
		//
		// updateWindow = () => {
		// 	if (!deepEqual(log.entries, this.state.logEntries, {strict: true})) {
		// 		this.setState({
		// 			logEntries: clone(log.entries)
		// 		});
		// 	}
		// };

		value: function render() {

			return _react2.default.createElement(_Console2.default, { logEntries: this.props.logEntries });
		}
	}]);

	return _class;
}(_react.Component);

exports.default = _class;
;
module.exports = exports['default'];