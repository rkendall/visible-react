'use strict';

import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
import color from 'color';
import Immutable from 'immutable';

import Utf8Char from './Utf8Char';
import styles from '../styles/styles';

class Method extends Component {

	static propTypes = {
		methodObj: PropTypes.instanceOf(Immutable.Map).isRequired,
		isChanged: PropTypes.object.isRequired,
		showFullText: PropTypes.func.isRequired
	};

	// TODO need to install react-immutable-proptypes to do this
	// static propTypes = {
	// 	methodObj: PropTypes.shape({
	// 		name: PropTypes.string,
	// 		called: PropTypes.bool,
	// 		count: PropTypes.number,
	// 		props: PropTypes.object,
	// 		state: PropTypes.object,
	// 		args: PropTypes.array
	// 	}).isRequired
	// };


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
			flex: '1',
			position: 'relative',
			fontWeight: 'bold',
			wordBreak: 'break-word'
		},
		methodNameWithIcon: {
			marginLeft: '21px'
		},
		methodIcon: {
			position: 'absolute',
			width: '16px',
			height: '16px',
			alignSelf: 'flex-start',
			marginRight: '5px',
			borderRadius: '50%',
			cursor: 'default',
			boxShadow: 'rgba(0, 0, 0, 0.2) -1px -1px 1px inset, rgba(255, 255, 255, 0.5) 1px 1px 1px inset',
			background: 'linear-gradient(to bottom, lightblue 0%, ' + color('lightblue').darken(0.5).hexString() + ' 100%)'
		},
		propsAndState: {
			display: 'flex',
			alignItems: 'center'
		},
		propsAndStateChanged: {
			fontWeight: 'bold',
			animation: 'x .7s ease-out',
			animationName: Radium.keyframes({
				'0%': {backgroundColor: 'white'},
				'40%': {backgroundColor: 'yellow'},
				'100%': {backgroundColor: 'white'}
			})
		},
		propsAndStateUnchanged: {
			fontWeight: 'normal',
			color: 'gray'
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
		setStateValue: {
			marginTop: '5px'
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
			showFullText: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps !== this.props
			|| nextState.showFullText !== this.state.showFullText
		);
	}

	getMethodName = (methodObj) => {
		const args = this.getArgNames(methodObj).str;
		const name = methodObj.name === 'constructorMethod'
			? `constructor(${args}) or getInitialState()`
			: `${methodObj.name}(${args})`;
		let methodIcon = '';
		let nameStyle = {};
		if (methodObj.isMethodOverridden) {
			const iconMessage = 'This method exists in the wrapped component';
			methodIcon = (<div style={this.styles.methodIcon} title={iconMessage}></div>);
			nameStyle = this.styles.methodNameWithIcon;
		}
		return (
			<div id={name + '-name-icon'}>
				<div style={this.styles.methodName}>
					{methodIcon}
					<div style={nameStyle}>{name}</div>
				</div>
			</div>
		);
	};

	getArgNames = (methodObj) => {
		const args = methodObj.args;
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
			const propsOrState = methodObj[type];
			const values = propsOrState.values;
			const nameComponents = propsOrState.names.map((name, ind) => {
				return this.getPropAndStateName(name, type, ind);
			});
			// Display both values only if one has changed
			let valueComponents = false;
			if (values.length) {
				const isParallelItemDifferent = propsOrState.arePartnersDifferent;
				const valuesToDisplay = !isParallelItemDifferent && values.length === 2
					? values.slice(0, 1)
					: values;
				valueComponents = valuesToDisplay.map((item, ind) => {
					return this.getPropAndStateValues(valuesToDisplay, ind, type, propsOrState.isChanged);
				});
			}

			return this.getPropAndStateComponents({
				name:methodObj.name,
				type,
				nameComponents,
				valueComponents
			});
		});
	};

	getPropAndStateName = (name, type, ind) => {
		const isSecond = ind > 0;
		const arrow = isSecond ? (<Utf8Char char='rightArrow' />) : '';
		return (
			<div key={`${name}-${ind}`} style={this.styles.line}>
				<div>{arrow}{name}:</div>
			</div>
		);
	};

	getPropAndStateValues = (valuesToDisplay, ind, type, isChanged) => {
		const value = valuesToDisplay[ind];
		const isChangedStyle = isChanged && ((valuesToDisplay.length === 1 && ind === 0) || ind === 1)
			? this.styles.propsAndStateChanged
			: this.styles.propsAndStateUnchanged;
		return (
			<div
				key={'value-' + ind}
				onClick={this.handleShowFullText.bind(this, valuesToDisplay)}
				style={[this.styles.value, styles[type], isChangedStyle]}
			>
				{value ? JSON.stringify(value).substr(0, 300) : ''}
			</div>
		);
	};

	handleShowFullText = (items) => {
		this.props.showFullText(items);
	};

	getUnnecessaryUpdatePrevented = (methodObj) => {
		return methodObj.isUnnecessaryUpdatePrevented
			? (<div style={this.styles.message}>Unnecessary rerender prevented (props and state values have not
			changed)</div>)
			: false;
	};

	getDescription = (methodObj) => {
		const description = methodObj.description;
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
		if (validMethods.indexOf(name) === -1) {
			return false;
		}
		const label = methodObj.name === 'constructorMethod' ? 'this.state = x' : 'this.setState(x)';
		let stateToDisplay = false;
		let description = false;
		if (methodObj.isSetStateCalled) {
			stateToDisplay = this.getSetStateNameAndValues(methodObj);
			description = this.getDescription(methodObj);
		}
		return (
			<div key={label}>
				<div style={this.styles.setState}>
					{label}
				</div>
				<div style={this.styles.setStateValue}>
					{stateToDisplay}
					{description}
				</div>
			</div>
		);
	};

	getSetStateNameAndValues = (methodObj) => {
		const name = methodObj.setState.names[0]
		const ind = 0;
		const nameComponents = this.getPropAndStateName(name, 'state', ind);
		const valueToDisplay = methodObj.setState.values;
		const valueComponents =  this.getPropAndStateValues(valueToDisplay, ind, 'state', methodObj.setState.isChanged);
		return this.getPropAndStateComponents({
			name,
			type: 'state',
			nameComponents,
			valueComponents
		});
	};

	getPropAndStateComponents = (dataObj) => {

		const baseKey = `${dataObj.name}-${dataObj.type}`;
		return (
			<div key={baseKey} style={this.styles.propsAndState}>
				<div key={baseKey + '-label'} style={this.styles.label}>{dataObj.nameComponents}</div>
				<div key={baseKey + '-value'} style={this.styles.valueContainer}>{dataObj.valueComponents}</div>
			</div>
		);

	};

	getArrow = (methodObj) => {
		const arrow = (<Utf8Char char='downArrow' />);
		if (this.props.isCompactView) {
			return (<div style={this.styles.arrow}></div>);
		} else if (methodObj.name === 'render') {
			return (
				<div key={methodObj.name + '-arrows'} style={this.styles.arrow}>
					<div>{arrow}</div>
					<div>{arrow}</div>
				</div>
			)
		} else if (!methodObj.terminal) {
			return (<div key={methodObj.name + '-arrows'} style={this.styles.arrow}>{arrow}</div>);
		} else {
			return (<div key={methodObj.name + '-arrows'} style={[this.styles.arrow, this.styles.hidden]}>{arrow}</div>);
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