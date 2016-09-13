'use strict';

import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
let Cell = require('fixed-data-table').Cell;
Cell = Radium(Cell);
import shallowEqual from 'shallowequal';

class TableCell extends Component {

	static propTypes = {
		data: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
			PropTypes.element
		]).isRequired,
		rowIndex: PropTypes.number,
		style: PropTypes.object.isRequired,
		childStyle: PropTypes.object
	};

	static defaultProps = {
		rowIndex: 0,
		childStyle: null
	};

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

		const {data, style, childStyle, ...props} = this.props;

		return (

			<Cell {...props} style={style}>
				<div style={childStyle}>{data}</div>
			</Cell>
		)

	}
	
}

export default Radium(TableCell);