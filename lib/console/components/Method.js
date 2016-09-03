'use strict';

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import color from 'color';
// import {diffJson} from 'diff';
import Draggable from 'react-draggable';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import deepEqual from 'deep-equal';
import shallowEqual from 'shallowequal';

import log from '../../insure/shared/log.js';
import styles from '../styles/styles';
import methodProperties from '../../insure/shared/constants/methods.js';

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
			flexDirection: 'column',
			height: '100%'
		},
		section: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			flex: '1',
			width: '275px',
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
			display: 'flex',
			alignItems: 'baseline',
			fontWeight: 'bold',
			wordBreak: 'break-word'
		},
		methodIcon: {
			marginRight: '5px',
			color: 'limegreen',
			fontSize: '12px',
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

	constructor(props) {
		super(props);
		this.state = {
			showFullText: false,
			fadeDraggableWindow: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps !== this.props
			|| !shallowEqual(nextState, this.state)
			|| !deepEqual(nextProps, this.props, {strict: true})
		);
	}

	getMethodName = () => {
		const methodObj = this.props.methodObj;
		const args = this.getArgNames(methodObj).str;
		const name = methodObj.name === 'constructor'
			? `constructor(${args}) or getInitialState()`
			: `${methodObj.name}(${args})`;
		const iconMessage = (<Tooltip id='iconTooltip'>This method exists in the wrapped component</Tooltip>);
		const methodIcon = methodObj.isMethodOverridden ? (
			<OverlayTrigger
				placement='right'
				overlay={iconMessage}
			>
				<div style={this.styles.methodIcon}>⬤</div>
			</OverlayTrigger>
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
			style.width = '560px'
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
	getPropsAndStates = () => {
		let types = ['props', 'state'];
		const methodObj = this.props.methodObj;
		return types.map((type) => {
			const items = methodProperties[methodObj.name][type].slice();
			const names = items.map((item, ind) => {
				const isSecond = ind > 0;
				return this.getPropAndStateNames(item.name, type, isSecond);
			});
			// Display both values only if one has changed
			const itemsForValues = this.props.isChanged[type]
				? items.slice()
				: [items.slice()[0]];
			const values = itemsForValues.map((item) => {
				if (!item) {
					return '';
				}
				return this.getPropAndStateValues(methodObj[item.value], type);
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

	getPropAndStateValues = (value, type) => {
		return (
			<div
				onClick={this.showFullText.bind(this, type, value, this.props.methodObj)}
				style={[this.styles.value, styles[type]]}
			>
				{value ? JSON.stringify(value) : ''}
			</div>
		);
	};

	showFullText = (type, value, methodObj) => {
		this.props.showFullText(type, value, methodObj);
	};

	getUnnecessaryUpdatePrevented = () => {
		return this.props.methodObj.isUnnecessaryUpdatePrevented
			? (<div style={this.styles.message}>Unnecessary rerender prevented (props and state values have not
			changed)</div>)
			: false;
	};

	getDescription = () => {
		const description = methodProperties[this.props.methodObj.name].description;
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
			'constructor',
			'componentWillMount',
			'componentDidMount',
			'componentWillReceiveProps',
			'componentDidUpdate'
		];
		const name = methodObj.name;
		if (!validMethods.includes(name)) {
			return false;
		}
		const label = methodObj.name === 'constructor' ? 'this.state can be set here' : 'this.setState is available here';
		return (
			<div>
				<div style={this.styles.setState}>
					{label}
				</div>
				{this.getDescription()}
			</div>
		);
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
		} else if (!methodProperties[this.props.methodObj.name].terminal) {
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

		const {methodObj} = this.props;
		return (
			<div>
				<div style={this.styles.container}>
					<div style={this.getActivityStyle(methodObj)}>
						<div>
							{this.getMethodName()}
							{this.getTimesCalled(methodObj)}
							{this.getPropsAndStates()}
							{this.getUnnecessaryUpdatePrevented()}
						</div>
						{this.getSetState(methodObj)}
					</div>
					{this.getArrow()}
				</div>
			</div>
		)

	}

}

export default Radium(Method);