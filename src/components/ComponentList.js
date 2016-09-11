import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import color from 'color';
import {Table, Column} from 'fixed-data-table';
let Cell = require('fixed-data-table').Cell;
Cell = Radium(Cell);
import dataTableStyles from '../vendor/dataTableStyle.js';
import shallowEqual from 'shallowequal';
import Immutable from 'immutable';

import TableCell from './TableCell';
import DataIconCell from './DataIconCell';
import log from '../log';

class ComponentList extends Component {

	static propTypes = {
		entries: PropTypes.instanceOf(Immutable.Map).isRequired,
		onChange: PropTypes.func.isRequired
	};

	rowHeight = 25;
	headerHeight = 25;

	styles = {
		container: {
			position: 'relative',
			padding: '10px'
		},
		heading: {
			marginBottom: '10px',
			fontSize: '14px',
			fontWeight: 'bold'
		},
		tableContainer: {
			boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)'
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
		renderCount: {
			justifyContent: 'flex-end',
			width: '100%',
			textAlign: 'right'
		},
		warning: {
			justifyContent: 'flex-end',
			width: '100%',
			//minWidth: '20px',
			padding: '3px 0',
			color: 'red',
			fontWeight: 'bold'
		}
	};

	constructor(props) {
		super(props);
		const columnWidths = {
			changed: 20,
			name: 175,
			renderCount: 85,
			warningCount: 75
		};
		let tableWidth = 0;
		for (name in columnWidths) {
			tableWidth += columnWidths[name];
		}
		const componentTableData = this.getComponentTableData(props.entries);
		this.state = {
			selectedComponentId: props.entries.first().get('id'),
			componentTableData,
			tableWidth,
			columnWidths,
			// The height must be set again
			// after the component has mounted and the window height is available
			maxTableHeight: null
		};
	}

	componentWillMount() {
		this.updateDimensions();
	}

	componentDidMount() {
		log.getWindow().addEventListener("resize", this.updateDimensions);
		setTimeout( () => {
			this.setState({
				maxTableHeight: this.getMaxTableHeight()
			});
		}, 0);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			componentTableData: this.getComponentTableData(nextProps.entries)
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !shallowEqual(this.props, nextProps)
			|| !shallowEqual(this.state, nextState);
	}

	componentWillUnmount() {
		log.getWindow().removeEventListener("resize", this.updateDimensions);
	}

	updateDimensions = () => {
		// Don't update state after initial rerender;
		// causes UI to flash
		if (this.state.maxTableHeight !== null) {
			this.setState({
				maxTableHeight: this.getMaxTableHeight()
			});
		}
		if (log.getWindow().innerWidth) {
			this.setState({
				tableWidth: this.state.tableWidth += (log.getWindow().innerWidth - 1350)
			});
		}
	};

	getComponentTableData = (immutableEntries) => {
		// TODO Keep these as immutables for better performance?
		const entries = immutableEntries.toJS();
		const sortedComponentIds = this.getSortedComponentIds(entries);
		return sortedComponentIds.map((id, ind) => {
			const entry = entries[id];
			return {
				isChanged: entry.isChanged,
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
		const isChanged = this.props.entries.getIn([row.id, 'isChanged']);

		return (
			<DataIconCell
				isChanged={isChanged}
				{...props}
				style={this.mergeStyles(changedStyle)}
				childStyle={this.styles.changed}
			/>
		);
	};

	getComponentNameCell = (props) => {
		const row = this.state.componentTableData[props.rowIndex];
		let componentStyle = [this.styles.component, this.styles.cell];
		const isMounted = this.props.entries.getIn([row.id, 'isMounted']);
		if (!isMounted) {
			componentStyle.push(this.styles.unmountedComponent);
		}
		componentStyle.push(this.getRowSelectedStyle(row.id));
		const data = row.name;
		return (
			<TableCell
				data={data}
				{...props}
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
				style={renderCountStyle}
			>
			</TableCell>
		)
	};

	getWarningCountCell = (props) => {
		const row = this.state.componentTableData[props.rowIndex];
		const warningCount = row.warningCount || '';
		let warningStyle = [this.styles.cell, this.getRowSelectedStyle(row.id), this.styles.warning];
		const tooltip = warningCount ? warningCount + ' unnecessary rerenders prevented' : '';
		const data = warningCount;

		return (
			<TableCell
				data={data}
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

	getMaxTableHeight = () => {
		return log.getWindow().innerHeight - 60;
	};

	getComponents = () => {
		const rowsCount = this.state.componentTableData.length;
		let tableHeight = this.headerHeight + (this.rowHeight * rowsCount) + 2;
		const maxTableHeight = this.state.maxTableHeight;
		if (maxTableHeight && tableHeight > maxTableHeight) {
			tableHeight = maxTableHeight;
		}
		return (
			<div style={this.styles.tableContainer}>
				<Table
					rowsCount={this.state.componentTableData.length}
					rowHeight={this.rowHeight}
					headerHeight={this.headerHeight}
					width={this.state.tableWidth}
					overflowY='auto'
					overflowX='hidden'
					height={tableHeight}
					onRowMouseDown={this.handleComponentSelected}
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

	handleComponentSelected = (event, rowIndex) => {
		const row = this.state.componentTableData[rowIndex];
		this.setState({
			selectedComponentId: row.id
		});
		const option = {selectedComponentId: row.id};
		this.props.onChange(option);
	};

	render() {

		const stylesheets = Object.assign({}, dataTableStyles);

		return (
			<div style={this.styles.container}>
				<Style rules={stylesheets}/>
				<div style={this.styles.heading}>Available Components</div>
				{this.getComponents()}
			</div>
		)

	}

}

export default Radium(ComponentList);
// export default connect(
// 	(state) => ({entries: state.get('entries')})
// )(Radium(ComponentList));