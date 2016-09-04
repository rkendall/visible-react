import React, {Component} from 'react';
import Radium, {Style} from 'radium';
import color from 'color';
import {Table, Column} from 'fixed-data-table';
let Cell = require('fixed-data-table').Cell;
Cell = Radium(Cell);
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import dataTableStyles from '../../vendor/dataTableStyle';
import bootStrapStyles from '../../vendor/bootstrapStyles';
import shallowEqual from 'shallowequal';

import TableCell from './TableCell';
import DataIconCell from './DataIconCell';
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
		changed: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			margin: '-6px',
			fontSize: '20px'
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
			selectedComponentId: props.initialSelectedComponentId,
			componentTableData: this.getComponentTableData(props.logEntries),
			columnWidths: {
				changed: 20,
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
		//console.debug('ComponentList', nextProps.logEntries ? Object.keys(nextProps.logEntries) : null);
		this.setState({
			componentTableData: this.getComponentTableData(nextProps.logEntries)
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !shallowEqual(this.state.componentTableData, nextState.componentTableData)
			|| this.state.selectedComponentId !== nextState.selectedComponentId;
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

	getComponentTableData = (logEntries) => {
		const sortedComponentIds = this.getSortedComponentIds(logEntries);
		return sortedComponentIds.map((id, ind) => {
			const entry = logEntries[id];
			return {
				changed: entry.isChanged,
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
		if (this.state.selectedComponentId === id) {
			return this.styles.selectedCell;
		}
		return {};
	};

	getChangedCell = (props) => {
		const row = this.state.componentTableData[props.rowIndex];
		let changedStyle = [
			this.styles.cell,
			this.getRowSelectedStyle(row.id)
		];
		const isChanged = this.props.logEntries[row.id].isChanged;

		return (
			<DataIconCell
				isChanged={isChanged}
				{...props}
				onClick={this.handleComponentSelected.bind(this, row.id)}
				style={this.mergeStyles(changedStyle)}
				childStyle={this.styles.changed}
			/>
		);
	};

	getComponentNameCell = (props) => {
		const row = this.state.componentTableData[props.rowIndex];
		let componentStyle = [this.styles.component, this.styles.cell];
		const entry = this.props.logEntries[row.id];
		if (!entry.isMounted) {
			componentStyle.push(this.styles.unmountedComponent);
		}
		componentStyle.push(this.getRowSelectedStyle(row.id));
		const data = row.name;
		return (
			<TableCell
				data={data}
				{...props}
				onClick={this.handleComponentSelected.bind(this, row.id)}
				style={this.mergeStyles(componentStyle)}
				childStyle={this.styles.methodName}
			>
			</TableCell>
		);
	};

	getRenderCountCell = (props) => {
		const row = this.state.componentTableData[props.rowIndex];
		let renderCountStyle = this.mergeStyles([
			this.styles.cell,
			this.styles.renderCount,
			this.getRowSelectedStyle(row.id)
		]);
		const data = row.renderCount;
		return (
			<TableCell
				data={data}
				onClick={this.handleComponentSelected.bind(this, row.id)}
				style={renderCountStyle}
			>
			</TableCell>
		)
	};

	getWarningCountCell = (props) => {
		const row = this.state.componentTableData[props.rowIndex];
		if (!row.warningCount) {
			return false;
		}
		let warningStyle = [this.styles.cell, this.getRowSelectedStyle(row.id), this.styles.warning];
		const tooltip = row.warningCount + ' unnecessary rerenders prevented';
		const data = row.warningCount;
		return (
			<TableCell
				data={data}
				onClick={this.handleComponentSelected.bind(this, row.id)}
				style={this.mergeStyles(warningStyle)}
				title={tooltip}
			>
			</TableCell>
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
		const stylesheets = Object.assign({}, dataTableStyles, bootStrapStyles)
		return (
			<div>
				<Style rules={stylesheets}/>
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
						columnKey='changed'
						header={<Cell></Cell>}
						cell={this.getChangedCell}
						width={this.state.columnWidths.changed}
						isResizable={true}
					/>
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
			</div>
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
		this.setState({
			selectedComponentId: id
		});
		const option = {selectedComponentId: id};
		this.props.onChange(option);
	};

	render() {

		console.log('componentList rendered');

		return (
			<div style={this.styles.container}>
				<div style={this.styles.heading}>Available Components</div>
				{this.getComponents()}
			</div>
		)

	}

}

export default Radium(ComponentList);