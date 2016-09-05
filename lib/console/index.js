'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _radium = require('radium');

var _Console = require('./components/Console');

var _Console2 = _interopRequireDefault(_Console);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactDom.render)(_react2.default.createElement(
	_radium.StyleRoot,
	null,
	_react2.default.createElement(_Console2.default, null)
), document.getElementById('visible-react'));