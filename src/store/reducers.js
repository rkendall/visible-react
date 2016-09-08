'use strict';

import log from '../log';
import Immutable from 'immutable';

const entries = (state, action) => {

	switch (action.type) {
		case 'ADD':
			const {key, id, name, displayName} = action;
			const entry = {
				id,
				displayName,
				name,
				key,
				renderCount: 0,
				unnecessaryUpdatesPrevented: 0,
				isMounted: false,
				props: {},
				state: {},
				lifecycleLocation: '',
				methods: initMethods()
			};
			return state.setIn(['entries', id], Immutable.fromJS(entry).toMap());
		case 'UPDATE_PROPSANDSTATE':
			return state.updateIn(['entries', ...action.keyPath], (oldValue) => {
				return oldValue.push(Immutable.fromJS(action.value));
			});
		case 'UPDATE_METHOD':
			return state.updateIn(['entries', action.entryId, 'methods', action.methodName], (oldValue) => {
				return oldValue.mergeDeep(Immutable.fromJS(action.value));
			});
		case 'UPDATE_VALUE':
			return state.setIn(['entries', ...action.keyPath], action.value);
		case 'INCREMENT_VALUE':
			return state.updateIn(['entries', ...action.keyPath], (oldValue) => {
				return oldValue + 1;
			});
		case 'UPDATE_METHODS':
			return state.updateIn(['entries', action.key, 'methods'], (methods) => {
				return methods.mergeDeep(Immutable.fromJS(action.value));
			});
		default:
			return state;
	}

};

export default entries;

const initMethods = () => {
	const methodNames = [
		'constructorMethod',
		'componentWillMount',
		'componentDidMount',
		'componentWillReceiveProps',
		'shouldComponentUpdate',
		'componentWillUpdate',
		'render',
		'componentDidUpdate',
		'componentWillUnmount'
	];
	let logObj = {};
	methodNames.forEach((name) => {
		logObj[name] = {
			name,
			isMethodOverridden: false,
			called: false,
			count: 0,
			isInfiniteLoop: false
		}
	});
	return logObj;
};

const checkEqualityOfPropsAndState = (methodObj) => {
	const isStateChanged = methodObj.get('oldState') !== methodObj.get('newState');
	return methodObj.set('isStateChanged', isStateChanged);
};