'use strict';

import React from 'react';
import {clone} from 'deep';
import deepEqual from 'deep-equal';
import uuid from 'node-uuid';

import log from '../log';

function Insure(WrappedComponent) {

	return class ComponentWrapper extends WrappedComponent {

		static displayName = `Insure(${getComponentName(WrappedComponent)})`;

		logEntryId = null;
		autoRenderCount = 0;
		isInfiniteLoop = false;
		isRenderingComplete = true;
		consoleWindow = null;

		constructor(props) {
			super(...arguments);
			// if (!this.key) {
			// 	this.key = uuid.v1();
			// }
			this.logEntryId = log.add(getComponentName(WrappedComponent), this.props.id);
			this.consoleWindow = log.getWindow();
			//this.consoleWindow.log[this.logEntryId] = clone(log.get(this.logEntryId));
			this.isRenderingComplete = false;
			this.handleLifecycleEvent(
				'constructor',
				{newProps: props}
			);
			//this.updateState('constructor', props);
		}

		componentWillMount() {
			this.handleLifecycleEvent(
				'componentWillMount',
				{
					newProps: this.props,
					newState: this.state
				}
			);
			if (super.componentWillMount) {
				super.componentWillMount();
			}
			//this.updateState('componentWillMount', this.props);
		}

		componentDidMount() {
			const newState = this.state;
			if (super.componentDidMount) {
				super.componentDidMount();
			}
			this.handleLifecycleEvent(
				'componentDidMount',
				{
					newProps: this.props,
					newState: newState,
					updatedNewState: this.state
				}
			);
			this.isRenderingComplete = true;
			this.setIsMounted(true);
			//this.updateState('componentDidMount', this.props);
			this.updateStore();
		}

		componentWillReceiveProps(nextProps) {
			this.handleLifecycleEvent(
				'componentWillReceiveProps',
				{
					oldProps: this.props,
					newProps: nextProps,
					oldState: this.state
				}
			);
			if (super.componentWillReceiveProps) {
				super.componentWillReceiveProps(nextProps);
			}
			this.isRenderingComplete = false;
			this.clearCalled();
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
			if (isUnnecessaryUpdatePrevented) {
				this.incrementUnnecessaryUpdatesPrevented();
			}
			if (this.isRenderingComplete) {
				this.clearCalled();
			}
			this.handleLifecycleEvent(
				'shouldComponentUpdate',
				{
					oldProps: this.props,
					newProps: nextProps,
					oldState: this.state,
					newState: nextState
				},
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
			this.handleLifecycleEvent(
				'componentWillUpdate',
				{
					oldProps: this.props,
					newProps: nextProps,
					oldState: this.state,
					newState: nextState
				}
			);
			if (super.componentWillUpdate) {
				super.componentWillUpdate(nextProps, nextState);
			}
		}

		componentDidUpdate(prevProps, prevState) {
			const newState = clone(this.state);
			if (super.componentDidUpdate) {
				super.componentDidUpdate(prevProps, prevState);
			}
			this.isRenderingComplete = true;
			this.handleLifecycleEvent(
				'componentDidUpdate',
				{
					oldProps: prevProps,
					newProps: this.props,
					oldState: prevState,
					newState: newState,
					updatedNewState: this.state
				}
			);
			//this.updateState('componentDidUpdate', this.props);
			this.updateStore();
		}

		componentWillUnmount() {
			if (super.componentWillUnmount) {
				super.componentWillUnmount();
			}
			this.isRenderingComplete = true;
			this.setIsMounted(false);
			this.clearCalled();
			this.handleLifecycleEvent(
				'componentWillUnmount',
				{
					newProps: this.props,
					newState: this.state
				}
			);
			this.updateStore();
		}

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

		handleLifecycleEvent = (name, propsAndStates, isUnnecessaryUpdatePrevented = false) => {
			let logEntry = log.get(this.logEntryId);
			let count = logEntry.methods[name].count;
			const clonedPropsAndStates = this.cloneValues(propsAndStates);
			logEntry.methods[name] = {
				name,
				called: true,
				count: ++count,
				...clonedPropsAndStates,
				isInfiniteLoop: this.isInfiniteLoop,
				isUnnecessaryUpdatePrevented
			};
			log.update(this.logEntryId, logEntry);
			console.log(`%c${name}`, 'color: blue');
		};

		cloneValues = (propsAndStates) => {
			let newPropsAndStates = {};
			for (let name in propsAndStates) {
				const value = propsAndStates[name];
				let newValue = {};
				if (/Props/.test(name)) {
					newValue = clone(this.removeCircularReferences(value));
				} else {
					newValue = clone(value);
				}
				newPropsAndStates[name] = newValue;
			}
			return newPropsAndStates;
		};

		// Remove children because they can contain
		// circular references, which cause problems
		// with cloning and stringifying
		removeCircularReferences = (props) => {
			if (!props) {
				return null;
			}
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
			this.autoRenderCount++;
			let logEntry = log.get(this.logEntryId);
			logEntry.renderCount++;
			log.update(this.logEntryId, logEntry);
		};

		setIsMounted = (isMounted) => {
			let logEntry = log.get(this.logEntryId);
			logEntry.isMounted = isMounted;
			log.update(this.logEntryId, logEntry);
		};

		incrementUnnecessaryUpdatesPrevented = () => {
			let logEntry = log.get(this.logEntryId);
			logEntry.unnecessaryUpdatesPrevented++;
			log.update(this.logEntryId, logEntry);
		};

		render() {

			this.incrementRenderCount();
			this.handleLifecycleEvent(
				'render',
				{
					newProps: this.props,
					newState: this.state
				}
			);
			return super.render();

		}
	};

}

const getComponentName = (component) => {
	return component ? component.displayName
	|| component.name
	|| 'Component'
		: ''
};

export default Insure;