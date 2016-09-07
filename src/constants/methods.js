'use strict';

import deepEqual from 'deep-equal';

const methodProperties = (props = {}, state = {}) => {

	const comparisonCache = {};

	const compare = (value1, value2) => {
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
	};

	return {
		constructorMethod: {
			args: ['props'],
			state: [],
			props: [
				{
					name: 'props',
					value: props.initialProps,
					isChanged: true
				}
			],
			terminal: false,
			description: ''
		},
		componentWillMount: {
			args: [],
			state: [
				{
					name: 'this.state',
					value: state.initialState,
					isChanged: true
				}
			],
			props: [
				{
					name: 'this.props',
					value: props.initialProps,
					isChanged: false
				}
			],
			terminal: false,
			description: ''
		},
		componentDidMount: {
			args: [],
			state: [
				{
					name: 'this.state',
					value: state.mountedState,
					isChanged: false
				}
			],
			props: [
				{
					name: 'this.props',
					value: props.initialProps,
					isChanged: false
				}
			],
			terminal: true,
			description: 'Avoid calling setState here because it will trigger an extra render.'
		},
		componentWillReceiveProps: {
			args: ['nextProps'],
			state: [
				{
					name: 'this.state',
					value: state.rerenderedInitialState,
					isChanged: compare('mountedState', 'rerenderedInitialState')
				}
			],
			props: [
				{
					name: 'this.props',
					value: props.renderedInitialProps,
					isChanged: compare('initialProps', 'renderedInitialProps')
				},
				{
					name: 'nextProps',
					value: props.newProps,
					isChanged: compare('renderedInitialProps', 'newProps')
				}
			],
			propsNotEqual: compare('renderedInitialProps', 'newProps'),
			terminal: false
		},
		shouldComponentUpdate: {
			args: ['nextProps', 'nextState'],
			state: [
				{
					name: 'this.state',
					value: state.rerenderedInitialStateAfterProps,
					isChanged: compare('mountedState', 'rerenderedInitialStateAfterProps')
				},
				{
					name: 'nextState',
					value: state.rerenderedNewState,
					isChanged: compare('rerenderedInitialStateAfterProps', 'rerenderedNewState')
				}
			],
			stateNotEqual: compare('rerenderedInitialStateAfterProps', 'rerenderedNewState'),
			props: [
				{
					name: 'this.props',
					value: props.renderedInitialProps,
					isChanged: false
				},
				{
					name: 'nextProps',
					value: props.newProps,
					isChanged: false
				}
			],
			propsNotEqual: compare('renderedInitialProps', 'newProps'),
			terminal: false
		},
		componentWillUpdate: {
			args: ['nextProps', 'nextState'],
			state: [
				{
					name: 'this.state',
					value: state.rerenderedInitialStateAfterProps,
					isChanged: false
				},
				{
					name: 'nextState',
					value: state.rerenderedNewState,
					isChanged: compare('rerenderedInitialStateAfterProps', 'rerenderedNewState')
				}
			],
			stateNotEqual: compare('rerenderedInitialStateAfterProps', 'rerenderedNewState'),
			props: [
				{
					name: 'this.props',
					value: props.renderedInitialProps,
					isChanged: false
				},
				{
					name: 'nextProps',
					value: props.newProps,
					isChanged: false
				}
			],
			propsNotEqual: compare('renderedInitialProps', 'newProps'),
			terminal: false
		},
		render: {
			args: [],
			state: [
				{
					name: 'this.state',
					// Values depends on whether this is an initial render or a rerender
					value: state.rerenderedNewState !== null ? state.rerenderedNewState : state.mountedState,
					// Value is never changed if render is part of a rerender cycle but can change when mounting
					isChanged: compare(
						state.rerenderedInitialStateAfterProps !== null ? 'rerenderedInitialStateAfterProps' : 'rerenderedInitialStateAfterProps',
						state.rerenderedNewState !== null ? 'rerenderedNewState' : 'mountedState'
					)
				}
			],
			props: [
				{
					name: 'this.props',
					value: props.newProps !== null ? props.newProps : props.initialProps,
					isChanged: false
				}
			],
			terminal: false
		},
		componentDidUpdate: {
			args: ['prevProps', 'prevState'],
			state: [
				{
					name: 'prevState',
					value: state.rerenderedInitialStateAfterProps,
					isChanged: false
				},
				{
					name: 'this.state',
					value: state.rerenderedNewState,
					isChanged: false
				}
			],
			stateNotEqual: compare('rerenderedInitialStateAfterProps', 'rerenderedNewState'),
			props: [
				{
					name: 'prevProps',
					value: props.renderedInitialProps,
					isChanged: false
				},
				{
					name: 'this.props',
					value: props.newProps,
					isChanged: false
				}
			],
			propsNotEqual: compare('renderedInitialProps', 'newProps'),
			terminal: true,
			description: 'Avoid calling setState here because it will trigger an extra render.'
		},
		componentWillUnmount: {
			args: [],
			state: [
				{
					name: 'this.state',
					value: state.rerenderedNewState,
					// TODO Technically this could change before component is unmounted
					isChanged: false
				}
			],
			props: [
				{
					name: 'this.props',
					value: props.newProps,
					isChanged: false
				}
			],
			terminal: true
		}
	};

};

export default methodProperties;