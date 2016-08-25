'use strict';

import React, {Component} from 'react';

import Monitor from './Monitor';
import Input from './Input';

class Child extends Component {

	constructor(props) {
		super(props);
		this.state = {
			values: {
				text: this.props.text.toUpperCase()
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		const newState = {
			values: {
				text: this.props.text.toUpperCase()
			}
		};
		this.setState(newState);
	}

	onChange = (value) => {
		const newState = {
			values: {
				text: value
			}
		};
		this.setState(newState);
	};

	render() {
		return (
			<div>
				<div>Props: {this.props.text}</div>
				<div>State: {this.state.values.text}</div>
				<Input value={this.props.text} onChange={this.onChange} />
			</div>
		);
	}

};

export default Monitor(Child);