'use strict';

import React, {Component, PropTypes} from 'react';
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
			boxSizing: 'border-box'
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
			justifyContent: 'flex-start',
			boxSizing: 'border-box'
		},
		right: {
			display: 'flex',
			justifyContent: 'flex-end',
			boxSizing: 'border-box'
		},
		both: {
			display: 'flex',
			justifyContent: 'space-between',
			boxSizing: 'border-box'
		},
		center: {
			display: 'flex',
			justifyContent: 'center',
			boxSizing: 'border-box'
		},
		arrows: {
			display: 'flex',
			justifyContent: 'space-around',
			margin: '0 0 10px 0',
			fontSize: '16px',
			fontWeight: 'bold'
		}
	};

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
	
	makeProps = (methodName) => {
		return {
			methodObj: this.props.entry.getIn(['methods', methodName]),
			isChanged: this.props.entry.get('isChanged'),
			// TODO rename function to make it clear it's a callback
			showFullText: this.props.showFullText,
			key: methodName + '-method-box'
		};
	};

	render() {

		const entry = this.props.entry;
		if (!entry) {
			return false;
		}
		const methods = entry.get('methods');
		const isChanged = entry.get('isChanged');

		// TODO refactor repetitive code
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
					<Method {...this.makeProps('constructorMethod')} />
					<Method {...this.makeProps('componentWillUnmount')} />
				</div>
				<div style={this.styles.center}>
					<Method {...this.makeProps('componentWillReceiveProps')} />
				</div>
				<div style={this.styles.center}>
					<Method {...this.makeProps('shouldComponentUpdate')} />
				</div>
				<div style={this.styles.left}>
					<Method {...this.makeProps('componentWillMount')} />
					<Method {...this.makeProps('componentWillUpdate')} />
				</div>
				<div style={this.styles.left}>
					<Method {...this.makeProps('render')} />
				</div>
				<div style={this.styles.left}>
					<Method {...this.makeProps('componentDidMount')} />
					<Method {...this.makeProps('componentDidUpdate')} />
				</div>
			</div>
		)

	}

}

export default Radium(LifeCycle);