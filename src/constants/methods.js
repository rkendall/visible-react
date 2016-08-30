const methodProperties = {
	constructor: {
		args: ['props'],
		state: [],
		props: [
			{
				name: 'props',
				value: 'newProps'
			}
		],
		terminal: false,
		description: 'Remove/add the Child Component to see the effect of changes you make here using setState.'
	},
	componentWillMount: {
		args: [],
		state: [
			{
				name: 'this.state',
				value: 'newState'
			}
		],
		props: [
			{
				name: 'this.props',
				value: 'newProps'
			}
		],
		terminal: false,
		description: 'Remove/add the Child Component to see the effect of changes you make here using setState.'
	},
	componentDidMount: {
		args: [],
		state: [
			{
				name: 'this.state',
				value: 'newState'
			},
			{
				name: '(final state)',
				value: 'updatedNewState'
			}
		],
		props: [
			{
				name: 'this.props',
				value: 'newProps'
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
				value: 'oldState'
			}
		],
		props: [
			{
				name: 'this.props',
				value: 'oldProps'
			},
			{
				name: 'nextProps',
				value: 'newProps'
			}
		],
		terminal: false
	},
	shouldComponentUpdate: {
		args: ['nextProps', 'nextState'],
		state: [
			{
				name: 'this.state',
				value: 'oldState'
			},
			{
				name: 'nextState',
				value: 'newState'
			}
		],
		props: [
			{
				name: 'this.props',
				value: 'oldProps'
			},
			{
				name: 'nextProps',
				value: 'newProps'
			}
		],
		terminal: false
	},
	componentWillUpdate: {
		args: ['nextProps', 'nextState'],
		state: [
			{
				name: 'this.state',
				value: 'oldState'
			},
			{
				name: 'nextState',
				value: 'newState'
			}
		],
		props: [
			{
				name: 'this.props',
				value: 'oldProps'
			},
			{
				name: 'nextProps',
				value: 'newProps'
			}
		],
		terminal: false
	},
	render: {
		args: [],
		state: [
			{
				name: 'this.state',
				value: 'newState'
			}
		],
		props: [
			{
				name: 'this.props',
				value: 'newProps'
			}
		],
		terminal: false
	},
	componentDidUpdate: {
		args: ['prevProps', 'prevState'],
		state: [
			{
				name: 'prevState',
				value: 'oldState'
			},
			{
				name: 'this.state',
				value: 'newState'
			},
			{
				name: '(final state)',
				value: 'updatedNewState'
			}
		],
		props: [
			{
				name: 'prevProps',
				value: 'oldProps'
			},
			{
				name: 'this.props',
				value: 'newProps'
			}
		],
		terminal: true,
		description: 'Avoid calling setState here because it will trigger an extra render. It can also initiate an infinite rendering loop ' +
		'(use the "text +=" option below to see an example of this).'
	},
	componentWillUnmount: {
		args: [],
		state: [
			{
				name: 'this.state',
				value: 'newState'
			}
		],
		props: [
			{
				name: 'this.props',
				value: 'newProps'
			}
		],
		terminal: true
	}

};

export default methodProperties;