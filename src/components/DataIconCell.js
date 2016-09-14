'use strict';

import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
import shallowEqual from 'shallowequal';

import TableCell from './TableCell';
import styles from '../styles/styles';

class DataIconCell extends Component {

	static propTypes = {
		isChanged: PropTypes.object.isRequired,
		style: PropTypes.object.isRequired,
		childStyle: PropTypes.object.isRequired
	};

	styles = {
		icons: {
			display: 'flex'
		}
	};

	shouldComponentUpdate(nextProps) {
		return !shallowEqual(this.props, nextProps);
	}
	
	render() {
		const {isChanged, ...props} = this.props;
		const propsIcon = isChanged.props
			? (<div style={styles.props}>•</div>)
			: '';
		const stateIcon = isChanged.state
			? (<div style={styles.state}>•</div>)
			: '';
		let data = (
			<div style={this.styles.icons}>
				{propsIcon}
				{stateIcon}
			</div>
		);
		return (
			<TableCell
				data={data}
				{...props}
			>
			</TableCell>
		);

	}

}

export default Radium(DataIconCell);