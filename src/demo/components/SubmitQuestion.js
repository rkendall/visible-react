'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Insure from '../../components/Insure';

import {addQuestion} from '../actions/actions';
import styles from '../styles/styles';

// Export unconnected component for testing
export class SubmitQuestion extends Component {

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
		input: {
			height: '20px',
			marginBottom: '20px',
			outline: 'none'
		},
		button: {
			marginRight: '10px'
		}
	};

	constructor() {
		super();
		this.state = {
			title: '',
			description: '',
			keywords: ''
		};
	}

	onChange = (contentType, event) => {
		this.setState({
			[contentType]: event.target.value
		});
	};

	handleSubmitClicked = () => {
		this.props.dispatch(addQuestion(this.state));
		this.setState({
			title: '',
			description: '',
			keywords: ''
		});
		hashHistory.push('/');
	};

	handleCancelClicked = () => {
		hashHistory.push('/');
	};

	render() {
		return (
			<div style={this.styles.container}>
				<div style={styles.heading}>
					Ask a Question
				</div>
				<input
					id='title-input-field'
					type='text'
					value={this.state.title}
					onChange={this.onChange.bind(this, 'title')}
					placeholder='Enter the title of your question.'
					style={this.styles.input}
				/>
				<textarea
					rows='10'
					value={this.state.description}
					onChange={this.onChange.bind(this, 'description')}
					placeholder='Enter the details of your question.'
					style={this.styles.textArea}
				/>
				<input
					type='text'
					value={this.state.keywords}
					onChange={this.onChange.bind(this, 'keywords')}
					placeholder='Enter tags separated by spaces.'
					style={this.styles.input}
				/>
				<div>
					<RaisedButton
						id='submit-question-button'
						label='Submit question'
						primary={true}
						disabled={this.state.title === ''}
						onClick={this.handleSubmitClicked}
						style={this.styles.button}
					/>
					<RaisedButton
						label='Cancel'
						onClick={this.handleCancelClicked}
					/>
				</div>
			</div>
		);
	}

}

export default Insure(connect()(SubmitQuestion));