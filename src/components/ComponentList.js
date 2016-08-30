import React, {Component} from 'react';
import Radium from 'radium';
import color from 'color';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import styles from '../styles/styles';

class ComponentList extends Component {

	styles = {
		container: {
			padding: '10px'
		},
		heading: {
			marginBottom: '10px',
			fontSize: '14px',
			fontWeight: 'bold'
		},
		row: {
			display: 'flex',
			minWidth: '150px',
			cursor: 'pointer',
			opacity: '1',
			animation: 'x 1s ease-out',
			animationName: Radium.keyframes({
				'0%': {opacity: '0'},
				'60%': {opacity: '0.7'},
				'100%': {opacity: '1'}
			})
		},
		component: {
			flex: '1',
			marginRight: '10px',
			padding: '3px 5px',
			fontWeight: 'bold',
			wordBreak: 'break-word'
		},
		unmountedComponent: {
			fontWeight: 'normal',
			color: 'gray'
		},
		selectedComponent: {
			backgroundColor: color('lightblue').lighten(.1).hexString()
		},
		renderCount: {
			minWidth: '30px',
			padding: '3px 0'
		},
		warning: {
			minWidth: '20px',
			padding: '3px 0',
			color: 'red',
			fontWeight: 'bold'
		}
	};

	getComponents = () => {
		const sortedComponentIds = this.getSortedComponentIds(this.props.entries);
		return sortedComponentIds.map((id, ind) => {
			const entry = this.props.entries[id];
			let componentStyle = [this.styles.component];
			let rowStyle = [this.styles.row];
			if (!entry.isMounted) {
				componentStyle.push(this.styles.unmountedComponent);
			}
			if (this.props.selectedComponentId === id) {
				rowStyle.push(this.styles.selectedComponent);
			}
			const tooltip = (<Tooltip id='unnecessaryRendersTooltip'>{entry.unnecessaryUpdatesPrevented} unnecessary rerenders
				prevented</Tooltip>);
			let unnecessaryUpdateCount = '';
			if (entry.unnecessaryUpdatesPrevented) {
				unnecessaryUpdateCount = (
					<div>
						<OverlayTrigger
							placement='right'
							overlay={tooltip}
						>
							<div style={this.styles.warning}>{entry.unnecessaryUpdatesPrevented || ''}</div>
						</OverlayTrigger>
					</div>
				);
			}
			return (
				<div
					key={'component-name-' + ind}
					style={rowStyle}
					onClick={this.handleComponentSelected.bind(this, id)}
				>
					<div style={componentStyle}>{entry.displayName}</div>
					<div style={this.styles.renderCount}>{entry.renderCount}</div>
					{unnecessaryUpdateCount}
				</div>
			);
		});
	};

	getSortedComponentIds = (components) => {
		return Object.keys(components).sort((a, b) => {
			const nameA = components[a].displayName.toLowerCase();
			const nameB = components[b].displayName.toLowerCase();
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1
			}
			return 0;
		});
	};

	handleComponentSelected = (id) => {
		const option = {selectedComponentId: id};
		this.props.onChange(option);
	};

	render() {

		return (
			<div style={this.styles.container}>
				<div style={this.styles.heading}>Available Components</div>
				{this.getComponents()}
			</div>
		)

	}

}

export default Radium(ComponentList);