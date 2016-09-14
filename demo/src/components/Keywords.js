'use strict';

import React, {Component, PropTypes} from 'react';
import Visible from 'visible-react';

class Keywords extends Component {

	static propTypes = {
		keywords: PropTypes.array.isRequired
	};

	styles = {
		keywords: {
			display: 'flex',
			justifyContent: 'flex-begin',
			marginBottom: '5px',
			fontSize: '11px'
		},
		keyword: {
			marginRight: '10px',
			padding: '2px 4px',
			border: '1px solid lightgray',
			backgroundColor: 'white'
		}
	};


	formatKeywords = (keywords) => {
		return keywords.map((keyword, ind) => {
			return (
				<div style={this.styles.keyword} key={'key' + ind}>
					{keyword}
				</div>
			);
		});
	};

	render() {
		if (!this.props.keywords.length) {
			return false;
		}
		return (
			<div style={this.styles.keywords}>
				{this.formatKeywords(this.props.keywords)}
			</div>
		);
	}

}

export default Visible(Keywords);