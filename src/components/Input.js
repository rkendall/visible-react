import React, {Component, PropTypes} from 'react';
import Radium from 'radium';

import styles from '../styles/styles';

class Input extends Component {

	static propTypes = {
		type: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			text: this.props.value
		};
	}

	handleTextChange = (event) => {
		this.setState({
			text: event.target.value
		});
	};

	handleSubmitText = () => {
		this.props.onChange(this.refs.input.value);
	};

	handleEnterKeyDown = (event) => {
		if (event.which === 13) {
			this.handleSubmitText();
		}
	};

	render() {
		
		const labels = {
			prop: 'Send Prop',
			state: 'Update State'
		};
		const colors = {
			prop: 'blue',
			state: '#4caf50'
		};

		return (
			<div>
				<input
					type='text'
					ref='input'
					value={this.state.text}
					onChange={this.handleTextChange}
					onKeyDown={this.handleEnterKeyDown}
					style={[styles.input, {color: colors[this.props.type]}]}
				/>
				<button
					key='updateStateButton'
					onClick={this.handleSubmitText}
					style={styles.button}
				>
					Update
				</button>
			</div>
		);

	}
	
}

export default Radium(Input);