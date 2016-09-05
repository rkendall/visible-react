'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import clone from 'deep-copy';
import deepEqual from 'deep-equal';
import Draggable from 'react-draggable';
import {diffJson} from 'diff';
import Radium from 'radium';
import color from 'color';

import ComponentList from './ComponentList';
import LifeCycle from './LifeCycle';
import styles from '../styles/styles';

class Console extends Component {

	draggableWindowDimensions = {
		width: 800,
		height: 600
	};

	styles = {
		container: {
			display: 'flex',
			height: '100%',
			overflow: 'hidden',
			...styles.base
		},
		lifeCycle: {
			flex: '2',
			height: '100%',
			overflowX: 'hidden',
			overflowY: 'auto'
		},
		draggableWindowHidden: {
			display: 'none'
		},
		draggableWindow: {
			display: 'flex',
			flexDirection: 'column',
			position: 'absolute',
			top: '10px',
			left: '10px',
			backgroundColor: 'white',
			border: '1px solid gray',
			boxShadow: '5px 5px 6px rgba(0, 0, 0, .4)',
			zIndex: '100'
		},
		// draggableWindowOpen: {
		// 	display: 'block',
		// 	opacity: '0',
		// 	animation: 'x .4s ease-in',
		// 	animationName: Radium.keyframes({
		// 		'0%': {opacity: '0'},
		// 		'50%': {opacity: '1'},
		// 		'100%': {opacity: '1'}
		// 	}),
		// 	zIndex: '100'
		// },
		// draggableWindowClosed: {
		// 	opacity: '1',
		// 	animation: 'x .4s ease-in',
		// 	animationName: Radium.keyframes({
		// 		'0%': {opacity: '1'},
		// 		'50%': {opacity: '0'},
		// 		'100%': {opacity: '0'}
		// 	})
		// },
		handle: {
			display: 'flex',
			justifyContent: 'flex-end',
			alignItems: 'center',
			height: '30px',
			backgroundColor: 'lightgray',
			cursor: 'move'
		},
		windowContent: {
			minWidth: this.draggableWindowDimensions.width + 'px',
			height: '600px',
			margin: '0',
			padding: '10px',
			overflow: 'auto',
			resize: 'both'
		},
		close: {
			marginRight: '5px',
			cursor: 'pointer'
		},
		added: {
			backgroundColor: color('#4caf50').lighten(.5).hexString()
		},
		removed: {
			backgroundColor: color('red').lighten(.5).hexString()
		}
	};

	constructor(props) {
		super(props);

		const initialSelectedComponentId = props.entries ? props.entries.first().get('id') : '';
		this.state = {
			initialSelectedComponentId,
			selectedComponentId: initialSelectedComponentId,
			showFullText: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextState !== this.state
			|| nextProps !== this.props
			|| !deepEqual(nextState, this.state, {strict: true})
			|| !deepEqual(nextProps, this.props, {strict: true})
		);
	}

	handleConfigChange = (option) => {
		this.setState(option);
	};

	// TODOD Clean this up
	openDraggableWindow = (type, value, methodObj) => {
		let fullText = '';
		const nameSuffix = type[0].toUpperCase() + type.substr(1);
		if (methodObj.oldState && methodObj.newState) {
			fullText = this.diffText(
				JSON.stringify(methodObj['old' + nameSuffix], null, 2),
				JSON.stringify(methodObj['new' + nameSuffix], null, 2)
			);
		} else {
			fullText = JSON.stringify(value, null, 2);
		}
		this.setState({
			showFullText: true,
			fullText
		});
	};

	diffText = (before, after) => {
		const self = this;
		const diff = diffJson(before, after);
		let html = [];
		diff.forEach(function(part, ind) {
			// green for additions, red for deletions
			// grey for common parts
			const color = part.added ? 'added' :
				part.removed ? 'removed' : 'unchanged';
			html.push(
				<span key={'diff-'  + ind} style={self.styles[color]}>{part.value}</span>
			)
		});
		return html;
	};

	closeDraggableWindow = () => {
		//const draggableWindow = ReactDOM.findDOMNode(this.refs.draggableWindow);
		this.setState({
			showFullText: false
		});
	};

	// TODO Replace this animation with CSS
	render() {
		
		const draggableWindowStyle = this.state.showFullText
			? this.styles.draggableWindow
			:this.styles.draggableWindowHidden;
		return (
			<div>
				<div style={this.styles.container}>
					<ComponentList
						entries={this.props.entries}
						onChange={this.handleConfigChange}
					/>
					<div style={this.styles.lifeCycle}>
						<LifeCycle
							entry={this.props.entries.get(this.state.selectedComponentId)}
							showFullText={this.openDraggableWindow}
						/>
					</div>
					<Draggable
						handle=".handle"
						bounds='parent'
					>
						<div style={draggableWindowStyle}>
							<div className="handle" style={this.styles.handle}>
								<div onClick={this.closeDraggableWindow} style={this.styles.close}>close</div>
							</div>
							<pre style={this.styles.windowContent}>{this.state.fullText}</pre>
						</div>
					</Draggable>
				</div>
			</div>
		)
	}

}

export default Radium(Console)
// export default connect(
// 	(state) => ({entries: state.get('entries')})
// )(Radium(Console));