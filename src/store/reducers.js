'use strict';

import root from '../root.js';
import Immutable from 'immutable';

const entries = (state, action) => {

	switch (action.type) {
		case 'ADD':
			const {key, id, name, displayName} = action;
			const entry = Immutable.Map({
				id,
				displayName,
				name,
				key,
				renderCount: 0,
				unnecessaryUpdatesPrevented: 0,
				isMounted: false,
				isChanged: {
					props: false,
					state: false
				},
				lifecycleLocation: '',
				methods: null
			});
			const newEntry = entry.set('methods', initMethods());
			return state.setIn(['entries', id], newEntry);
		case 'UPDATE_METHOD':
			return state.setIn(['entries', action.entryId, 'methods', action.methodName], action.value);
		case 'UPDATE_VALUE':
			return state.setIn(['entries', ...action.keyPath], action.value);
		case 'INCREMENT_VALUE':
			return state.updateIn(['entries', ...action.keyPath], (oldValue) => {
				return oldValue + 1;
			});
		case 'UPDATE_METHODS':
			// TODO Convert this to Immutable data
			return state.updateIn(['entries', action.key, 'methods'], (methods) => {
				return methods.mergeDeep(Immutable.fromJS(action.value));
			});
		default:
			return state;
	}

};

export default entries;

const initMethods = () => {
	const logMap = Immutable.Map({
		constructorMethod: null,
		componentWillMount: null,
		componentDidMount: null,
		componentWillReceiveProps: null,
		shouldComponentUpdate: null,
		componentWillUpdate: null,
		render: null,
		componentDidUpdate: null,
		componentWillUnmount: null
	});
	const newLogMap = logMap.mapEntries((item) => {
		const name = item[0];
		return [name, Immutable.Map({
			name,
			isMethodOverridden: false,
			called: false,
			count: 0,
			isInfiniteLoop: false,
			isSetStateCalled: false,
			props: Immutable.List(),
			state: Immutable.List(),
			setState: Immutable.List()
		})];
	});
	return newLogMap;
};