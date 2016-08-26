'use strict';

import React from 'react';
import clone from 'deep-copy';
import deepEqual from 'deep-equal';

import log from '../log';
//import updateConsole from '../updateConsole';

function Monitor(WrappedComponent) {

	return class ComponentWrapper extends WrappedComponent {

		logEntryId = null;
		autoRenderCount = 0;
		isInfiniteLoop = false;
		isRenderingComplete = true;
		consoleWindow = null;

		constructor(props) {
			super(...arguments);
			this.logEntryId = log.add(this.getComponentName(), this.key || this.props.id);
			this.consoleWindow = log.getWindow();
			//this.consoleWindow.log[this.logEntryId] = clone(log.get(this.logEntryId));
			this.isRenderingComplete = false;
			this.handleLifecycleEvent('constructor', clone(this.props), clone(this.state), arguments);
			//this.updateState('constructor', props);
		}

		componentWillMount() {
			if (super.componentWillMount) {
				super.componentWillMount();
			}
			this.handleLifecycleEvent('componentWillMount', clone(this.props), clone(this.state));
			//this.updateState('componentWillMount', this.props);
		}

		componentDidMount() {
			if (super.componentDidMount) {
				super.componentDidMount();
			}
			this.isRenderingComplete = true;
			this.handleLifecycleEvent('componentDidMount', clone(this.props), clone(this.state));
			//this.updateState('componentDidMount', this.props);
			this.updateStore();
		}

		componentWillReceiveProps(nextProps) {
			if (super.componentWillReceiveProps) {
				super.componentWillReceiveProps(nextProps);
			}
			this.isRenderingComplete = false;
			this.clearCalled();
			this.handleLifecycleEvent('componentWillReceiveProps', clone(this.props), clone(this.state), arguments);
			//this.updateState('componentWillReceiveProps', nextProps);
		}

		shouldComponentUpdate(nextProps, nextState) {
			this.isInfiniteLoop = this.autoRenderCount >= 10;
			let isWrappedComponentGoingToUpdate = null;
			if (super.shouldComponentUpdate) {
				isWrappedComponentGoingToUpdate = super.shouldComponentUpdate(nextProps, nextState);
			} else {
				isWrappedComponentGoingToUpdate = nextProps !== this.props || nextState !== this.state;
			}
			let isUpdateNecessary;
			if (isWrappedComponentGoingToUpdate === false) {
				isUpdateNecessary = false;
			} else {
				const areValuesEqual = deepEqual(nextProps, this.props) && deepEqual(nextState, this.state, {strict: true});
				isUpdateNecessary = !areValuesEqual;
			}
			const isUnnecessaryUpdatePrevented = isWrappedComponentGoingToUpdate && !isUpdateNecessary;
			if (this.isRenderingComplete) {
				this.clearCalled();
			}
			this.handleLifecycleEvent(
				'shouldComponentUpdate',
				clone(this.props),
				clone(this.state),
				arguments,
				isUnnecessaryUpdatePrevented
			);
			this.updateStore();
			// TODO Will there be cases where desired behavior sets isInfiniteLoop to true?
			if (isUpdateNecessary && !this.isInfiniteLoop) {
				this.isRenderingComplete = false;
				return true;
			} else {
				this.isRenderingComplete = true;
				return false;
			}
		}

		componentWillUpdate(nextProps, nextState) {
			if (super.componentWillUpdate) {
				super.componentWillUpdate(nextProps, nextState);
			}
			this.handleLifecycleEvent('componentWillUpdate', clone(this.props), clone(this.state), arguments);
		}

		componentDidUpdate(previousProps, previousState) {
			if (super.componentDidUpdate) {
				super.componentDidUpdate(previousProps, previousState);
			}
			this.isRenderingComplete = true;
			this.handleLifecycleEvent('componentDidUpdate', clone(this.props), clone(this.state), arguments);
			//this.updateState('componentDidUpdate', this.props);
			this.updateStore();
		}

		componentWillUnmount() {
			if (super.componentWillUnmount) {
				super.componentWillUnmount();
			}
			this.isRenderingComplete = true;
			this.clearCalled();
			this.handleLifecycleEvent('componentWillUnmount', clone(this.props), clone(this.state));
			this.updateStore();
		}

		getComponentName = () => {
			return WrappedComponent.displayName
				|| WrappedComponent.name
         		|| 'Component';
		};

		// updateState = (name, props) => {
		// 	const methodObj = log.config[name];
		// 	const setStateType = methodObj.setStateType;
		// 	const value = methodObj.value;
		// 	if (setStateType === 'none') {
		// 		return;
		// 	}
		// 	let text = '';
		// 	if (setStateType === 'set') {
		// 		text = value;
		// 	} else if (setStateType === 'add') {
		// 		text = (this.state.text || '') + value;
		// 	} else if (setStateType === 'props') {
		// 		text = props.parentText;
		// 	}
		// 	if (name === 'constructor') {
		// 		this.state = {
		// 			text
		// 		};
		// 	} else {
		// 		this.setState({
		// 			text
		// 		});
		// 	}
		// };

		handleLifecycleEvent = (name, props, state, args, isUnnecessaryUpdatePrevented) => {
			let logEntry = clone(log.get(this.logEntryId));
			const methodObj = logEntry.methods[name];
			const newMethodObj = {
				called: true,
				count: ++ methodObj.count,
				props: props,
				state: state,
				args: args ? [...args] : [],
				isInfiniteLoop: this.isInfiniteLoop,
				isUnnecessaryUpdatePrevented
			};
			Object.assign(methodObj, newMethodObj);
			log.update(this.logEntryId, logEntry);
			console.log(`%c${name}`, 'color: blue');
		};

		clearCalled = () => {
			let logEntry = clone(log.get(this.logEntryId));
			this.autoRenderCount = 0;
			for (var name in logEntry.methods) {
				logEntry.methods[name].called = false;
			}
			log.update(this.logEntryId, logEntry);
		};

		updateStore = () => {
			this.consoleWindow.log.entries = clone(log.entries);
			this.consoleWindow.postMessage(this.logEntryId, window.location.href);
		};

		incrementRenderCount = () => {
			this.autoRenderCount ++;
		};

		render() {

			this.incrementRenderCount();
			this.handleLifecycleEvent('render', clone(this.props), clone(this.state));
			return super.render();

		}
	};

}

export default Monitor;