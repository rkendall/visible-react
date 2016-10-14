'use strict';

import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
import shallowEqual from 'shallowequal';

class TableCell extends Component {

	static propTypes = {
		data: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
			PropTypes.element
		]).isRequired,
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
		return this.props.data !== nextProps.data
			|| !shallowEqual(this.props.style, nextProps.style)
			|| !shallowEqual(this.props.childStyle, nextProps.childStyle);
	}

	render() {

		const {data, style, childStyle} = this.props;

		return (

			<div style={style}>
				<div style={childStyle}>{data}</div>
			</div>
		)

	}
	
}

export default Radium(TableCell);