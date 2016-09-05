'use strict';

import React, {Component} from 'react';
import Radium from 'radium';
import shallowEqual from 'shallowequal';

import TableCell from './TableCell';
import styles from '../styles/styles';

class DataIconCell extends Component {

	shouldComponentUpdate(nextProps) {
		return this.props.isChanged !== nextProps.isChanged
			|| !shallowEqual(this.props.style, nextProps.style)
			|| !shallowEqual(this.props.childStyle, nextProps.childStyle);
	}
	
	render() {
		const {isChanged, ...props} = this.props;
		const isChangedObj = isChanged.toJS();
		const propsIcon = isChangedObj.props
			? (<div style={styles.props}>•</div>)
			: '';
		const stateIcon = isChangedObj.state
			? (<div style={styles.state}>•</div>)
			: '';
		let data = (
			<div>
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