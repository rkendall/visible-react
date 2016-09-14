'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _deep = require('deep');

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _log = require('./shared/log.js');

var _log2 = _interopRequireDefault(_log);

var _methods = require('./shared/constants/methods.js');

var _methods2 = _interopRequireDefault(_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Insure(WrappedComponent) {
	var _class, _temp, _initialiseProps;

	// if (process.env.NODE_ENV === 'production') {
	//
	// 	return class ComponentWrapper extends WrappedComponent {
	//
	// 		shouldComponentUpdate(nextProps, nextState) {
	//
	// 			if (super.shouldComponentUpdate) {
	// 				const isSuperAllowingUpdate = super.shouldComponentUpdate(nextProps, nextState);
	// 				if (!isSuperAllowingUpdate) {
	// 					return false;
	// 				}
	// 			}
	//
	// 			return (
	// 				nextState !== this.state
	// 				|| nextProps !== this.props
	// 				|| !deepEqual(nextState, this.state, {strict: true})
	// 				|| !deepEqual(nextProps, this.props, {strict: true})
	// 			);
	//
	// 		}
	//
	// 	};
	// }

	return _temp = _class = function (_WrappedComponent) {
		_inherits(DevComponentWrapper, _WrappedComponent);

		function DevComponentWrapper(props) {
			_classCallCheck(this, DevComponentWrapper);

			// if (!this.key) {
			// 	this.key = uuid.v1();
			// }
			var _this = _possibleConstructorReturn(this, (DevComponentWrapper.__proto__ || Object.getPrototypeOf(DevComponentWrapper)).apply(this, arguments));

			_initialiseProps.call(_this);

			_this.logEntryId = _log2.default.add(getComponentName(WrappedComponent), props.id);
			//this.consoleWindow.log[this.logEntryId] = clone(log.get(this.logEntryId));
			_this.isRenderingComplete = false;
			_this.clearCalled();
			_this.handleLifecycleEvent('constructor', { newProps: props });
			var logEntry = _log2.default.get(_this.logEntryId);
			for (var name in _methods2.default) {
				logEntry.methods[name].isMethodOverridden = Boolean(_get(DevComponentWrapper.prototype.__proto__ || Object.getPrototypeOf(DevComponentWrapper.prototype), name, _this));
			}
			_log2.default.update(_this.logEntryId, logEntry);
			return _this;
		}

		_createClass(DevComponentWrapper, [{
			key: 'componentWillMount',
			value: function componentWillMount() {
				this.handleLifecycleEvent('componentWillMount', {
					newProps: this.props,
					newState: this.state
				});
			}
		}, {
			key: 'componentDidMount',
			value: function componentDidMount() {
				this.consoleWindow = _log2.default.getWindow();
				this.handleLifecycleEvent('componentDidMount', {
					newProps: this.props,
					newState: this.state,
					updatedNewState: this.state
				});
				this.isRenderingComplete = true;
				this.setIsMounted(true);
				_log2.default.updateWindow();
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				this.clearCalled();
				this.handleLifecycleEvent('componentWillReceiveProps', {
					oldProps: this.props,
					newProps: nextProps,
					oldState: this.state
				});
				this.isRenderingComplete = false;
			}
		}, {
			key: 'shouldComponentUpdate',
			value: function shouldComponentUpdate(nextProps, nextState) {

				this.isInfiniteLoop = this.autoRenderCount >= 10;

				var shouldWrappedComponentUpdate = void 0;
				var isSuperAllowingUpdate = null;
				if (_get(DevComponentWrapper.prototype.__proto__ || Object.getPrototypeOf(DevComponentWrapper.prototype), 'shouldComponentUpdate', this)) {
					isSuperAllowingUpdate = _get(DevComponentWrapper.prototype.__proto__ || Object.getPrototypeOf(DevComponentWrapper.prototype), 'shouldComponentUpdate', this).call(this, nextProps, nextState);
				}
				var arePropsEqual = nextProps === this.props;
				var areStatesEqual = nextState === this.state;
				var isWrappedComponentGoingToUpdate = !arePropsEqual || !areStatesEqual;
				if (!isWrappedComponentGoingToUpdate) {
					shouldWrappedComponentUpdate = false;
				} else {
					arePropsEqual = (0, _deepEqual2.default)(nextProps, this.props, { strict: true });
					areStatesEqual = (0, _deepEqual2.default)(nextState, this.state, { strict: true });
					shouldWrappedComponentUpdate = !arePropsEqual || !areStatesEqual;
				}

				var isUnnecessaryUpdatePrevented = isWrappedComponentGoingToUpdate && !shouldWrappedComponentUpdate && isSuperAllowingUpdate !== false;
				if (isUnnecessaryUpdatePrevented) {
					this.incrementUnnecessaryUpdatesPrevented();
				}
				if (this.isRenderingComplete) {
					this.clearCalled();
				}
				this.handleLifecycleEvent('shouldComponentUpdate', {
					oldProps: this.props,
					newProps: nextProps,
					oldState: this.state,
					newState: nextState
				}, isUnnecessaryUpdatePrevented, !arePropsEqual, !areStatesEqual);
				var willUpdate = void 0;
				// TODO Will there be cases where desired behavior sets isInfiniteLoop to true?
				if (this.isInfiniteLoop) {
					willUpdate = false;
				} else if (isSuperAllowingUpdate === false) {
					willUpdate = false;
				} else if (shouldWrappedComponentUpdate) {
					this.isRenderingComplete = false;
					willUpdate = true;
				} else {
					this.isRenderingComplete = true;
					willUpdate = false;
				}
				if (willUpdate) {
					return true;
				} else {
					_log2.default.updateWindow();
					return false;
				}
			}
		}, {
			key: 'componentWillUpdate',
			value: function componentWillUpdate(nextProps, nextState) {
				this.handleLifecycleEvent('componentWillUpdate', {
					oldProps: this.props,
					newProps: nextProps,
					oldState: this.state,
					newState: nextState
				});
			}
		}, {
			key: 'componentDidUpdate',
			value: function componentDidUpdate(prevProps, prevState) {
				this.isRenderingComplete = true;
				this.handleLifecycleEvent('componentDidUpdate', {
					oldProps: prevProps,
					newProps: this.props,
					oldState: prevState,
					newState: this.state,
					updatedNewState: this.state
				});
				_log2.default.updateWindow();
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				this.isRenderingComplete = true;
				this.setIsMounted(false);
				this.clearCalled();
				this.handleLifecycleEvent('componentWillUnmount', {
					newProps: this.props,
					newState: this.state
				});
				_log2.default.updateWindow();
			}

			// TODO Refactor to use object as argument


			// TODOD No longer cloning state here so clean this up


			// Remove children because they can contain
			// circular references, which cause problems
			// with cloning and stringifying

		}, {
			key: 'render',
			value: function render() {

				this.incrementRenderCount();
				this.handleLifecycleEvent('render', {
					newProps: this.props,
					newState: this.state
				});
				return _get(DevComponentWrapper.prototype.__proto__ || Object.getPrototypeOf(DevComponentWrapper.prototype), 'render', this).call(this);
			}
		}]);

		return DevComponentWrapper;
	}(WrappedComponent), _class.displayName = 'Insure(' + getComponentName(WrappedComponent) + ')', _initialiseProps = function _initialiseProps() {
		var _this2 = this;

		this.logEntryId = null;
		this.autoRenderCount = 0;
		this.isInfiniteLoop = false;
		this.isRenderingComplete = true;
		this.consoleWindow = null;

		this.handleLifecycleEvent = function (name, propsAndStates) {
			var isUnnecessaryUpdatePrevented = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
			var arePropsChanged = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
			var areStatesChanged = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

			var logEntry = _log2.default.get(_this2.logEntryId);
			var count = logEntry.methods[name].count;
			var clonedPropsAndStates = _this2.cloneValues(propsAndStates);
			var methodObj = _extends({
				name: name,
				isMethodOverridden: logEntry.methods[name].isMethodOverridden,
				called: true,
				count: ++count
			}, clonedPropsAndStates, {
				isInfiniteLoop: _this2.isInfiniteLoop,
				isUnnecessaryUpdatePrevented: isUnnecessaryUpdatePrevented
			});
			if (arePropsChanged !== null) {
				logEntry.isChanged.props = arePropsChanged;
			}
			if (areStatesChanged !== null) {
				logEntry.isChanged.state = areStatesChanged;
			}
			logEntry.methods[name] = Object.assign(logEntry.methods[name], methodObj);
			_log2.default.update(_this2.logEntryId, logEntry);
		};

		this.cloneValues = function (propsAndStates) {
			var newPropsAndStates = {};
			for (var name in propsAndStates) {
				var value = propsAndStates[name];
				var newValue = {};
				if (/Props/.test(name)) {
					newValue = (0, _deep.clone)(_this2.removeCircularReferences(value));
				} else {
					newValue = value;
				}
				newPropsAndStates[name] = newValue;
			}
			return newPropsAndStates;
		};

		this.removeCircularReferences = function (props) {
			if (!props) {
				return null;
			}
			var newProps = Object.assign({}, props);
			if (newProps.hasOwnProperty('children')) {
				delete newProps.children;
			}
			return newProps;
		};

		this.clearCalled = function () {
			var logEntry = (0, _deep.clone)(_log2.default.get(_this2.logEntryId));
			_this2.autoRenderCount = 0;
			for (var name in logEntry.methods) {
				logEntry.methods[name].called = false;
			}
			_log2.default.update(_this2.logEntryId, logEntry);
		};

		this.incrementRenderCount = function () {
			_this2.autoRenderCount++;
			var logEntry = _log2.default.get(_this2.logEntryId);
			logEntry.renderCount++;
			_log2.default.update(_this2.logEntryId, logEntry);
		};

		this.setIsMounted = function (isMounted) {
			var logEntry = _log2.default.get(_this2.logEntryId);
			logEntry.isMounted = isMounted;
			_log2.default.update(_this2.logEntryId, logEntry);
		};

		this.incrementUnnecessaryUpdatesPrevented = function () {
			var logEntry = _log2.default.get(_this2.logEntryId);
			logEntry.unnecessaryUpdatesPrevented++;
			_log2.default.update(_this2.logEntryId, logEntry);
		};
	}, _temp;
}

var getComponentName = function getComponentName(component) {
	return component ? component.displayName || component.name || 'Component' : '';
};

exports.default = Insure;
module.exports = exports['default'];