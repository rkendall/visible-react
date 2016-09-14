'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var methodProperties = {
	constructor: {
		args: ['props'],
		state: [],
		props: [{
			name: 'props',
			value: 'newProps'
		}],
		terminal: false,
		description: ''
	},
	componentWillMount: {
		args: [],
		state: [{
			name: 'this.state',
			value: 'newState'
		}],
		props: [{
			name: 'this.props',
			value: 'newProps'
		}],
		terminal: false,
		description: ''
	},
	componentDidMount: {
		args: [],
		state: [{
			name: 'this.state',
			value: 'newState'
		}, {
			name: '(final state)',
			value: 'updatedNewState'
		}],
		props: [{
			name: 'this.props',
			value: 'newProps'
		}],
		terminal: true,
		description: 'Avoid calling setState here because it will trigger an extra render.'
	},
	componentWillReceiveProps: {
		args: ['nextProps'],
		state: [{
			name: 'this.state',
			value: 'oldState'
		}],
		props: [{
			name: 'this.props',
			value: 'oldProps'
		}, {
			name: 'nextProps',
			value: 'newProps'
		}],
		terminal: false
	},
	shouldComponentUpdate: {
		args: ['nextProps', 'nextState'],
		state: [{
			name: 'this.state',
			value: 'oldState'
		}, {
			name: 'nextState',
			value: 'newState'
		}],
		props: [{
			name: 'this.props',
			value: 'oldProps'
		}, {
			name: 'nextProps',
			value: 'newProps'
		}],
		terminal: false
	},
	componentWillUpdate: {
		args: ['nextProps', 'nextState'],
		state: [{
			name: 'this.state',
			value: 'oldState'
		}, {
			name: 'nextState',
			value: 'newState'
		}],
		props: [{
			name: 'this.props',
			value: 'oldProps'
		}, {
			name: 'nextProps',
			value: 'newProps'
		}],
		terminal: false
	},
	render: {
		args: [],
		state: [{
			name: 'this.state',
			value: 'newState'
		}],
		props: [{
			name: 'this.props',
			value: 'newProps'
		}],
		terminal: false
	},
	componentDidUpdate: {
		args: ['prevProps', 'prevState'],
		state: [{
			name: 'prevState',
			value: 'oldState'
		}, {
			name: 'this.state',
			value: 'newState'
		}, {
			name: '(final state)',
			value: 'updatedNewState'
		}],
		props: [{
			name: 'prevProps',
			value: 'oldProps'
		}, {
			name: 'this.props',
			value: 'newProps'
		}],
		terminal: true,
		description: 'Avoid calling setState here because it will trigger an extra render.'
	},
	componentWillUnmount: {
		args: [],
		state: [{
			name: 'this.state',
			value: 'newState'
		}],
		props: [{
			name: 'this.props',
			value: 'newProps'
		}],
		terminal: true
	}

};

exports.default = methodProperties;
module.exports = exports['default'];