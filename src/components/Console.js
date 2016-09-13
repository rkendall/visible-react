'use strict';

import React, {Component, PropTypes} from 'react';
import deepEqual from 'deep-equal';
import Draggable from 'react-draggable';
import {diffJson} from 'diff';
import Radium from 'radium';
import color from 'color';
import Immutable from 'immutable';

import ComponentList from './ComponentList';
import LifeCycle from './LifeCycle';
import styles from '../styles/styles';
import root from '../root.js';

class Console extends Component {

	static propTypes = {
		entries: PropTypes.instanceOf(Immutable.Map).isRequired
	};

	styles = {
		container: {
			display: 'flex',
			justifyContent: 'space-between',
			height: '100%',
			overflow: 'hidden',
			...styles.base
		},
		lifeCycle: {
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
			minWidth: '800px',
			maxWidth: (root.getWindow().innerWidth - 50) + 'px',
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

	openDraggableWindow = (values) => {
		let fullText = '';
		const value1 = values[0];
		const value2 = values.length === 2 ? values[1] : null;
		if (value1 !== null && value2 !== null) {
			fullText = this.diffText(
				JSON.stringify(value1, null, 2),
				JSON.stringify(value2, null, 2)
			);
		} else {
			fullText = JSON.stringify(value1, null, 2);
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
			// black for common parts
			const color = part.added ? 'added' :
				part.removed ? 'removed' : 'unchanged';
			html.push(
				<span key={'diff-' + ind} style={self.styles[color]}>{part.value}</span>
			)
		});
		return html;
	};

	closeDraggableWindow = () => {
		this.setState({
			showFullText: false
		});
	};

	// TODO Replace this animation with CSS
	render() {
		const draggableWindowStyle = this.state.showFullText
			? this.styles.draggableWindow
			:this.styles.draggableWindowHidden;
		const entry = this.props.entries.get(this.state.selectedComponentId);
		return (
			<div>
				<div style={this.styles.container}>
					<ComponentList
						entries={this.props.entries}
						onChange={this.handleConfigChange}
					/>
					<div style={this.styles.lifeCycle}>
						<LifeCycle
							entry={entry}
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

export default Radium(Console);