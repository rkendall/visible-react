'use strict';

import deepEqual from 'deep-equal';
import Immutable from 'immutable';

// Refactor so 'this' can be used here
const lifecycleConfig = {

	// Remember to clear this each time
	isPartnerChanged: {
		props: null,
		state: null
	},

	addRemainingPropertiesToAllEntries: function(entries) {
		return entries.map((entry) => {
			return this.addRemainingPropertiesToEntry(entry);
		});
	},

	addRemainingPropertiesToEntry: function(entry) {

		this.isPartnerChanged = {
			props: null,
			state: null
		};
		let isChanged = {
			props: false,
			state: false
		};

		const remainingPropertiesForEntry = this.properties;
		const newMethods = entry.get('methods').map((method, methodName) => {
			// TODO refactor repeated code
			const remainingPropertiesForMethod = remainingPropertiesForEntry[methodName];

			const propValues = method.get('props');
			remainingPropertiesForMethod.props.values = propValues;
			if (remainingPropertiesForMethod.props.hasOwnProperty('arePartnersDifferent')) {
				remainingPropertiesForMethod.props.arePartnersDifferent = this.arePartnerPropsOrStatesDifferent(propValues, 'props');
			}
			if (remainingPropertiesForMethod.props.hasOwnProperty('isChanged')) {
				const isPropsChanged = this.isPropsOrStateChanged(propValues, methodName, 'props', entry);
				remainingPropertiesForMethod.props.isChanged = isPropsChanged;
				if (isPropsChanged && !isChanged.props) {
					isChanged.props = true;
				}
			}

			const stateValues = method.get('state');
			remainingPropertiesForMethod.state.values = stateValues;
			if (remainingPropertiesForMethod.state.hasOwnProperty('arePartnersDifferent')) {
				remainingPropertiesForMethod.state.arePartnersDifferent = this.arePartnerPropsOrStatesDifferent(stateValues, 'state');
			}
			if (remainingPropertiesForMethod.state.hasOwnProperty('isChanged')) {
				const isStateChanged = this.isPropsOrStateChanged(stateValues, methodName, 'state', entry);
				remainingPropertiesForMethod.state.isChanged = isStateChanged;
				if (isStateChanged && !isChanged.state) {
					isChanged.state = true;
				}
			}
			return method.merge(Immutable.Map(remainingPropertiesForMethod));

		});

		return entry.set('methods', newMethods).set('isChanged', isChanged);

	},

	arePartnerPropsOrStatesDifferent: function(immutableItems, type) {
		if (immutableItems.size < 2) {
			return false;
		}
		// Immutability doesn't help with comparison here because the two source objects
		// were different; convert to JS for faster comparison
		const items = immutableItems.toJS();
		if (this.isPartnerChanged[type] === null) {
			this.isPartnerChanged[type] = !deepEqual(items[0], items[1], {strict: true});
		}
		return this.isPartnerChanged[type];
	},

	isPropsOrStateChanged: function(values, methodName, type, entry) {
		const method = entry.getIn(['methods', methodName]);
		const lifecycleLocation = method.get('lifecycleLocation');
		const isCalled = method.get('called');
		if (!isCalled) {
			return false;
		}
		if (lifecycleLocation === 'mounting' && !values.first()) {
			return false;
		}
		if (methodName === 'constructorMethod' || methodName === 'componentWillMount') {
			return true;
		}
		let precedingValue;
		if (methodName === 'render') {
			if (lifecycleLocation === 'mounting') {
				precedingValue = entry.getIn(['methods', 'componentWillMount', type, '0']);
			} else {
				return false;
			}
		} else if (methodName === 'componentWillReceiveProps' && type === 'props') {
			precedingValue = values.first();
		} else if (methodName === 'shouldComponentUpdate' && type === 'state') {
			precedingValue = values.first();
		} else {
			return false;
		}
		// Only the second of two parallel values will be marked changed;
		// for example, nextProps
		const value1ToCompare = values.last() ? values.last().toJS() : '';
		const value2ToCompare = precedingValue ? precedingValue.toJS() : '';
		return !deepEqual(value1ToCompare, value2ToCompare, {strict: true})
	},

	get properties() {
		return {
			constructorMethod: {
				args: ['props'],
				props: {
					names: ['props'],
					values: [],
					isChanged: false
				},
				state: {
					names: [],
					values: []
				},
				terminal: false
			},
			componentWillMount: {
				args: [],
				props: {
					names: ['this.props'],
					values: []
				},
				state: {
					names: ['this.state'],
					values: [],
					isChanged: false
				},
				terminal: false
			},
			render: {
				args: [],
				props: {
					names: ['this.props'],
					values: []
				},
				state: {
					names: ['this.state'],
					values: [],
					isChanged: false
				},
				terminal: false
			},
			componentDidMount: {
				args: [],
				props: {
					names: ['this.props'],
					values: []
				},
				state: {
					names: ['this.state'],
					values: []
				},
				description: 'Avoid calling setState here because it will trigger an extra render.'
			},
			componentWillReceiveProps: {
				args: ['nextProps'],
				props: {
					names: ['this.props', 'nextProps'],
					values: [],
					arePartnersDifferent: false,
					isChanged: false
				},
				state: {
					names: ['this.state'],
					values: []
				},
				terminal: false
			},
			shouldComponentUpdate: {
				args: ['nextProps', 'nextState'],
				props: {
					names: ['this.props', 'nextProps'],
					values: [],
					arePartnersDifferent: false
				},
				state: {
					names: ['this.state', 'nextState'],
					values: [],
					isChanged: false,
					arePartnersDifferent: false
				},
				terminal: false
			},
			componentWillUpdate: {
				args: ['nextProps', 'nextState'],
				props: {
					names: ['this.props', 'nextProps'],
					values: [],
					arePartnersDifferent: false
				},
				state: {
					names: ['this.state', 'nextState'],
					values: [],
					arePartnersDifferent: false
				},
				terminal: false
			},
			componentDidUpdate: {
				args: ['prevProps', 'prevState'],
				props: {
					names: ['prevProps', 'this.props'],
					values: [],
					arePartnersDifferent: false
				},
				state: {
					names: ['prevState', 'this.state'],
					values: [],
					arePartnersDifferent: false
				},
				terminal: true,
				description: 'Avoid calling setState here because it will trigger an extra render.'
			},
			componentWillUnmount: {
				args: [],
				props: {
					names: ['this.props'],
					values: []
				},
				state: {
					names: ['this.state'],
					values: []
				},
				terminal: true
			}
		};
	},

	getDisplayNames: function(methodName, type) {
		return this.properties[methodName][type];
	},

	get methodNames() {
		return Object.keys(this.properties);
	}

};

export default lifecycleConfig;