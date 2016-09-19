'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Visible from 'visible-react';

import {addAnswer} from '../actions/actions';
import styles from '../styles/styles';

class SubmitAnswer extends Component {

	static propTypes = {
		questionId: PropTypes.string.isRequired
	};

	styles = {
		container: {
			display: 'flex',
			flexDirection: 'column'
		},
		textArea: {
			resize: 'vertical',
			marginBottom: '20px',
			border: '1px solid lightgray',
			outline: 'none'
		},
		submitButton: {
			marginTop: '20px',
			fontSize: '12px',
			cursor: 'pointer'
		}
	};

	constructor() {
		super();
		this.state = {
			answerText: ''
		};
	}

	componentDidMount() {
		console.log('CDM called in submit');
		this.setState({
			mounted: true
		});
	}

	componentWillReceiveProps() {
		console.log('componentWillReceiveProps called in Q&A');
	};

	// shouldComponentUpdate(nextProps, nextState) {
	// 	return nextState.answerText !== this.state.answerText;
	// }

	componentDidUpate() {
		console.log('componentDidUpate called in Q&A');
	};

	updateEntry = (event) => {
		this.setState({
			answerText: event.target.value
		});
	};

	handleSubmitClicked = () => {
		this.props.dispatch(addAnswer(this.props.questionId, this.state.answerText));
		this.setState({
			answerText: ''
		});
	};

	render() {
		const mounted = this.state.mounted;
		return (
			<div style={this.styles.container}>
				<div style={styles.heading}>Post an Answer</div>
				<textarea
					rows='10'
					style={this.styles.textArea}
					value={this.state.answerText}
					onChange={this.updateEntry}
					placeholder='Add your answer to this question here. The more on topic the better.'
				/>
				<div>
					<RaisedButton
						id='submit-answer'
						label='Submit your answer'
						disabled={this.state.answerText === ''}
						primary={true}
						onClick={this.handleSubmitClicked}
					/>
				</div>
			</div>
		);
	}

}

export default connect()(Visible()(SubmitAnswer));