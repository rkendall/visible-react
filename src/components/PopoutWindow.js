'use strict';

import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import Immutable from 'immutable';

import Console from './Console';

class PopoutWindow extends Component {

	static propTypes = {
		entries: PropTypes.instanceOf(Immutable.Map).isRequired
	};

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