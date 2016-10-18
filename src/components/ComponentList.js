'use strict';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import Radium, {Style} from 'radium';
import color from 'color';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// import tableStyles from 'radium!css!../vendor/react-bootstrap-table-all.min.css';
// import bootstrapStyles from 'radium!css!../vendor/bootstrap.css';
import tableStyles from '../vendor/bootstrapTableStyles';
import bootstrapStyles from '../vendor/bootstrapStyles';
import shallowEqual from 'shallowequal';
import Immutable from 'immutable';

import DataIconCell from './DataIconCell';

class ComponentList extends Component {

	static propTypes = {
		entries: PropTypes.instanceOf(Immutable.Map).isRequired,
		onChange: PropTypes.func.isRequired
	};

	rowHeight = 28;
	headerHeight = 28;

	styles = {
		heading: {
			marginBottom: '20px',
			fontSize: '14px',
			fontWeight: 'bold'
		},
		name: {
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
			warningCount: 90,
			scrollbarPadding: 20
		};
		let tableWidth = 0;
		for (let name in columnWidths) {
			tableWidth += columnWidths[name];
		}
		const componentTableData = this.getComponentTableData(props.entries);
		const tableHeight = this.getTableHeight(componentTableData);
		this.state = {
			selectedComponentId: props.entries.first().get('id'),
			componentTableData,
			tableWidth,
			tableBottom: 0,
			tableHeight,
			columnWidths,
			tableOffsetTop: 0
		};
	}

	componentDidMount() {
		const tableElement = findDOMNode(this.refs.table);
		this.setState({
			tableOffsetTop: tableElement.offsetParent.offsetTop
		});
	}

	componentWillReceiveProps(nextProps) {
		const componentTableData = this.getComponentTableData(nextProps.entries);
		const tableHeight = this.getTableHeight(componentTableData);
		this.setState({
			componentTableData,
			tableHeight
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !shallowEqual(this.props, nextProps)
			|| !shallowEqual(this.state, nextState);
	}

	getComponentTableData = (immutableEntries) => {
		// TODO Keep these as immutables for better performance?
		const entries = immutableEntries.toJS();
		const sortedComponentIds = this.getSortedComponentIds(entries);
		return sortedComponentIds.map((id) => {
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

	getTableHeight = (componentTableData) => {
		const rowsCount = componentTableData.length;
		const paddingOffset = 5;
		const tableHeight = (this.rowHeight * rowsCount) + paddingOffset;
		return tableHeight;
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
		// Need to manually merge styles because Radium can't access these elements
		// inside a custom component
		let childStyle = this.mergeStyles([this.styles.methodName, {width: this.state.columnWidths.name - 8}]);
		return (
			<div id={'name-cell-' + row.id} title={cell}>
				<div style={this.mergeStyles(componentStyle)}>
					<div style={childStyle}>{cell}</div>
				</div>
			</div>
		);
	};

	getWarningCountCell = (cell) => {
		const warningCount = cell || '';
		const tooltip = warningCount ? warningCount + ' unnecessary rerenders prevented' : '';
		return (
			<div title={tooltip} style={this.styles.warning}>{warningCount}</div>
		)
	};

	makeTable = () => {
		const selectRowSettings = {
			clickToSelect: true,
			mode: 'radio',
			hideSelectColumn: true,
			bgColor: color('lightblue').lighten(.1).hexString(),
			onSelect: this.handleComponentSelected,
			selected: [this.state.selectedComponentId]
		};
		return (
			<BootstrapTable
				ref='table'
				keyField='id'
				data={this.state.componentTableData}
				height={this.state.tableHeight + this.headerHeight}
				striped={true}
				hover={true}
				condensed={true}
				search={true}
				searchPlaceholder='Filter'
				selectRow={selectRowSettings}
				trClassName='data-table-row'
			>
				<TableHeaderColumn
					dataField="id"
					hidden={true}
				>
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="changed"
					dataFormat={this.getChangedCell}
					width={this.state.columnWidths.changed + 'px'}
					dataAlign='center'
					className='data-table-header'
				>
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="name"
					dataFormat={this.getComponentNameCell}
					width={this.state.columnWidths.name + 'px'}
					dataSort={true}
					className='data-table-header'
				>
					Name
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="renderCount"
					width={this.state.columnWidths.renderCount + 'px'}
					dataAlign='right'
					headerAlign='left'
					dataSort={true}
					className='data-table-header'
				>
					Rendered
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="warningCount"
					dataFormat={this.getWarningCountCell}
					width={this.state.columnWidths.warningCount + 'px'}
					dataAlign='right'
					headerAlign='left'
					dataSort={true}
					columnClassName=''
					className='data-table-header'
				>
					Warnings
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="scrollbarPadding"
					width={this.state.columnWidths.scrollbarPadding + 'px'}
					className='data-table-header'
				>
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

	getTableStyles = () => {

		const heightOffset = 30;

		// TODO Assign these styles using the table API (e.g., 'containerStyle={}')
		return {
			'.react-bs-table-container': {
				height: this.state.tableHeight + this.headerHeight + this.state.tableOffsetTop + 'px',
				maxHeight: `calc(100% - ${heightOffset + 10}px)`
			},
			'.react-bs-table': {
				height: this.state.tableHeight + this.headerHeight + 'px',
				maxHeight: `calc(100% - ${heightOffset + 5}px)`,
				margin: '0',
				borderTop: '1px lightgray solid',
				borderRight: '1px lightgray solid'
			},
			'.react-bs-container-body': {
				height: this.state.tableHeight + 'px',
				maxHeight: `calc(100% - ${heightOffset}px)`,
				overflowY: 'auto',
				overflowX: 'hidden'
			},
			'.react-bs-container-header, .react-bs-container-header .table': {
				height: this.headerHeight + 'px'
			},
			'.data-table-header': {
				fontSize: '12px',
				textAlign: 'left !important',
				background: 'linear-gradient(to bottom, ' + color('#e6e6e6').lighten(0.7).hexString() + ' 0%, #e6e6e6 100%)'
			},
			'.data-table-row': {
				fontSize: '12px',
				cursor: 'pointer',
				height: this.rowHeight + 'px'
			},
			'.react-bs-table-tool-bar': {
				width: '200px',
				marginBottom: '10px'
			},
			'.form-group-sm input.form-control': {
				height: '25px'
			}
		};

	};

	render() {

		const stylesheets = Object.assign({}, tableStyles, bootstrapStyles, this.getTableStyles());
		const scrollbarOffset = 20;
		const tableWidth = this.state.tableWidth + scrollbarOffset;
		const containerStyle = [this.styles.container, {
			width: tableWidth + 'px',
			height: this.state.tableHeight + this.headerHeight + this.state.tableOffsetTop + 40 + 'px',
			maxHeight: `calc(100% - ${this.state.tableOffsetTop}px)`,
			position: 'relative',
			boxSizing: 'border-box',
			padding: '10px',
			background: 'white',
			boxShadow: '2px 2px 5px 1px rgba(0, 0, 0, 0.5)'
		}];

		return (
			<div className='component-list' style={containerStyle}>
				<Style
					scopeSelector='.component-list'
					rules={stylesheets}
				/>
				<div style={this.styles.heading}>Available Components</div>
				{this.makeTable()}
			</div>
		)

	}

}

export default Radium(ComponentList);