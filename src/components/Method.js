'use strict';

import React, {Component, PropTypes} from 'react';
import clone from 'clone';
import deep from 'deep';
import circular from 'smart-circular';
import Radium from 'radium';
import color from 'color';
import diff from 'diff';

import log from '../log';
import styles from '../styles/styles';

class Method extends Component {

	static propTypes = {
		methodObj: PropTypes.shape({
			name: PropTypes.string,
			called: PropTypes.bool,
			count: PropTypes.number,
			props: PropTypes.object,
			state: PropTypes.object,
			args: PropTypes.array
		}).isRequired
	};

	styles = {
		container: {
			display: 'flex',
			flexDirection: 'column'
		},
		section: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			flex: '1',
			width: '260px',
			height: '100%',
			margin: '0 10px',
			padding: '10px 10px 5px 10px',
			backgroundColor: 'white'
		},
		active: {
			boxShadow: '0 0 10px 6px #2d7188',
			fontWeight: 'bold',
			animation: 'x .7s ease-out',
			animationName: Radium.keyframes({
				'0%': {boxShadow: 'none'},
				'40%': {boxShadow: '0 0 14px 9px ' + color('#2d7188').lighten(0.5).hexString()},
				'100%': {boxShadow: '0 0 10px 6px #2d7188'}
			})
		},
		inactive: {
			fontWeight: 'normal',
			boxShadow: 'none'
		},
		methodName: {
			fontWeight: 'bold'
		},
		line: {
			display: 'flex'
		},
		value: {
			display: 'inline-block',
			marginLeft: '5px',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			fontWeight: 'normal'
		},
		times: {
			display: 'flex',
			justifyContent: 'space-between',
			marginTop: '5px'
		},
		warning: {
			color: 'red'
		},
		message: {
			marginTop: '5px',
			color: 'red'
		},
		setStateContainer: {
			marginTop: '10px'
		},
		setState: {
			margin: '5px -5px 0 -5px',
			padding: '5px',
			backgroundColor: 'rgba(76, 175, 80, .5)'
		},
		arrow: {
			display: 'flex',
			justifyContent: 'space-around',
			alignItems: 'center',
			margin: '5px 0 7px 0',
			fontSize: '16px',
			fontWeight: 'bold'
		},
		hidden: {
			opacity: '0'
		},
		heading: {
			marginBottom: '5px'
		},
		input: {
			width: '100%',
			marginLeft: '5px'
		}
	};

	methodProperties = {
		constructor: {
			args: ['props'],
			terminal: false,
			description: 'Remove/add the Child Component to see the effect of changes you make here using setState.'
		},
		componentWillMount: {
			args: [],
			terminal: false,
			description: 'Remove/add the Child Component to see the effect of changes you make here using setState.'
		},
		componentDidMount: {
			args: [],
			terminal: true,
			description: 'Avoid calling setState here because it will trigger an extra render.'
		},
		componentWillReceiveProps: {
			args: ['nextProps'],
			terminal: false
		},
		shouldComponentUpdate: {
			args: ['nextProps', 'nextState'],
			terminal: false
		},
		componentWillUpdate: {
			args: ['nextProps', 'nextState'],
			terminal: false
		},
		render: {
			args: [],
			terminal: false
		},
		componentDidUpdate: {
			args: ['prevProps', 'prevState'],
			terminal: true,
			description: 'Avoid calling setState here because it will trigger an extra render. It can also initiate an infinite rendering loop ' +
			'(use the "text +=" option below to see an example of this).'
		},
		componentWillUnmount: {
			args: [],
			terminal: true
		}

	};

	constructor(props) {
		super(props);
		console.debug('props', props);
		const name = this.props.methodObj.name;
		let setStateType = 'none';
		let value = '';
		if (name === 'constructor') {
			setStateType = 'set';
			value = 'This is my text';
		}
		this.state = {
			name,
			setStateType,
			value
		}
	}

	// componentWillMount() {
	// 	log.set(clone(this.state));
	// }
	//
	// componentWillUpdate(nextProps, nextState) {
	// 	log.set(clone(nextState));
	// }

	getArgNames = (methodObj) => {
		const args = this.methodProperties[methodObj.name].args;
		return {
			str: args.join(', '),
			arr: args
		}
	};

	getActivityStyle = (methodObj) => {
		const isActive = methodObj.called;
		let style = isActive ? this.styles.active : this.styles.inactive;
		if (methodObj.name === 'render') {
			style.width = '560px'
		}
		return Object.assign({}, this.styles.section, style);
	};

	getTimesCalled = (methodObj) => {
		const loop = methodObj.isInfiniteLoop ? (<div style={this.styles.warning}>(infinite loop terminated)</div>) : false;
		return (
			<div style={this.styles.times}><div>Times called: {methodObj.count}</div>{loop}</div>
		);
	};

	getLines = (setStateType, methodObj) => {
		const ind = setStateType === 'props' ? 0 : 1;
		const argName = this.getArgNames(methodObj).arr[ind];
		const isSecond = true;
		if (!argName) {
			return this.getText(setStateType, methodObj);
		} else if (argName.indexOf('next') === 0) {
			return [
				this.getText(setStateType, methodObj),
				this.getArgText(setStateType, methodObj, isSecond)
			];
		} else {
			const isSecond = true;
			return [
				this.getArgText(setStateType, methodObj),
				this.getText(setStateType, methodObj, isSecond)
			];
		}
	};

	getText = (setStateType, methodObj, isSecond) => {
		const arrow = isSecond ? '↳' : '';
		return (
			<div key={`${methodObj.name}-this-${setStateType}`} style={this.styles.line}>
				<div>{arrow}this.{setStateType}:</div>
				<div style={[this.styles.value, styles[setStateType]]}>{methodObj[setStateType] ? JSON.stringify(methodObj[setStateType]) : ''}</div>
			</div>
		);
	};

	getArgText = (setStateType, methodObj, isSecond) => {
		const ind = setStateType === 'props' ? 0 : 1;
		const argName = this.getArgNames(methodObj).arr[ind];
		if (!argName) {
			return false;
		}
		console.debug('args', methodObj.args[ind]);
		const argValue = methodObj.args[ind] ? JSON.stringify(methodObj.args[ind]) : '';
		const arrow = isSecond ? '↳' : '';
		return (
			<div key={methodObj.name + '-' + argName} style={this.styles.line}>
				<div>{arrow}{argName}:</div>
				<div style={[this.styles.value, styles[setStateType]]}>{argValue}</div>
			</div>
		);
	};

	diffText = (before, after) => {
		const result = diff.diffChars(before, after);
		let html = [];

		result.forEach(function(part){
			// green for additions, red for deletions
			// grey for common parts
			const color = part.added ? 'added' :
				part.removed ? 'removed' : 'unchanged';
			html.push(
				<span style={this.styles[color]}>part.value</span>
			)
		});
	};

	getUnnecessaryUpdatePrevented = () => {
		return this.props.methodObj.isUnnecessaryUpdatePrevented
			? (<div style={this.styles.message}>Unnecessary rerender prevented (props and state values have not changed)</div>)
			: false;
	};

	getDescription = () => {
		const description = this.methodProperties[this.props.methodObj.name].description;
		return (
			<div style={styles.description}>{description}</div>
		);
	};

	getSetState = (methodObj) => {
		const validMethods = [
			'constructor',
			'componentWillMount',
			'componentDidMount',
			'componentWillReceiveProps',
			'componentDidUpdate'
		];
		const name = methodObj.name;
		if (this.props.isCompactView || !validMethods.includes(name)) {
			return false;
		}

		const heading = methodObj.name === 'constructor' ? 'this.state =' : 'this.setState';
		const inputDisabled = this.state.setStateType === 'none' || this.state.setStateType === 'props';

		return (
			<div style={this.styles.setStateContainer}>
				{this.getDescription()}
				<div style={this.styles.setState}>
					<div style={this.styles.heading}>{heading}</div>
					<div style={this.styles.line}>
						<select value={this.state.setStateType} onChange={this.handleSelectChange}>
							<option value='none'>don't set</option>
							<option value='set'>text =</option>
							<option value='add'>text +=</option>
							<option value='props'>text = parentText</option>
						</select>
						<input type='text' value={this.state.value} disabled={inputDisabled}
							   onChange={this.handleInputChange} style={this.styles.input}/>
					</div>
				</div>
			</div>
		)
	};

	getArrow = () => {
		if (this.props.isCompactView) {
			return (<div style={this.styles.arrow}></div>);
		} else if (this.props.methodObj.name === 'render') {
			return (
				<div style={this.styles.arrow}>
					<div>↓</div>
					<div>↓</div>
				</div>
			)
		} else if (!this.methodProperties[this.props.methodObj.name].terminal) {
			return (<div style={this.styles.arrow}>↓</div>);
		} else {
			return (<div style={[this.styles.arrow, this.styles.hidden]}>↓</div>);
		}
	};

	handleSelectChange = (event) => {
		const setStateType = event.target.value;
		let value = this.state.value;
		if (setStateType === 'none' || setStateType === 'props') {
			value = '';
		}
		this.setState({
			setStateType,
			value
		});
	};

	handleInputChange = (event) => {
		this.setState({
			value: event.target.value
		});
	};

	render() {

		const {methodObj} = this.props;

		return (
			<div style={this.styles.container}>
				<div style={this.getActivityStyle(methodObj)}>
					<div>
						<div style={this.styles.methodName}>{methodObj.name}({this.getArgNames(methodObj).str})</div>
						{this.getTimesCalled(methodObj)}
						{this.getLines('props', methodObj)}
						{this.getLines('state', methodObj)}
						{this.getUnnecessaryUpdatePrevented()}
					</div>
					{/*this.getSetState(methodObj)*/}
				</div>
				{this.getArrow()}
			</div>
		)

	}

}

export default Radium(Method);