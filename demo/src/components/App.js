'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Radium from 'radium';
import Visible from 'visible-react';

import * as questionActions from '../actions/actions';

class App extends Component {

	styles = {
		app: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			fontFamily: 'Helvetica, Arial, sans-serif'
		},
		container: {
			'@media (min-width: 800px)': {
				width: '800px'
			},
			'@media (max-width: 799px)': {
				width: '100%'
			}
		},
		heading: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '50px',
			marginBottom: '20px',
			color: 'white',
			backgroundColor: '#00bcd4',
			fontSize: '26px',
			fontWeight: 'bold'
		}
	};

	render() {
		return (
			<div style={this.styles.app}>
				<div style={this.styles.heading}>The Big Questions</div>
				<div style={this.styles.container}>
					{this.props.children}
				</div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		questions: state.questions
	};
}

const visibleSettings = {
	enabled: true,
	monitor: true
};

export default connect(
	mapStateToProps
)(Radium(Visible(visibleSettings)(App)));