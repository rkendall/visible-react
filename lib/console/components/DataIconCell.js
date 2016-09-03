'use strict';

import React, {Component} from 'react';

import TableCell from './TableCell';
import styles from '../styles/styles';

export default class DataIconCell extends Component {

	shouldComponentMount(nextProps, nextState) {
		return this.props.isChanged.props !== nextProps.isChanged.props
			|| this.props.isChanged.state !== nextProps.isChanged.state;
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

};