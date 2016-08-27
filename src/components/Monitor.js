'use strict';

import React from 'react';
import {clone} from 'deep';
import deepEqual from 'deep-equal';
import filterObject from 'filter-object';

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
			this.handleLifecycleEvent('constructor', this.props, this.state, arguments);
			//this.updateState('constructor', props);
		}

		componentWillMount() {
			if (super.componentWillMount) {
				super.componentWillMount();
			}
			this.handleLifecycleEvent('componentWillMount', this.props, this.state);
			//this.updateState('componentWillMount', this.props);
		}

		componentDidMount() {
			if (super.componentDidMount) {
				super.componentDidMount();
			}
			this.isRenderingComplete = true;
			this.handleLifecycleEvent('componentDidMount', this.props, this.state);
			//this.updateState('componentDidMount', this.props);
			this.updateStore();
		}

		componentWillReceiveProps(nextProps) {
			if (super.componentWillReceiveProps) {
				super.componentWillReceiveProps(nextProps);
			}
			this.isRenderingComplete = false;
			this.clearCalled();
			this.handleLifecycleEvent('componentWillReceiveProps', this.props, this.state, arguments);
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
				this.props,
				this.state,
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
			this.handleLifecycleEvent('componentWillUpdate', this.props, this.state, arguments);
		}

		componentDidUpdate(previousProps, previousState) {
			if (super.componentDidUpdate) {
				super.componentDidUpdate(previousProps, previousState);
			}
			this.isRenderingComplete = true;
			this.handleLifecycleEvent('componentDidUpdate', this.props, this.state, arguments);
			//this.updateState('componentDidUpdate', this.props);
			this.updateStore();
		}

		componentWillUnmount() {
			if (super.componentWillUnmount) {
				super.componentWillUnmount();
			}
			this.isRenderingComplete = true;
			this.clearCalled();
			this.handleLifecycleEvent('componentWillUnmount', this.props, this.state);
			this.updateStore();
		}

		getComponentName = () => {
			return WrappedComponent.displayName
				|| WrappedComponent.name
         		|| 'Component';
		};

		// cloneProps = (props) => {
		// 	var newProps = Object.assign({}, props);
		// 	var propsToIgnore = [
		// 		'history',
		// 		'routes',
		// 		'route',
		// 		'location',
		// 		'children',
		// 		'params',
		// 		'routeParams'
		// 	];
		// 	propsToIgnore.forEach((name) => {
		// 		if (newProps.hasOwnProperty(name)) {
		// 			delete newProps[name];
		// 		}
		// 	});
		// 	return newProps;
		// };

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
			let logEntry = log.get(this.logEntryId);
			let count = logEntry.methods[name].count;
			let newArgs = args ? [...args].map((arg) => {
				return clone(this.removeCircularReferences(arg));
			}) : [];
			logEntry.methods[name] = {
				name,
				called: true,
				count: ++ count,
				// props: {},
				// state: {},
				props: clone(this.removeCircularReferences(props)),
				state: clone(state),
				args: newArgs,
				isInfiniteLoop: this.isInfiniteLoop,
				isUnnecessaryUpdatePrevented
			};
			log.update(this.logEntryId, logEntry);
			console.log(`%c${name}`, 'color: blue');
		};

		// Remove children because they can contain
		// circular references, which cause problems
		// with cloning and stringifying
		removeCircularReferences = (props) => {
			let newProps = Object.assign({}, props);
			if (newProps.hasOwnProperty('children')) {
				delete newProps.children;
			}
			return newProps;
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
			//this.consoleWindow.log.entries = clone(log.entries);
			this.consoleWindow.log.entries = log.entries;
			this.consoleWindow.postMessage('update', window.location.href);
		};

		incrementRenderCount = () => {
			this.autoRenderCount ++;
		};

		render() {

			this.incrementRenderCount();
			this.handleLifecycleEvent('render', this.props, this.state);
			return super.render();

		}
	};

}

export default Monitor;