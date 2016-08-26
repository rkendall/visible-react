'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import deepcopy from 'deepcopy';
import RaisedButton from 'material-ui/RaisedButton';
import Monitor from '../../components/Monitor';

import Question from './Question';
import styles from '../styles/styles';

// Export unconnected component for testing
export class QuestionList extends Component {
	
	getQuestionList = () => {
		return this.props.questions.map((question, ind) => {
			return (
				<Question
					{...question}
					key={'question' + ind}
				/>
			);
		});
	};

	showSubmitQuestion = () => {
		hashHistory.push('new-question');
	};

	render() {
		return (
			<div>
				<div>
					<RaisedButton
						id='new-question-button'
						label='Ask a Question'
						onClick={this.showSubmitQuestion}
						primary={true}
					/>
				</div>
				<div style={styles.heading}>Questions</div>
				<div>{this.getQuestionList()}</div>
			</div>
		);
	}

}

export default Monitor(connect(
	(state) => deepcopy(state)
)(QuestionList));