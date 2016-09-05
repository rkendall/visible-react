'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {render} from 'react-dom';
import deepEqual from 'deep-equal';
import clone from 'deep-copy';
import log from '../log.js';

import Console from './Console';

class PopoutWindow extends Component {
	
	shouldComponentUpdate(nextProps) {
		return this.props !== nextProps;
	}

	render() {


		return (
			<Console entries={this.props.entries} />
		);

	}

}

export default PopoutWindow;