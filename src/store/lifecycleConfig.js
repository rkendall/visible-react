'use strict';

import deepEqual from 'deep-equal';

const lifecycleConfig =  {

	// Remember to clear this each time
	comparisonCache: {},

	getLifecycle: (entry) => {
		this.comparisonCache = {};
		const lifecycleProperties = this.getProperties();
		const lifecycle = entry.map((method) => {
			const methodConfig = lifecycleProperties[method.name];
		    method.args = methodConfig.args;
			methodConfig.displayNames.forEach((name) => {

			});
		});
	},

	getPropsAndStates: (lifecycleProperties, propsAndStates) => {
		const names = lifecycleProperties.displayNames;
		// let modelObjects = names.map((name, ind) => {
		// 	let propsOrStates = modelObj[lifecycleProperties.lifecycleLocation].slice();
		// 	if (propsOrStates.length === 3) {
		// 		propsOrStates.shift();
		// 	}
		// 	let pointer = null;
		// 	if (propsOrStates[ind]) {
		// 		pointer = [lifecycleProperties.lifecycleLocation, ind];
		// 	}
		//     return {
		// 		name,
		// 		pointerToText: pointer,
		// 		isDifferentFromPreceding: ''
		// 	};
		// });
	},

	compareModelObjects: (value1, value2) => {
		const values = Object.assign({}, props, state);
		if (!Object.keys(values).length) {
			return false;
		}
		const id = value1 + '-' + value2;
		if (comparisonCache.hasOwnProperty(id)) {
			return comparisonCache[id];
		} else {
			const result = !deepEqual(values[value1], values[value2]);
			comparisonCache[id] = result;
			return result;
		}
	},
	
	getProperties: () => {
		return {
			constructorMethod: {
				args: ['props'],
				displayNames: {
					props: ['props']
				},
				save: ['props'],
				terminal: false
			},
			componentWillMount: {
				args: [],
				displayNames: {
					props: ['this.props'],
					state: ['this.state']
				},
				save: ['state'],
				terminal: false
			},
			componentDidMount: {
				args: [],
				displayNames: {
					props: ['this.props'],
					state: ['this.state']
				},
				terminal: true,
				description: 'Avoid calling setState here because it will trigger an extra render.'
			},
			componentWillReceiveProps: {
				args: ['nextProps'],
				displayNames: {
					props: ['this.props', 'nextProps'],
					state: ['this.state']
				},
				save: ['props', 'state'],
				terminal: false
			},
			shouldComponentUpdate: {
				args: ['nextProps', 'nextState'],
				displayNames: {
					props: ['this.props', 'nextProps'],
					state: ['this.state', 'nextState']
				},
				save: ['state'],
				terminal: false
			},
			componentWillUpdate: {
				args: ['nextProps', 'nextState'],
				displayNames: {
					props: ['this.props', 'nextProps'],
					state: ['this.state', 'nextState']
				},
				terminal: false
			},
			render: {
				args: [],
				displayNames: {
					props: ['this.props'],
					state: ['this.state']
				},
				save: ['state'],
				terminal: false
			},
			componentDidUpdate: {
				args: ['prevProps', 'prevState'],
				displayNames: {
					props: ['prevProps', 'this.props'],
					state: ['prevState', 'this.state']
				},
				terminal: true,
				description: 'Avoid calling setState here because it will trigger an extra render.'
			},
			componentWillUnmount: {
				args: [],
				displayNames: {
					props: ['this.props'],
					state: ['this.state']
				},
				save: ['state'],
				terminal: true
			}
		};
	}

};

export default lifecycleConfig;