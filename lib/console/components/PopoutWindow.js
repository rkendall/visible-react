'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import deepEqual from 'deep-equal';
import clone from 'deep-copy';
import log from '../../insure/shared/log';

import Console from './Console';

export default class extends Component {

	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		logEntries: props.logEntries
	// 	}
	// }
	//
	// componentDidMount() {
	// 	this.props.setUpdateWindow(this.updateWindow);
	// }
	//
	// updateWindow = () => {
	// 	if (!deepEqual(log.entries, this.state.logEntries, {strict: true})) {
	// 		this.setState({
	// 			logEntries: clone(log.entries)
	// 		});
	// 	}
	// };

	render() {

		return (
			<Console logEntries={this.props.logEntries} />
		);

	}

};