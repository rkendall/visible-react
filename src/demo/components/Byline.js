'use strict';

import React, {Component, PropTypes} from 'react';
import Time from 'react-time'

export default class Byline extends Component {

	static propTypes = {
		user: PropTypes.string.isRequired,
		date: PropTypes.number.isRequired,
		answerCount: PropTypes.number
	};

	static defaultProps = {
		answerCount: null
	};

	styles = {
		container: {
			display: 'flex',
			marginBottom: '10px',
			fontSize: '12px'
		},
		name: {
			color: '#ff4081'
		},
		answerCount: {
			marginLeft: '30px',
			fontWeight: 'bold'
		}
	};

	getAnswerCount = () => {
		if (this.props.answerCount === null) {
			return false;
		}
		let label = 'answer';
		if (this.props.answerCount !== 1) {
			label += 's';
		}
		return (
			<div style={this.styles.answerCount}>
				{this.props.answerCount} {label}
			</div>
		)
	};

	getName = () => {
		return (
			<span style={this.styles.name}>
				{this.props.user}
			</span>
		)
	};

	render() {
		return (
			<div style={this.styles.container}>
				<div style={this.styles.byline}>
					Posted by {this.getName()}, <Time value={this.props.date} format="YYYY/MM/DD" relative />
				</div>
				{this.getAnswerCount()}
			</div>
		);
	}

}