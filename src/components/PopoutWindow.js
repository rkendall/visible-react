'use strict';

import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import Immutable from 'immutable';
import Radium, {Style} from 'radium';

import root from '../root';
import Console from './Console';

class PopoutWindow extends Component {

	static propTypes = {
		entries: PropTypes.instanceOf(Immutable.Map).isRequired
	};

	styles = {
		global: {
			body: {
				margin: '0'
			}
		}
	};

	shouldComponentUpdate(nextProps) {
		return this.props !== nextProps;
	}

	render() {
		const windowWidth = root.getWindow().innerWidth;

		return (
			<div>
				<Style rules={this.styles.global} />
				<Console entries={this.props.entries} windowWidth={windowWidth} />
			</div>
		);

	}

}

export default Radium(PopoutWindow);