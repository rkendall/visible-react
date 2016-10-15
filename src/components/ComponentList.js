'use strict';

import React, {Component, PropTypes} from 'react';
import Radium, {Style} from 'radium';
import color from 'color';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import tableStyles from 'radium!css!../vendor/react-bootstrap-table-all.min.css';
import bootstrapStyles from 'radium!css!../vendor/bootstrap.css';
import shallowEqual from 'shallowequal';
import Immutable from 'immutable';

import TableCell from './TableCell';
import DataIconCell from './DataIconCell';
import root from '../root.js';

class ComponentList extends Component {

	static propTypes = {
		entries: PropTypes.instanceOf(Immutable.Map).isRequired,
		onChange: PropTypes.func.isRequired
	};

	rowHeight = 28;
	headerHeight = 28;

	styles = {
		container: {
			position: 'relative',
			maxHeight: 'calc(100% - 60px)',
			boxSizing: 'border-box',
			padding: '10px',
			background: 'white',
			boxShadow: '2px 2px 5px 1px rgba(0, 0, 0, 0.5)'
		},
		heading: {
			marginBottom: '20px',
			fontSize: '14px',
			fontWeight: 'bold'
		},
		table: {
			'.data-table-row': {
				fontSize: '12px',
				cursor: 'pointer',
				height: this.rowHeight + 'px'
			},
			'.data-table-header': {
				fontSize: '12px',
				textAlign: 'left !important',
				background: 'linear-gradient(to bottom, ' + color('#e6e6e6').lighten(0.7).hexString() + ' 0%, #e6e6e6 100%)'
			},
			'.react-bs-container-header, .react-bs-container-header .table': {
				height: this.headerHeight + 'px'
			},
			'.react-bs-table-tool-bar': {
				width: '200px',
				marginBottom: '10px'
			},
			'.form-group-sm input.form-control': {
				height: '25px'
			}
		},
		name: {
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
			}),
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
			fontWeight: 'bold'
		},
		unmountedComponent: {
			fontWeight: 'normal',
			color: 'gray'
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
			paddingRight: '20px',
			color: 'red',
			fontWeight: 'bold'
		}
	};

	constructor(props) {
		super(props);
		const columnWidths = {
			changed: 20,
			name: 175,
			renderCount: 90,
			warningCount: 90
		};
		let tableWidth = 0;
		for (let name in columnWidths) {
			tableWidth += columnWidths[name];
		}
		tableWidth = tableWidth - 10;
		const componentTableData = this.getComponentTableData(props.entries);
		const rowsCount = componentTableData.length;
		const tableHeight = (this.rowHeight * rowsCount) + 5;
		const nativeTableHeight = this.headerHeight + (this.rowHeight * rowsCount);
		this.state = {
			selectedComponentId: props.entries.first().get('id'),
			componentTableData,
			tableWidth,
			tableBottom: 0,
			nativeTableHeight,
			tableHeight,
			columnWidths
		};
	}

	componentWillReceiveProps(nextProps) {
		const componentTableData = this.getComponentTableData(nextProps.entries);
		const rowsCount = componentTableData.length;
		const tableHeight = (this.rowHeight * rowsCount) + 5;
		this.setState({
			componentTableData,
			tableHeight
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !shallowEqual(this.props, nextProps)
			|| !shallowEqual(this.state, nextState);
	}

	componentWillUnmount() {
		root.getWindow().removeEventListener("resize", this.updateDimensions);
	}

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

	getChangedCell = (cell, row) => {
		const isChanged = this.props.entries.getIn([row.id, 'isChanged']);
		const key = 'is-changed-cell-' + row.id;

		return (
			<DataIconCell
				id={key}
				key={key}
				isChanged={isChanged}
			/>
		);
	};

	getComponentNameCell = (cell, row) => {
		let componentStyle = [this.styles.name];
		const isMounted = this.props.entries.getIn([row.id, 'isMounted']);
		if (!isMounted) {
			componentStyle.push(this.styles.unmountedComponent);
		}
		let childStyle = this.mergeStyles([this.styles.methodName, {width: this.state.columnWidths.name - 8}]);
		return (
			<div title={cell}>
				<TableCell
					id={'name-cell-' + row.id}
					data={cell}
					style={this.mergeStyles(componentStyle)}
					childStyle={childStyle}
				>
				</TableCell>
			</div>
		);
	};

	getWarningCountCell = (cell, row) => {
		const warningCount = row.warningCount || '';
		const tooltip = warningCount ? warningCount + ' unnecessary rerenders prevented' : '';

		return (
			<div title={tooltip} style={this.styles.warning}>{warningCount}</div>
		)
	};

	getComponents = () => {
		const selectRowSettings = {
			clickToSelect: true,
			mode: 'radio',
			hideSelectColumn: true,
			bgColor: color('lightblue').lighten(.1).hexString(),
			onSelect: this.handleComponentSelected,
			selected: [this.state.selectedComponentId]
		};
		const scrollbarOffset = 10;
		const tableWidth = this.state.tableWidth + scrollbarOffset;
		const rowsCount = this.state.componentTableData.length;
		return (
			<BootstrapTable
				data={this.state.componentTableData}
				height={this.state.tableHeight + this.headerHeight}
				striped={true}
				hover={true}
				condensed={true}
				search={true}
				searchPlaceholder='Filter'
				clearSearch={true}
				selectRow={selectRowSettings}
				trClassName='data-table-row'
			>
				<TableHeaderColumn
					dataField="id"
					isKey={true}
					hidden={true}
				>
					Name
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="changed"
					dataFormat={this.getChangedCell}
					width={String(this.state.columnWidths.changed)}
					dataAlign='center'
					className='data-table-header'
				>
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="name"
					dataFormat={this.getComponentNameCell}
					width={String(this.state.columnWidths.name)}
					dataSort={true}
					className='data-table-header'
				>
					Name
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="renderCount"
					width={String(this.state.columnWidths.renderCount)}
					dataAlign='right'
					dataSort={true}
					className='data-table-header'
				>
					Rendered
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="warningCount"
					dataFormat={this.getWarningCountCell}
					width={String(this.state.columnWidths.warningCount)}
					dataAlign='right'
					dataSort={true}
					className='data-table-header'
				>
					Warnings
				</TableHeaderColumn>
			</BootstrapTable>
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

	handleComponentSelected = (row) => {
		this.setState({
			selectedComponentId: row.id
		});
		const option = {selectedComponentId: row.id};
		this.props.onChange(option);
	};

	onMeasure = (dimensions) => {
		console.log('onMeasure', dimensions.top);
		this.setState({
			tableBottom: dimensions.top + dimensions.height
		});
	};

	render() {

		const heightStyle = {
			'.react-bs-table-container': {
				height: this.state.tableHeight + this.headerHeight + 60 + 'px',
				maxHeight: 'calc(100% - 40px)'
			},
			'.react-bs-table': {
				height: this.state.tableHeight + this.headerHeight + 'px',
				maxHeight: 'calc(100% - 35px)',
				margin: '0',
				borderTop: '1px lightgray solid',
				borderRight: '1px lightgray solid'
			},
			'.react-bs-container-body': {
				height: this.state.tableHeight + 'px',
				maxHeight: 'calc(100% - 30px)',
				overflowY: 'auto',
				overflowX: 'hidden'
			}
		};
		const stylesheets = Object.assign({}, tableStyles, bootstrapStyles, this.styles.table, heightStyle);
		const scrollbarOffset = 30;
		const tableWidth = this.state.tableWidth + scrollbarOffset;
		const containerStyle = [this.styles.container, {width: tableWidth + 'px', height: this.state.tableHeight + this.headerHeight + 100 + 'px'}];

		return (
			<div style={containerStyle}>
				<Style rules={stylesheets}/>
				<div style={this.styles.heading}>Available Components</div>
				{this.getComponents()}
			</div>
		)

	}

}

export default Radium(ComponentList);