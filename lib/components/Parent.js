'use strict';

import React, {Component} from 'react';

import Child from './Child';

export default class Parent extends Component {

	constructor() {
		super();
		this.state = {
			text: 'Some text'
		};
	}

	handleTextChange = (event) => {
		this.setState({
			text: event.target.value
		});
	};

	render() {
		return (
			<div>
				<input
					type='text'
					value={this.state.text}
					onChange={this.handleTextChange}
				/>
				<Child text={this.state.text} />
			</div>
		);
	}

};