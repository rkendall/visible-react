'use strict';

import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
import shallowEqual from 'shallowequal';

import TableCell from './TableCell';
import Utf8Char from './Utf8Char';
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
		},
		container: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			margin: '-6px',
			fontSize: '20px'
		}
	};

	shouldComponentUpdate(nextProps) {
		return !shallowEqual(this.props, nextProps);
	}
	
	render() {
		const dot = (<Utf8Char char='dot' />);
		const {isChanged, ...props} = this.props;
		const propsIcon = isChanged.get('props')
			? (<div style={styles.props} className='propsIcon'>{dot}</div>)
			: '';
		const stateIcon = isChanged.get('state')
			? (<div style={styles.state} className='stateIcon'>{dot}</div>)
			: '';
		let data = (
			<div style={this.styles.icons}>
				{propsIcon}
				{stateIcon}
			</div>
		);
		return (
			<div style={this.styles.container}>{data}</div>
		);

	}

}

export default Radium(DataIconCell);