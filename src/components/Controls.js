'use strict';

import React, {Component} from 'react';
import Radium from 'radium';

import root from '../root.js';
import Button from './Button';

class Controls extends Component {

	styles = {
		container: {
			display: 'flex',
			marginBottom: '10px',
			padding: '10px',
			background: 'white',
			boxShadow: '2px 2px 5px 1px rgba(0, 0, 0, 0.5)'
		},
		checkbox: {
			marginRight: '5px',
			cursor: 'pointer',
			fontWeight: 'normal'
		}
	};

	constructor() {
		super();
		this.state = {
			autoRefresh: true
		};
	}

	handleRefreshStatusCheckbox = () => {
		const value = !this.state.autoRefresh;
		this.setState({
			autoRefresh: value
		});
		root.autoRefresh = value;
	};

	refresh = () => {
		root.updateWindow(true)
	};

	render() {

		const tooltip = 'Update the monitor automatically every time the monitored app changes (instead of manually refreshing with the "Refresh" button).';

		return (
			<div style={this.styles.container}>
				<div title={tooltip}>
					<input id='refresh-checkbox' type='checkbox' checked={this.state.autoRefresh}
						   onChange={this.handleRefreshStatusCheckbox} style={this.styles.checkbox}/>
					<label htmlFor='refresh-checkbox' style={this.styles.checkbox}>Continuous Refresh</label>
				</div>
				<Button label='Refresh' onClick={this.refresh} disabled={this.state.autoRefresh} />
			</div>
		);

	}

}

export default Radium(Controls);