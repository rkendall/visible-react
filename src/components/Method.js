'use strict';

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import color from 'color';
import {diffJson} from 'diff';
import Draggable from 'react-draggable';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import log from '../log';
import styles from '../styles/styles';
import methodProperties from '../constants/methods';

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


	draggableWindowDimensions = {
		width: 800,
		height: 600
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
			fontSize: '13px',
			cursor: 'default'
		},
		line: {
			display: 'flex',
			whiteSpace: 'nowrap'
		},
		value: {
			display: 'inline-block',
			marginLeft: '5px',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			fontWeight: 'normal',
			cursor: 'pointer'
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
		},
		draggableWindow: {
			position: 'fixed',
			top: '10px',
			left: '10px',
			resize: 'both',
			width: this.draggableWindowDimensions.width + 'px',
			height: this.draggableWindowDimensions.height + 'px',
			overflow: 'auto',
			backgroundColor: 'white',
			border: '1px solid gray',
			boxShadow: '5px 5px 6px rgba(0, 0, 0, .4)',
			opacity: '1',
			animation: 'x .3s ease-in',
			animationName: Radium.keyframes({
				'0%': {opacity: '0'},
				'100%': {opacity: '1'}
			}),
			backfaceVisibility: 'hidden'
		},
		draggableWindowClosed: {
			opacity: '0',
			animation: 'x .3s ease-in',
			animationName: Radium.keyframes({
				'0%': {opacity: '1'},
				'100%': {opacity: '0'}
			}),
			backfaceVisibility: 'hidden'
		},
		handle: {
			display: 'flex',
			justifyContent: 'flex-end',
			alignItems: 'center',
			height: '30px',
			backgroundColor: 'lightgray',
			cursor: 'move'
		},
		windowContent: {
			margin: '0',
			padding: '10px'
		},
		close: {
			marginRight: '5px',
			cursor: 'pointer'
		},
		added: {
			backgroundColor: color('#4caf50').lighten(.5).hexString()
		},
		removed: {
			backgroundColor: color('red').lighten(.5).hexString()
		}
	};

	constructor(props) {
		super(props);
		const name = this.props.methodObj.name;
		let setStateType = 'none';
		let value = '';
		if (name === 'constructor') {
			setStateType = 'set';
			value = 'This is my text';
		}
		this.state = {
			showFullText: false,
			fadeDraggableWindow: false,
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
			<div>
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

	getPropsAndStates = () => {
		const types = ['props', 'state'];
		const methodObj = this.props.methodObj;
		return types.map((type) => {
			const itemNames = methodProperties[methodObj.name][type];
			return itemNames.map((nameObj, ind) => {
				const isSecond = ind > 0;
				return this.getText(nameObj.name, this.props.methodObj[nameObj.value], type, isSecond);
			});
		});
	};

	getText = (name, value, type, isSecond) => {
		const arrow = isSecond ? '↳' : '';
		return (
			<div key={`${this.props.methodObj.name}-${name}`} style={this.styles.line}>
				<div>{arrow}{name}:</div>
				<div
					onClick={this.showFullText.bind(this, type, value)}
					style={[this.styles.value, styles[type]]}
				>
					{value ? JSON.stringify(value) : ''}
				</div>
			</div>
		);
	};

	// TODOD Clean this up
	showFullText = (type, value) => {
		let fullText = '';
		const nameSuffix = type[0].toUpperCase() + type.substr(1);
		if (this.props.methodObj.oldState && this.props.methodObj.newState) {
			fullText = this.diffText(
				JSON.stringify(this.props.methodObj['old' + nameSuffix], null, 2),
				JSON.stringify(this.props.methodObj['new' + nameSuffix], null, 2)
			);
		} else {
			fullText = JSON.stringify(value, null, 2);
		}
		this.setState({
			showFullText: true,
			fullText
		});
	};

	diffText = (before, after) => {
		const self = this;
		const diff = diffJson(before, after);
		let html = [];
		diff.forEach(function(part) {
			// green for additions, red for deletions
			// grey for common parts
			const color = part.added ? 'added' :
				part.removed ? 'removed' : 'unchanged';
			html.push(
				<span style={self.styles[color]}>{part.value}</span>
			)
		});
		return html;
	};

	closeDraggableWindow = () => {
		const draggableWindow = ReactDOM.findDOMNode(this.refs.draggableWindow);
		this.setState({
			fadeDraggableWindow: true
		});
		setTimeout(() => {
			this.setState({
				showFullText: false,
				fadeDraggableWindow: false
			});
		}, 400);
	};

	getUnnecessaryUpdatePrevented = () => {
		return this.props.methodObj.isUnnecessaryUpdatePrevented
			? (<div style={this.styles.message}>Unnecessary rerender prevented (props and state values have not
			changed)</div>)
			: false;
	};

	getDescription = () => {
		const description = methodProperties[this.props.methodObj.name].description;
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
		} else if (!methodProperties[this.props.methodObj.name].terminal) {
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
		const bounds = {
			top: 0,
			right: window.innerWidth - this.draggableWindowDimensions.width - 20,
			bottom: window.innerHeight - this.draggableWindowDimensions.height - 20,
			left: 0
		};
		let draggableWindowStyle = [this.styles.draggableWindow];
		if (this.state.fadeDraggableWindow) {
			draggableWindowStyle.push(this.styles.draggableWindowClosed);
		}

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
						{/*this.getSetState(methodObj)*/}
					</div>
					{this.getArrow()}
				</div>
				{this.state.showFullText ?
					(<Draggable
						handle=".handle"
						bounds={bounds}
						zIndex={100}
					>
						<div style={draggableWindowStyle}>
							<div className="handle" style={this.styles.handle}>
								<div onClick={this.closeDraggableWindow} style={this.styles.close}>close</div>
							</div>
							<pre style={this.styles.windowContent}>{this.state.fullText}</pre>
						</div>
					</Draggable>)
					: false}
			</div>
		)

	}

}

export default Radium(Method);