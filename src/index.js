'use strict';

import React from 'react';
import deepEqual from 'deep-equal';
import shallowEqual from 'shallowequal';
import deepCopy from 'deepcopy';
import Immutable from 'immutable';

import root from './root.js';
import lifecycleConfig from './store/lifecycleConfig';
import settingsManager from './settingsManager';


function Visible(wrapperParams) {

	settingsManager.set(wrapperParams);
	const settings = settingsManager.get();

	return function HOCFactory(WrappedComponent) {

		if (!settings.enabled || (!settings.monitor && !settings.logging && settings.compare === 'none')) {

			// Do nothing
			return class DisabledComponentWrapper extends WrappedComponent {
				static displayName = getComponentName(WrappedComponent);
			}

		}

		if (!settings.monitor && !settings.logging && settings.compare !== 'none') {


			// Only prevent unnecessary rerenders
			return class MinimalComponentWrapper extends WrappedComponent {

				static displayName = getComponentName(WrappedComponent);

				shouldComponentUpdate(nextProps, nextState) {

					if (super.shouldComponentUpdate) {
						const isSuperAllowingUpdate = super.shouldComponentUpdate(nextProps, nextState);
						if (!isSuperAllowingUpdate) {
							return false;
						}
					}
					let isChanged;
					if (settings.compare === 'shallow') {
						isChanged = !shallowEqual(nextState, this.state)
							|| !shallowEqual(nextProps, this.props);
					} else if (settings.compare == 'deep') {
						isChanged = !deepEqual(nextState, this.state, {strict: true})
							|| !deepEqual(nextProps, this.props, {strict: true});
					}
					return isChanged;

				}

			};

		}

		// Full set of features
		return class FullComponentWrapper extends WrappedComponent {

			static displayName = getComponentName(WrappedComponent);

			logEntryId = null;
			autoRenderCount = 0;
			isInfiniteLoop = false;
			isRenderingComplete = true;
			consoleWindow = null;
			lifecycleLocation = '';
			componentName = '';

			constructor(props) {
				super(...arguments);
				// if (!this.key) {
				// 	this.key = uuid.v1();
				// }
				this.componentName = getComponentName(WrappedComponent);
				this.setStateSpy = this.spy(this, 'setState');
				if (settings.monitor) {
					this.logEntryId = root.add({
						type: 'ADD_ENTRY',
						key: props.id,
						name: this.componentName
					});
					this.isRenderingComplete = false;
					this.lifecycleLocation = 'mounting';
					this.clearCalled();
				}
				this.handleLifecycleEvent({
					name: 'constructorMethod',
					props: [props],
					state: []
				});
				if (!settings.monitor) {
					return;
				}
				let methodObj = {};
				lifecycleConfig.methodNames.forEach((name) => {
					const methodName = name === 'constructorMethod' ? 'constructor' : name;
					methodObj[name] = {
						isMethodOverridden: Boolean(super[methodName])
					}
				});
				root.updateStore({
					type: 'UPDATE_METHODS',
					key: this.logEntryId,
					value: methodObj
				});
			}

			componentWillMount() {
				let isSetStateCalled = false;
				let setStateValue = null;
				if (super.componentWillMount) {
					({isSetStateCalled, setStateValue} = this.getSetState(super.componentWillMount.bind(this)));
				}
				this.handleLifecycleEvent({
					name: 'componentWillMount',
					props: [this.props],
					state: [this.state],
					setState: [setStateValue],
					isSetStateCalled
				});
			}

			componentDidMount() {
				if (settings.monitor) {
					this.consoleWindow = root.getWindow();
				}
				let isSetStateCalled = false;
				let setStateValue = null;
				if (super.componentDidMount) {
					({isSetStateCalled, setStateValue} = this.getSetState(super.componentDidMount.bind(this)));
				}
				const lifecycleData = {
					name: 'componentDidMount',
					props: [this.props],
					state: [this.state],
					setState: [setStateValue],
					isSetStateCalled
				};
				this.handleLifecycleEvent(lifecycleData);
				if (!settings.monitor) {
					return;
				}
				this.isRenderingComplete = !isSetStateCalled;
				this.setIsMounted(true);
				root.updateWindow();
			}

			componentWillReceiveProps(nextProps) {
				let isSetStateCalled = false;
				let setStateValue = null;
				if (super.componentWillReceiveProps) {
					({isSetStateCalled, setStateValue} = this.getSetState(super.componentWillReceiveProps.bind(this, nextProps)));
				}
				this.lifecycleLocation = 'updating';
				this.clearCalled();
				this.handleLifecycleEvent({
					name: 'componentWillReceiveProps',
					props: [this.props, nextProps],
					state: [this.state],
					setState: [setStateValue],
					isSetStateCalled
				});
				this.isRenderingComplete = false;
			}

			shouldComponentUpdate(nextProps, nextState) {

				this.lifecycleLocation = 'updating';
				this.isInfiniteLoop = this.autoRenderCount >= 10;

				let isSuperAllowingUpdate = true;
				// TODO Show warning if super is preventing update when value has changed
				if (super.shouldComponentUpdate) {
					// TODO If this is false (updated prevented by super) show message
					isSuperAllowingUpdate = super.shouldComponentUpdate(nextProps, nextState);
				}
				let isChanged = null;
				if (settings.compare === 'shallow') {
					isChanged = !shallowEqual(nextState, this.state)
						|| !shallowEqual(nextProps, this.props);
				} else if (settings.compare == 'deep') {
					isChanged = !deepEqual(nextState, this.state, {strict: true})
						|| !deepEqual(nextProps, this.props, {strict: true});
				}
				const isUnnecessaryUpdatePrevented = isSuperAllowingUpdate
					&& isChanged === false;
				if (isUnnecessaryUpdatePrevented) {
					this.incrementUnnecessaryUpdatesPrevented();
				}
				if (this.isRenderingComplete) {
					this.clearCalled();
				}
				this.handleLifecycleEvent({
					name: 'shouldComponentUpdate',
					props: [this.props, nextProps],
					state: [this.state, nextState],
					isUnnecessaryUpdatePrevented
				});
				let willUpdate = isSuperAllowingUpdate && isChanged !== false;
				// TODO Will there be cases where desired behavior sets isInfiniteLoop to true?
				if (this.isInfiniteLoop) {
					willUpdate = false;
				}
				if (willUpdate) {
					this.isRenderingComplete = false;
					return true;
				} else {
					this.isRenderingComplete = true;
					if (settings.monitor) {
						root.updateWindow();
					}
					return false;
				}

			}

			componentWillUpdate(nextProps, nextState) {
				if (super.componentWillUpdate) {
					super.componentWillUpdate(nextProps, nextState);
				}
				this.handleLifecycleEvent({
					name: 'componentWillUpdate',
					props: [this.props, nextProps],
					state: [this.state, nextState]
				});
			}

			componentDidUpdate(prevProps, prevState) {
				let isSetStateCalled = false;
				let setStateValue = null;
				if (super.componentDidUpdate) {
					({isSetStateCalled, setStateValue} = this.getSetState(super.componentDidUpdate.bind(this, prevProps, prevState)));
				}
				this.isRenderingComplete = true;
				this.handleLifecycleEvent({
					name: 'componentDidUpdate',
					props: [prevProps, this.props],
					state: [prevState, this.state],
					setState: [setStateValue],
					isSetStateCalled
				});
				if (!settings.monitor) {
					return;
				}
				root.updateWindow();
			}

			componentWillUnmount() {
				if (super.componentWillUnmount) {
					super.componentWillUnmount();
				}
				this.lifecycleLocation = 'unmounting';
				this.isRenderingComplete = true;
				this.setIsMounted(false);
				this.clearCalled();
				this.handleLifecycleEvent({
					name: 'componentWillUnmount',
					props: [this.props],
					state: [this.state]
				});
				if (!settings.monitor) {
					return;
				}
				root.updateWindow();
			}

			spy(obj, method) {
				const spy = {
					calls: [],
					callCount: 0,
					lastCall: null
				};
				let original = obj[method];
				obj[method] = function() {
					spy.calls.push(arguments[0]);
					spy.callCount++;
					spy.lastCall = arguments[0];
					if (settings.logging) {
						console.log(`%csetState %ccalled in component %c${this.componentName}`, 'color: green; font-weight: bold;', 'color: black; font-weight: normal;', 'color: blue; font-weight: bold;');
					}
					return original.apply(obj, [...arguments]);
				};
				return spy;
			};

			getSetState = (superMethod) => {

				let isSetStateCalled = false;
				let setStateValue = null;
				let setStateCallCount1 = this.setStateSpy.callCount;
				superMethod();
				let setStateCallCount2 = this.setStateSpy.callCount;
				isSetStateCalled = setStateCallCount2 - setStateCallCount1 === 1;
				if (isSetStateCalled) {
					setStateValue = deepCopy(this.setStateSpy.lastCall);
				}
				return {
					isSetStateCalled,
					setStateValue
				}

			};

			handleLifecycleEvent = (lifecycleData) => {
				if (settings.logging) {
					console.log(`%c${lifecycleData.name} %ccalled in component %c${this.componentName}`, 'color: green; font-weight: bold;', 'color: black; font-weight: normal;', 'color: blue; font-weight: bold;');
				}
				if (!settings.monitor) {
					return;
				}
				let count = root.getFromStore([
					'entries',
					this.logEntryId,
					'methods',
					lifecycleData.name,
					'count'
				]);
				const cleanedProps = lifecycleData.props.map((propsValue) => {
					return this.removePropsChildren(propsValue);
				});
				const method = Immutable.Map({
					name: lifecycleData.name,
					called: true,
					count: count + 1,
					props: Immutable.fromJS(cleanedProps || []),
					state: Immutable.fromJS(lifecycleData.state || []),
					setState: Immutable.fromJS(lifecycleData.setState || []),
					isSetStateCalled: lifecycleData.isSetStateCalled || false,
					isInfiniteLoop: this.isInfiniteLoop,
					isUnnecessaryUpdatePrevented: lifecycleData.isUnnecessaryUpdatePrevented,
					lifecycleLocation: this.lifecycleLocation
				});
				root.updateStore({
					type: 'UPDATE_METHOD',
					entryId: this.logEntryId,
					methodName: lifecycleData.name,
					value: method
				});
			};

			// Remove props.children because they can contain
			// circular references, which cause problems
			// with cloning and stringifying;
			// This prop value is meant to be opaque
			// and used only internally
			removePropsChildren = (props) => {
				if (!props) {
					return [];
				}
				let newProps = Object.assign({}, props);
				if (newProps.hasOwnProperty('children')) {
					delete newProps.children;
				}
				return newProps;
			};

			clearCalled = () => {
				if (!settings.monitor) {
					return;
				}
				this.autoRenderCount = 0;
				let methodObj = {};
				lifecycleConfig.methodNames.forEach((name) => {
					methodObj[name] = {
						called: false
					};
				});
				root.updateStore({
					type: 'UPDATE_METHODS',
					key: this.logEntryId,
					value: methodObj
				});
			};

			incrementRenderCount = () => {
				if (!settings.monitor) {
					return;
				}
				this.autoRenderCount++;
				root.updateStore({
					type: 'INCREMENT_VALUE',
					keyPath: [this.logEntryId, 'renderCount']
				})
			};

			setIsMounted = (isMounted) => {
				if (!settings.monitor) {
					return;
				}
				root.updateStore({
					type: 'UPDATE_VALUE',
					keyPath: [this.logEntryId, 'isMounted'],
					value: isMounted
				});
			};

			incrementUnnecessaryUpdatesPrevented = () => {
				if (!settings.monitor) {
					return;
				}
				root.updateStore({
					type: 'INCREMENT_VALUE',
					keyPath: [this.logEntryId, 'unnecessaryUpdatesPrevented']
				});
			};

			render() {

				this.incrementRenderCount();
				this.handleLifecycleEvent({
					name: 'render',
					props: [this.props],
					state: [this.state]
				});
				return super.render();

			}
		};

	}

}

const getComponentName = (component) => {
	return component ? component.displayName
	|| component.name
	|| 'Component'
		: ''
};

// Visible.setup = function(settings) {
// 	root.setSettings(settings);
// };

export default Visible;