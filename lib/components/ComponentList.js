import React, {Component} from 'react';
import Radium from 'radium';
import color from 'color';
import {Table, Column} from 'fixed-data-table';
let Cell = require('fixed-data-table').Cell;
Cell = Radium(Cell);
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import styles from '../styles/styles';

class ComponentList extends Component {

	styles = {
		container: {
			flex: '1',
			padding: '10px'
		},
		heading: {
			marginBottom: '10px',
			fontSize: '14px',
			fontWeight: 'bold'
		},
		table: {
			zIndex: '0'
		},
		cell: {
			display: 'flex',
			alignItems: 'center',
			flex: '1',
			height: '100%',
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
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
			fontWeight: 'bold'
		},
		unmountedComponent: {
			fontWeight: 'normal',
			color: 'gray'
		},
		selectedCell: {
			backgroundColor: color('lightblue').lighten(.1).hexString()
		},
		methodName: {
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis'
		},
		renderCount: {},
		warning: {
			minWidth: '20px',
			padding: '3px 0',
			color: 'red',
			fontWeight: 'bold'
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			componentTableData: this.getComponentTableData(props.entries),
			columnWidths: {
				name: 150,
				renderCount: 75,
				warningCount: 75
			}
		};
	}

	componentWillMount() {
		this.updateDimensions();
	}

	componentDidMount() {
		window.addEventListener("resize", this.updateDimensions);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			componentTableData: this.getComponentTableData(nextProps.entries)
		});
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	updateDimensions = () => {
		this.setState({
			tableWidth: (window.innerWidth - 950)
			//tableHeight: (window.innerHeight - 150)
		});
	};

	getComponentTableData = (entries) => {
		const sortedComponentIds = this.getSortedComponentIds(entries);
		return sortedComponentIds.map((id, ind) => {
			const entry = entries[id];
			return {
				name: entry.displayName,
				renderCount: entry.renderCount,
				warningCount: entry.unnecessaryUpdatesPrevented,
				id
			};
		});
	};

	mergeStyles = (stylesArray) => {
		stylesArray.unshift({});
		return Object.assign(...stylesArray);
	};

	getRowSelectedStyle = (id) => {
		if (this.props.selectedComponentId === id) {
			return this.styles.selectedCell;
		}
		return {};
	};

	getComponentNameCell = (props) => {
		const row = this.state.componentTableData[props.rowIndex];
		let componentStyle = [this.styles.component, this.styles.cell];
		const entry = this.props.entries[row.id];
		if (!entry.isMounted) {
			componentStyle.push(this.styles.unmountedComponent);
		}
		componentStyle.push(this.getRowSelectedStyle(row.id));
		return (
			<Cell
				{...props}
				onClick={this.handleComponentSelected.bind(this, row.id)}
				style={this.mergeStyles(componentStyle)}
			>
				<div style={this.styles.methodName}>
					{row.name}
				</div>
			</Cell>
		);
	};

	getRenderCountCell = (props) => {
		const row = this.state.componentTableData[props.rowIndex];
		let renderCountStyle = this.mergeStyles([
			this.styles.cell,
			this.styles.renderCount,
			this.getRowSelectedStyle(row.id)
		]);
		return (
			<Cell
				onClick={this.handleComponentSelected.bind(this, row.id)}
				style={renderCountStyle}
			>
				<div>{row.renderCount}</div>
			</Cell>
		)
	};

	getWarningCountCell = (props) => {
		const row = this.state.componentTableData[props.rowIndex];
		let warningCount = '';
		let warningStyle = [this.styles.cell, this.getRowSelectedStyle(row.id)];
		if (row.warningCount) {
			warningStyle.push(this.styles.warning);
			const tooltip = (
				<Tooltip id='unnecessaryRendersTooltip'>
					{row.warningCount} unnecessary rerenders prevented
				</Tooltip>);
			warningCount = (
				<div>
					<OverlayTrigger
						placement='right'
						overlay={tooltip}
					>
						<div style={warningStyle}>{row.warningCount || ''}</div>
					</OverlayTrigger>
				</div>
			);
		}
		return (
			<Cell
				onClick={this.handleComponentSelected.bind(this, row.id)}
				style={this.mergeStyles(warningStyle)}
			>
				{warningCount}
			</Cell>
		)
	};

	onColumnResizeEnd = (newColumnWidth, columnKey) => {
		this.setState(({columnWidths}) => ({
			columnWidths: {
				...columnWidths,
				[columnKey]: newColumnWidth
			}
		}));
	};

	getComponents = () => {
		const rowHeight = 25;
		const headerHeight = 25;
		const rowsCount = this.state.componentTableData.length;
		return (
			<Table
				rowsCount={rowsCount}
				rowHeight={rowHeight}
				headerHeight={headerHeight}
				width={this.state.tableWidth}
				overflowX='hidden'
				height={headerHeight + (rowHeight * rowsCount) + 2}
				maxHeight={900}
				onColumnResizeEndCallback={this.onColumnResizeEnd}
				isColumnResizing={false}
				style={this.styles.table}
			>
				<Column
					columnKey='name'
					header={<Cell>Name</Cell>}
					cell={this.getComponentNameCell}
					width={this.state.columnWidths.name}
					isResizable={true}
					flexGrow={2}
				/>
				<Column
					columnKey='renderCount'
					header={<Cell>Rendered</Cell>}
					cell={this.getRenderCountCell}
					width={this.state.columnWidths.renderCount}
					isResizable={true}
					flexGrow={1}
				/>
				<Column
					columnKey='warningCount'
					header={<Cell>Warnings</Cell>}
					cell={this.getWarningCountCell}
					width={this.state.columnWidths.warningCount}
					isResizable={true}
				/>
			</Table>
		);
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

		console.debug(this.getComponents());
		return (
			<div style={this.styles.container}>
				<div style={this.styles.heading}>Available Components</div>
				{this.getComponents()}
			</div>
		)

	}

}

export default Radium(ComponentList);