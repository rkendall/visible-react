'use strict';

import React, {Component, PropTypes} from 'react';

import Byline from './Byline';
import styles from '../styles/styles';

export default class Answer extends Component {
	
	static propTypes = {
		user: PropTypes.string.isRequired,
		date: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired
	};

	styles = {
		text: {
			paddingTop: '10px',
			borderTop: '1px solid lightgray',
			fontSize: '14px'
		}
	};

	render() {
		return (
			<div style={styles.answer} className='answer'>
				<Byline user={this.props.user} date={this.props.date} />
				<div className='answer-text' style={this.styles.text}>{this.props.text}</div>
			</div>
		);
	}

}