'use strict';

import React, {Component, PropTypes} from 'react';
import clone from 'deep-copy';
import Radium from 'radium';

import Method from './Method';
import styles from '../styles/styles';

class LifeCycle extends Component {

	styles = {
		container: {
			width: '900px',
			minWidth: '900px',
			padding: '10px',
			backgroundColor: 'lightblue',
			fontFamily: 'Arial, Helvetica, sans-serif',
			fontSize: '12px'
		},
		title: {
			display: 'flex',
			justifyContent: 'space-around',
			marginBottom: '15px',
			fontSize: '18px',
			fontWeight: 'bold'
		},
		heading: {
			display: 'flex',
			justifyContent: 'space-around',
			marginBottom: '0',
			fontSize: '13px',
			fontWeight: 'bold'
		},
		toggleContainer: {
			position: 'absolute',
			float: 'left',
			cursor: 'pointer'
		},
		toggle: {
			cursor: 'pointer'
		},
		text: {
			textIndent: '-10px'
		},
		left: {
			display: 'flex',
			justifyContent: 'flex-start'
		},
		right: {
			display: 'flex',
			justifyContent: 'flex-end'
		},
		both: {
			display: 'flex',
			justifyContent: 'space-between'
		},
		center: {
			display: 'flex',
			justifyContent: 'center'
		},
		arrows: {
			display: 'flex',
			justifyContent: 'space-around',
			margin: '0 0 10px 0',
			fontSize: '16px',
			fontWeight: 'bold'
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			logEntry: clone(this.props.logEntry)
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			logEntry: clone(nextProps.logEntry)
		});
	}

	getArrows = () => {
		if (!this.props.isCompactView) {
			return (
				<div style={this.styles.arrows}>
					<div>↓</div>
					<div>↓</div>
					<div>↓</div>
				</div>
			);
		} else {
			return false;
		}
	};

	handleSetCompactView = (event) => {
		const value = event.target.checked;
		this.props.dispatch(setCompactView(value));
	};

	render() {

		const logData = this.state.logEntry;
		if (!Object.keys(logData).length) {
			return false;
		}
		const methods = logData.methods;

		return (
			<div style={this.styles.container}>
				{/*<div>
					<label style={this.styles.toggleContainer}><input type="checkbox" onChange={this.handleSetCompactView} style={this.styles.toggle} />Compact View</label>
					<div style={this.styles.title}>Lifecycle Methods for Child Component</div>
				</div>*/}
				<div style={this.styles.heading}>
					<div>Called on Initial Render</div>
					<div>Called on Each Rerender</div>
					<div>Called on Removal from DOM</div>
				</div>
				{this.getArrows()}
				<div style={this.styles.both}>
					<Method methodObj={methods.constructor} />
					<Method methodObj={methods.componentWillUnmount} />
				</div>
				<div style={this.styles.center}>
					<Method methodObj={methods.componentWillReceiveProps} />
				</div>
				<div style={this.styles.center}>
					<Method methodObj={methods.shouldComponentUpdate} />
				</div>
				<div style={this.styles.left}>
					<Method methodObj={methods.componentWillMount} />
					<Method methodObj={methods.componentWillUpdate} />
				</div>
				<div style={this.styles.left}>
					<Method methodObj={methods.render} />
				</div>
				<div style={this.styles.left}>
					<Method methodObj={methods.componentDidMount} />
					<Method methodObj={methods.componentDidUpdate} />
				</div>
			</div>
		)

	}

}

export default Radium(LifeCycle);