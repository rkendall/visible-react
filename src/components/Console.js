'use strict';

import React, {Component} from 'react';
import clone from 'deep-copy';
import deepEqual from 'deep-equal';

import updateConsole from '../updateConsole';
import LifeCycle from './LifeCycle';

export default class Console extends Component {

	timer = null;

	constructor() {
		super();
		this.state = {
			log: {}
		};
	}

	componentWillMount() {
		this.timer = setInterval(() => {
			const newLog = clone(updateConsole.update());
			if (!deepEqual(newLog, this.state.log, {strict: true})) {
				this.setState({
					log: newLog
				});
			}
		}, 100);
	}

	componentWillUnmount() {
		clearInteral(timer);
	}

	render() {
		console.log('render');
		return (
			<LifeCycle log={this.state.log} />
		)
	}

}