'use strict';

import React from 'react';
import {clone} from 'deep';
import deepEqual from 'deep-equal';
import uuid from 'node-uuid';

import log from './log.js';
import methodProperties from './constants/methods.js';

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
			this.logEntryId = log.add({
				type: 'ADD_ENTRY',
				key: props.id,
				name: getComponentName(WrappedComponent)
			});
			//this.consoleWindow.log[this.logEntryId] = clone(log.get(this.logEntryId));
			this.isRenderingComplete = false;
			this.clearCalled();
			this.handleLifecycleEvent(
				'constructorMethod',
				{newProps: props}
			);
			let methodObj = {};
			Object.keys(methodProperties).forEach((name) => {
				const methodName = name === 'constructorMethod' ? 'constructor' : name;
				methodObj[name] = {
					isMethodOverridden: Boolean(super[methodName])
				}
			});
			log.updateStore({
				type: 'UPDATE_METHODS',
				key: this.logEntryId,
				value: methodObj
			});
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
			log.updateWindow();
		}

		componentWillReceiveProps(nextProps) {
			this.clearCalled();
			this.handleLifecycleEvent(
				'componentWillReceiveProps',
				{
					oldProps: this.props,
					newProps: nextProps,
					oldState: this.state
				}
			);
			this.isRenderingComplete = false;
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
			let willUpdate;
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
				log.updateWindow();
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
			let count = log.getFromStore([
				'entries',
				this.logEntryId,
				'methods',
				name,
				'count'
			]);
			const clonedPropsAndStates = this.cloneValues(propsAndStates);
			const logEntry = {
				methods: {
					[name]: {
						name,
						called: true,
						count: count + 1,
						...clonedPropsAndStates,
						isInfiniteLoop: this.isInfiniteLoop,
						isUnnecessaryUpdatePrevented
					}
				}
			};
			if (arePropsChanged !== null) {
				logEntry.isChanged = {props: arePropsChanged};
			}
			if (areStatesChanged !== null) {
				if (!logEntry.hasOwnProperty('isChanged')) {
					logEntry.isChanged = {};
				}
				logEntry.isChanged.state = areStatesChanged;
			}
			log.updateStore({
				type: 'UPDATE_ENTRY',
				key: this.logEntryId,
				value: logEntry
			});
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
			this.autoRenderCount = 0;
			let methodObj = {};
			Object.keys(methodProperties).forEach((name) => {
				methodObj[name] = {
					called: false
				};
			});
			log.updateStore({
				type: 'UPDATE_METHODS',
				key: this.logEntryId,
				value: methodObj
			});
		};

		incrementRenderCount = () => {
			this.autoRenderCount++;
			log.updateStore({
				type: 'INCREMENT_VALUE',
				keyPath: [this.logEntryId, 'renderCount']
			})
		};

		setIsMounted = (isMounted) => {
			log.updateStore({
				type: 'UPDATE_VALUE',
				keyPath: [this.logEntryId, 'isMounted'],
				value: isMounted
			});
		};

		incrementUnnecessaryUpdatesPrevented = () => {
			log.updateStore({
				type: 'INCREMENT_VALUE',
				keyPath: [this.logEntryId, 'unnecessaryUpdatesPrevented']
			});
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