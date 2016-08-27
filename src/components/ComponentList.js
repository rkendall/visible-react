import React, {Component} from 'react';
import Radium from 'radium';
import color from 'color';

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
		component: {
			padding: '5px',
			cursor: 'pointer'
		},
		selectedComponent: {
			backgroundColor: color('lightblue').lighten(.2).hexString(),
			fontWeight: 'bold'
		}
	};

	getComponents = () => {
		return Object.keys(this.props.entries).map((id, ind) => {
			const entry = this.props.entries[id];
			let componentStyle = [this.styles.component];
			if (this.props.selectedComponentId === id) {
				componentStyle.unshift(this.styles.selectedComponent);
			}
			return (
				<div
					key={'component-list-' + ind}
					style={componentStyle}
					onClick={this.handleComponentSelected.bind(this, id)}
				>
					{id}
				</div>
			)
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