'use strict';

import React, {Component} from 'react';
import {Cell} from 'fixed-data-table';
import shallowEqual from 'shallowequal';

class TableCell extends Component {
	
	shouldComponentUpdate(nextProps) {
		if (nextProps.isScrolling) {
			return false;
		}
		return this.props.rowIndex !== nextProps.rowIndex
			|| this.props.data !== nextProps.data
			|| !shallowEqual(this.props.style, nextProps.style)
			|| !shallowEqual(this.props.childStyle, nextProps.childStyle);
	}

	render() {

		console.debug('cell rendering', this.props.rowIndex);
		
		const {data, style, childStyle, ...props} = this.props;

		return (

			<Cell {...props} style={style}>
				<div style={childStyle}>{data}</div>
			</Cell>
		)

	}
	
}

export default TableCell;