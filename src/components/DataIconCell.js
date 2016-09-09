'use strict';

import React, {Component} from 'react';
import Radium from 'radium';
import shallowEqual from 'shallowequal';

import TableCell from './TableCell';
import styles from '../styles/styles';

class DataIconCell extends Component {

	styles = {
		icons: {
			display: 'flex'
		}
	};

	shouldComponentUpdate(nextProps) {
		return this.props.isChanged !== nextProps.isChanged
			|| !shallowEqual(this.props.style, nextProps.style)
			|| !shallowEqual(this.props.childStyle, nextProps.childStyle);
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