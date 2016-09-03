'use strict';

import React from 'react';
import {clone} from 'deep';
import deepEqual from 'deep-equal';
import uuid from 'node-uuid';

import log from './shared/log.js';
import methodProperties from './shared/constants/methods.js';

function Insure(WrappedComponent) {

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

	return class DevComponentWrapper extends WrappedComponent {

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
		}

		componentWillMount() {
			this.handleLifecycleEvent(
				'componentWillMount',
				{
					newProps: this.props,
					newState: this.state
				}
			);
		}

		componentDidMount() {
			this.consoleWindow = log.getWindow();
			this.handleLifecycleEvent(
				'componentDidMount',
				{
					newProps: this.props,
					newState: this.state,
					updatedNewState: this.state
				}
			);
			this.isRenderingComplete = true;
			this.setIsMounted(true);
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
			this.isRenderingComplete = false;
			this.clearCalled();
		}

		shouldComponentUpdate(nextProps, nextState) {

			this.isInfiniteLoop = this.autoRenderCount >= 10;

			let shouldWrappedComponentUpdate;
			let isSuperAllowingUpdate = null;
			if (super.shouldComponentUpdate) {
				isSuperAllowingUpdate = super.shouldComponentUpdate(nextProps, nextState);
			}
			let arePropsEqual = nextProps === this.props;
			let areStatesEqual = nextState === this.state;
			let isWrappedComponentGoingToUpdate = !arePropsEqual || !areStatesEqual;
			if (!isWrappedComponentGoingToUpdate) {
				shouldWrappedComponentUpdate = false;
			} else {
				arePropsEqual = deepEqual(nextProps, this.props, {strict: true});
				areStatesEqual = deepEqual(nextState, this.state, {strict: true});
				shouldWrappedComponentUpdate = !arePropsEqual || !areStatesEqual;
			}

			const isUnnecessaryUpdatePrevented = isWrappedComponentGoingToUpdate
				&& !shouldWrappedComponentUpdate
				&& isSuperAllowingUpdate !== false;
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
				isUnnecessaryUpdatePrevented,
				!arePropsEqual,
				!areStatesEqual
			);
			log.updateWindow();
			// TODO Will there be cases where desired behavior sets isInfiniteLoop to true?
			if (this.isInfiniteLoop) {
				return false;
			}
			if (isSuperAllowingUpdate === false) {
				return false;
			}
			if (shouldWrappedComponentUpdate) {
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
		}

		componentDidUpdate(prevProps, prevState) {
			this.isRenderingComplete = true;
			this.handleLifecycleEvent(
				'componentDidUpdate',
				{
					oldProps: prevProps,
					newProps: this.props,
					oldState: prevState,
					newState: this.state,
					updatedNewState: this.state
				}
			);
			log.updateWindow();
		}

		componentWillUnmount() {
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
			log.updateWindow();
		}

		// TODO Refactor to use object as argument
		handleLifecycleEvent = (name, propsAndStates, isUnnecessaryUpdatePrevented = false, arePropsChanged = null, areStatesChanged = null) => {
			let logEntry = log.get(this.logEntryId);
			let count = logEntry.methods[name].count;
			const clonedPropsAndStates = this.cloneValues(propsAndStates);
			const methodObj = {
				name,
				isMethodOverridden: logEntry.methods[name].isMethodOverridden,
				called: true,
				count: ++count,
				...clonedPropsAndStates,
				isInfiniteLoop: this.isInfiniteLoop,
				isUnnecessaryUpdatePrevented
			};
			if (arePropsChanged !== null) {
				logEntry.isChanged.props = arePropsChanged;
			}
			if (areStatesChanged !== null) {
				logEntry.isChanged.state = areStatesChanged;
			}
			logEntry.methods[name] = Object.assign(logEntry.methods[name], methodObj);
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