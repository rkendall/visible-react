'use strict';

import React, {Component, PropTypes} from 'react';
import Time from 'react-time'
import Visible from 'visible-react';

const Byline = React.createClass({

	propTypes: {
		user: PropTypes.string.isRequired,
		date: PropTypes.number.isRequired,
		answerCount: PropTypes.number
	},

	styles: {
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
	},

	getDefaultProps: function() {
		return {
			answerCount: null
		}
	},

	getInitialState: function() {
		return {
			user: this.props.user
		};
	},

	componentWillReceiveProps() {
		this.setState({
			propsReceived: true
		});
	},

	componentWillMount() {
		console.log('Byline will mount');
	},

	componentWillUnmount() {
		console.log('Byline mounted');
	},

	getAnswerCount: function() {
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
	},

	getName: function() {
		return (
			<span style={this.styles.name}>
				{this.props.user}
			</span>
		)
	},

	render: function() {
		return (
			<div style={this.styles.container}>
				<div style={this.styles.byline}>
					Posted by {this.getName()}, <Time value={this.props.date} format="YYYY/MM/DD" relative />
				</div>
				{this.getAnswerCount()}
			</div>
		);
	}

});

export default Visible()(Byline);