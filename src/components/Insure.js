'use strict';

import React from 'react';
import {clone} from 'deep';
import deepEqual from 'deep-equal';
import uuid from 'node-uuid';

import log from '../log';
import methodProperties from '../constants/methods';

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
			this.logEntryId = log.add(getComponentName(WrappedComponent), props.id);
			this.consoleWindow = log.getWindow();
			//this.consoleWindow.log[this.logEntryId] = clone(log.get(this.logEntryId));
			this.isRenderingComplete = false;
			this.handleLifecycleEvent(
				'constructor',
				{newProps: props}
			);
			let logEntry = log.get(this.logEntryId);
			for (let name in methodProperties) {
				logEntry.methods[name].isMethodOverridden = Boolean(super[name]);
			}
			log.update(this.logEntryId, logEntry);
			//this.updateState('constructor', props);
		}

		componentWillMount() {
			let isMethodOverridden = false;
			const newState = clone(this.state);
			if (super.componentWillMount) {
				isMethodOverridden = true;
				super.componentWillMount();
			}
			this.handleLifecycleEvent(
				'componentWillMount',
				{
					newProps: this.props,
					newState
				},
				isMethodOverridden
			);
			//this.updateState('componentWillMount', this.props);
		}

		componentDidMount() {
			let isMethodOverridden = false;
			const newState = clone(this.state);
			if (super.componentDidMount) {
				isMethodOverridden = true;
				super.componentDidMount();
			}
			this.handleLifecycleEvent(
				'componentDidMount',
				{
					newProps: this.props,
					newState: newState,
					updatedNewState: this.state
				},
				isMethodOverridden
			);
			this.isRenderingComplete = true;
			this.setIsMounted(true);
			//this.updateState('componentDidMount', this.props);
			this.updateStore();
		}

		componentWillReceiveProps(nextProps) {
			let isMethodOverridden = false;
			const oldState = clone(this.state);
			if (super.componentWillReceiveProps) {
				isMethodOverridden = true;
				super.componentWillReceiveProps(nextProps);
			}
			this.handleLifecycleEvent(
				'componentWillReceiveProps',
				{
					oldProps: this.props,
					newProps: nextProps,
					oldState
				},
				isMethodOverridden
			);
			this.isRenderingComplete = false;
			this.clearCalled();
			//this.updateState('componentWillReceiveProps', nextProps);
		}

		shouldComponentUpdate(nextProps, nextState) {
			this.isInfiniteLoop = this.autoRenderCount >= 10;
			let isWrappedComponentGoingToUpdate = null;
			let isMethodOverridden = false;
			if (super.shouldComponentUpdate) {
				console.debug('super.shouldComponentUpdate exists');
				isMethodOverridden = true;
				//isWrappedComponentGoingToUpdate = super.shouldComponentUpdate(nextProps, nextState);
				console.info('isWrappedComponentGoingToUpdate', isWrappedComponentGoingToUpdate);
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
					oldState: clone(this.state),
					newState: clone(nextState)
				},
				isMethodOverridden,
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
			let isMethodOverridden = false;
			if (super.componentWillUpdate) {
				isMethodOverridden = true;
				super.componentWillUpdate(nextProps, nextState);
			}
			this.handleLifecycleEvent(
				'componentWillUpdate',
				{
					oldProps: this.props,
					newProps: nextProps,
					oldState: clone(this.state),
					newState: clone(nextState)
				},
				isMethodOverridden
			);
		}

		componentDidUpdate(prevProps, prevState) {
			let isMethodOverridden = false;
			const newState = clone(this.state);
			if (super.componentDidUpdate) {
				isMethodOverridden = true;
				super.componentDidUpdate(prevProps, prevState);
			}
			this.isRenderingComplete = true;
			this.handleLifecycleEvent(
				'componentDidUpdate',
				{
					oldProps: prevProps,
					newProps: this.props,
					oldState: clone(prevState),
					newState: clone(newState),
					updatedNewState: this.state
				},
				isMethodOverridden
			);
			//this.updateState('componentDidUpdate', this.props);
			this.updateStore();
		}

		componentWillUnmount() {
			let isMethodOverridden = false;
			if (super.componentWillUnmount) {
				isMethodOverridden = true;
				super.componentWillUnmount();
			}
			this.isRenderingComplete = true;
			this.setIsMounted(false);
			this.clearCalled();
			this.handleLifecycleEvent(
				'componentWillUnmount',
				{
					newProps: this.props,
					newState: clone(this.state)
				},
				isMethodOverridden
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

		handleLifecycleEvent = (name, propsAndStates, isMethodOverridden = false, isUnnecessaryUpdatePrevented = false) => {
			let logEntry = log.get(this.logEntryId);
			let count = logEntry.methods[name].count;
			const clonedPropsAndStates = this.cloneValues(propsAndStates);
			logEntry.methods[name] = {
				name,
				isMethodOverridden,
				called: true,
				count: ++count,
				...clonedPropsAndStates,
				isInfiniteLoop: this.isInfiniteLoop,
				isUnnecessaryUpdatePrevented
			};
			log.update(this.logEntryId, logEntry);
		};

		// TODOD No longer cloning state here so clean this up
		cloneValues = (propsAndStates) => {
			let newPropsAndStates = {};
			for (let name in propsAndStates) {
				const value = propsAndStates[name];
				let newValue = {};
				if (/Props/.test(name)) {
					newValue = clone(this.removeCircularReferences(value));
				} else {
					newValue = value;
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
			// render method is mandatory
			let isMethodOverridden = true;
			this.handleLifecycleEvent(
				'render',
				{
					newProps: this.props,
					newState: clone(this.state)
				},
				isMethodOverridden
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