'use strict';

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import connect from 'react-redux';
import Radium from 'radium';
import color from 'color';
import deepEqual from 'deep-equal';
import shallowEqual from 'shallowequal';

import styles from '../styles/styles';
import methodProperties from '../constants/methods.js';

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
		section: {
			width: '275px',
			margin: '0 10px',
			padding: '10px 10px 5px 10px',
			backgroundColor: 'white',
			boxSizing: 'border-box'
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
			display: 'flex',
			alignItems: 'center',
			fontWeight: 'bold',
			wordBreak: 'break-word'
		},
		methodIcon: {
			width: '16px',
			height: '16px',
			marginRight: '5px',
			background: 'lightblue',
			borderRadius: '50%',
			boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
			cursor: 'default'
		},
		propsAndState: {
			display: 'flex',
			alignItems: 'center'
		},
		line: {
			display: 'flex'
		},
		valueContainer: {
			overflow: 'hidden'
		},
		value: {
			marginLeft: '5px',
			fontWeight: 'normal',
			cursor: 'pointer',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap'
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
		setState: {
			display: 'flex',
			alignItems: 'center',
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
		input: {
			width: '100%',
			marginLeft: '5px'
		}
	};

	constructor() {
		super();
		this.state = {
			showFullText: false,
			fadeDraggableWindow: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps !== this.props
			|| !shallowEqual(nextState, this.state)
		);
	}

	getMethodName = (methodObj) => {
		const args = this.getArgNames(methodObj).str;
		const name = methodObj.name === 'constructorMethod'
			? `constructor(${args}) or getInitialState()`
			: `${methodObj.name}(${args})`;
		const iconMessage = 'This method exists in the wrapped component';
		const methodIcon = methodObj.isMethodOverridden ? (
			<div style={this.styles.methodIcon} title={iconMessage}></div>
		) : '';
		return (
			<div key={name + '-name-icon'}>
				<div style={this.styles.methodName}>
					{methodIcon}
					<div>{name}</div>
				</div>
			</div>
		);
	};

	getArgNames = (methodObj) => {
		const args = methodProperties[methodObj.name].args;
		return {
			str: args.join(', '),
			arr: args
		}
	};

	getActivityStyle = (methodObj) => {
		const isActive = methodObj.called;
		let style = isActive ? this.styles.active : this.styles.inactive;
		if (methodObj.name === 'render') {
			style.width = '570px'
		}
		return Object.assign({}, this.styles.section, style);
	};

	getTimesCalled = (methodObj) => {
		const loop = methodObj.isInfiniteLoop ? (
			<div style={this.styles.warning}>(infinite loop terminated)</div>) : false;
		return (
			<div style={this.styles.times}>
				<div>Times called: {methodObj.count}</div>
				{loop}</div>
		);
	};

	// TODO Refactor for clarity
	getPropsAndStates = (methodObj) => {
		let types = ['props', 'state'];
		return types.map((type) => {
			const items = methodProperties[methodObj.name][type].slice();
			let filteredItems = items.filter((item) => {
			    if (item.value !== 'updatedNewState') {
					return item;
				}
			});
			const names = filteredItems.map((item, ind) => {
				const isSecond = ind > 0;
				return this.getPropAndStateNames(item.name, type, isSecond);
			});
			// Display both values only if one has changed
			const itemsForValues = this.props.isChanged[type]
				? filteredItems.slice()
				: [filteredItems.slice()[0]];
			const values = itemsForValues.map((item) => {
				if (!item) {
					return '';
				}
				return this.getPropAndStateValues(methodObj[item.value], type, methodObj);
			});
			const baseKey = `${methodObj.name}-${type}`;
			return (
				<div key={baseKey} style={this.styles.propsAndState}>
					<div key={baseKey + '-label'} style={this.styles.label}>{names}</div>
					<div key={baseKey + '-value'} style={this.styles.valueContainer}>{values}</div>
				</div>
			);
		});
	};

	getPropAndStateNames = (name, type, isSecond) => {
		const arrow = isSecond ? '↳' : '';
		return (
			<div style={this.styles.line}>
				<div>{arrow}{name}:</div>
			</div>
		);
	};

	getPropAndStateValues = (value, type, methodObj) => {
		return (
			<div
				onClick={this.showFullText.bind(this, type, value, methodObj)}
				style={[this.styles.value, styles[type]]}
			>
				{value ? JSON.stringify(value) : ''}
			</div>
		);
	};

	showFullText = (type, value, methodObj) => {
		this.props.showFullText(type, value, methodObj);
	};

	getUnnecessaryUpdatePrevented = (methodObj) => {
		return methodObj.isUnnecessaryUpdatePrevented
			? (<div style={this.styles.message}>Unnecessary rerender prevented (props and state values have not
			changed)</div>)
			: false;
	};

	getDescription = (methodObj) => {
		const description = methodProperties[methodObj.name].description;
		if (description) {
			return (
				<div style={styles.description}>{description}</div>
			);
		} else {
			return false;
		}
	};

	getSetState = (methodObj) => {
		const validMethods = [
			'constructorMethod',
			'componentWillMount',
			'componentDidMount',
			'componentWillReceiveProps',
			'componentDidUpdate'
		];
		const name = methodObj.name;
		if (!validMethods.includes(name)) {
			return false;
		}
		const label = methodObj.name === 'constructorMethod' ? 'this.state can be set here' : 'this.setState is available here';
		return (
			<div>
				<div style={this.styles.setState}>
					{label}
				</div>
				{this.getDescription(methodObj)}
			</div>
		);
	};

	getArrow = (methodObj) => {
		if (this.props.isCompactView) {
			return (<div style={this.styles.arrow}></div>);
		} else if (methodObj.name === 'render') {
			return (
				<div style={this.styles.arrow}>
					<div>↓</div>
					<div>↓</div>
				</div>
			)
		} else if (!methodProperties[methodObj.name].terminal) {
			return (<div style={this.styles.arrow}>↓</div>);
		} else {
			return (<div style={[this.styles.arrow, this.styles.hidden]}>↓</div>);
		}
	};

	handleInputChange = (event) => {
		this.setState({
			value: event.target.value
		});
	};

	render() {

		const methodObj = this.props.methodObj.toJS();
		return (
			<div>
				<div style={this.getActivityStyle(methodObj)}>
					{this.getMethodName(methodObj)}
					{this.getTimesCalled(methodObj)}
					{this.getPropsAndStates(methodObj)}
					{this.getUnnecessaryUpdatePrevented(methodObj)}
					{this.getSetState(methodObj)}
				</div>
				{this.getArrow(methodObj)}
			</div>
		)

	}

}

export default Radium(Method);