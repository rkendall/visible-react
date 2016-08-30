'use strict';

import React, {Component, PropTypes} from 'react';
import Insure from '../../components/Insure';

import Byline from './Byline';
import styles from '../styles/styles';

class Answer extends Component {
	
	static propTypes = {
		id: PropTypes.string,
		user: PropTypes.string.isRequired,
		date: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired
	};

	static defaultProps = {
		id: ''
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
				<Byline id={'answer-' + this.props.id} user={this.props.user} date={this.props.date} />
				<div className='answer-text' style={this.styles.text}>{this.props.text}</div>
			</div>
		);
	}

}

export default Insure(Answer);