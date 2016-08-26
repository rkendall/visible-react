'use strict';

import React, {Component} from 'react';
import clone from 'deep-copy';
import deepEqual from 'deep-equal';

import updateConsole from '../updateConsole';
import LifeCycle from './LifeCycle';

export default class Console extends Component {

	//timer = null;

	constructor() {
		super();
		this.state = {
			log: {
				entries: {}
			},
			logEntryId: ''
		}
	}

	componentWillMount() {
		window.addEventListener("message", this.updateLog, false);
		// this.timer = setInterval(() => {
		// 	const newLog = clone(updateConsole.update());
		// 	if (!deepEqual(newLog, this.state.log, {strict: true})) {
		// 		this.setState({
		// 			log: newLog
		// 		});
		// 	}
		// }, 100);
	}

	componentWillUnmount() {
		//clearInteral(timer);
	}

	updateLog = (event) => {
		console.debug('message received', event.data);
		console.debug(window.log.entries);
		if (!deepEqual(window.log.entries, this.state.log.entries, {strict: true})) {
			this.setState({
				log: {
					entries: clone(window.log.entries)
				},
				logEntryId: event.data
			});
		}
	};

	render() {
		console.debug(this.state.log.entries);
		return (
			<LifeCycle logEntry={this.state.log.entries[this.state.logEntryId]} />
		)
	}

}