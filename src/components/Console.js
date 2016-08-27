'use strict';

import React, {Component} from 'react';
import clone from 'deep-copy';
import deepEqual from 'deep-equal';

import updateConsole from '../updateConsole';
import ComponentList from './ComponentList';
import LifeCycle from './LifeCycle';
import styles from '../styles/styles';

export default class Console extends Component {

	styles = {
		container: {
			...styles.base,
			display: 'flex'
		}
	};

	constructor() {
		super();
		this.state = {
			log: {
				entries: window.log ? clone(window.log.entries) : {}
			},
			selectedComponentId: window.log ? Object.keys(window.log.entries)[0] : ''
		}
	}

	componentWillMount() {
		window.addEventListener('message', this.updateLog, false);
	}

	componentWillUnmount() {
		window.removeEventListener('message', this.updateLog);
	}

	updateLog = (event) => {
		console.debug('message received', event.data);
		if (!deepEqual(window.log.entries, this.state.log.entries, {strict: true})) {
			this.setState({
				log: {
					entries: clone(window.log.entries)
				}
			});
		}
	};

	handleConfigChange = (option) => {
		this.setState(option);
	};

	render() {
		console.debug('id', this.state.selectedComponentId);
		console.debug('entry', this.state.log.entries[this.state.selectedComponentId]);
		return (
			<div style={this.styles.container}>
				<ComponentList
					entries={this.state.log.entries}
					onChange={this.handleConfigChange}
					selectedComponentId={this.state.selectedComponentId}
				/>
				<LifeCycle logEntry={this.state.log.entries[this.state.selectedComponentId]} />
			</div>
		)
	}

}