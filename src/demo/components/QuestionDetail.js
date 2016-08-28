'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import deepcopy from 'deepcopy';
import RaisedButton from 'material-ui/RaisedButton';
import Monitor from '../../components/Monitor';

import Keywords from './Keywords';
import Byline from './Byline';
import Answer from './Answer';
import SubmitAnswer from './SubmitAnswer';

import styles from '../styles/styles';

// Export unconnected component for testing
export class QuestionDetail extends Component {
	
	styles = {
		title: {
			margin: '10px 0 5px 0',
			fontSize: '18px',
			fontWeight: 'bold'
		},
		description: {
			paddingTop: '10px',
			borderTop: '1px solid lightgray',
			fontSize: '14px'
		}
	};

	componentWillMount() {
		// If the question ID in the URL is invalid, go to main page
		if (!this.getSelectedQuestion()) {
			hashHistory.push('/');
		}
	}

	getSelectedQuestion = () => {
		return this.props.questions.find((question) => {
			return question.id === this.props.params.id;
		});
	};

	getAnswerHeading = (answerCount) => {
		let label = 'Answer';
		if (answerCount !== 1) {
			label += 's';
		}
		return (
			<div id='answer-heading' style={styles.heading}>
				{answerCount} {label}
			</div>
		)
	};

	getAnswers = (answers) => {
		return answers.map((answer, ind) => {
			const id = 'answer-' + ind;
			return (<Answer {...answer} key={id} id={id}/>);
		});
	};

	handleBackButtonClick = () => {
		hashHistory.push('/');
	};

	render() {
		const question = this.getSelectedQuestion();
		if (!question) {
			return false;
		}
		return (
			<div>
				<RaisedButton
					id='back-button'
					label='Back to Questions'
					primary={true}
					onClick={this.handleBackButtonClick}
				/>
				<div style={styles.heading}>Question</div>
				<div id='question' style={styles.question}>
					<div id='title' style={this.styles.title}>
						{question.title}
					</div>
					<Keywords id={'question-details'} keywords={question.keywords} />
					<Byline id={'question-details'} user={question.user} date={question.date} />
					<div id='description' style={this.styles.description}>{question.description}</div>
				</div>
				{this.getAnswerHeading(question.answers.length)}
				{this.getAnswers(question.answers)}
				<SubmitAnswer questionId={question.id} />
			</div>
		)
	}

}

export default Monitor(connect(
	(state) => deepcopy(state)
)(QuestionDetail));