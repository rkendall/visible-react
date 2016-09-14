'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _fixedDataTable = require('fixed-data-table');

var _reactBootstrap = require('react-bootstrap');

var _dataTableStyle = require('../../vendor/dataTableStyle');

var _dataTableStyle2 = _interopRequireDefault(_dataTableStyle);

var _bootstrapStyles = require('../../vendor/bootstrapStyles');

var _bootstrapStyles2 = _interopRequireDefault(_bootstrapStyles);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _TableCell = require('./TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _DataIconCell = require('./DataIconCell');

var _DataIconCell2 = _interopRequireDefault(_DataIconCell);

var _styles = require('../styles/styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cell = require('fixed-data-table').Cell;
Cell = (0, _radium2.default)(Cell);

var ComponentList = function (_Component) {
	_inherits(ComponentList, _Component);

	function ComponentList(props) {
		_classCallCheck(this, ComponentList);

		var _this = _possibleConstructorReturn(this, (ComponentList.__proto__ || Object.getPrototypeOf(ComponentList)).call(this, props));

		_initialiseProps.call(_this);

		_this.state = {
			selectedComponentId: props.initialSelectedComponentId,
			componentTableData: _this.getComponentTableData(props.logEntries),
			columnWidths: {
				changed: 20,
				name: 150,
				renderCount: 75,
				warningCount: 75
			}
		};
		return _this;
	}

	_createClass(ComponentList, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.updateDimensions();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			window.addEventListener("resize", this.updateDimensions);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			//console.debug('ComponentList', nextProps.logEntries ? Object.keys(nextProps.logEntries) : null);
			this.setState({
				componentTableData: this.getComponentTableData(nextProps.logEntries)
			});
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			return !(0, _shallowequal2.default)(this.state.componentTableData, nextState.componentTableData) || this.state.selectedComponentId !== nextState.selectedComponentId;
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			window.removeEventListener("resize", this.updateDimensions);
		}
	}, {
		key: 'render',
		value: function render() {

			var stylesheets = Object.assign({}, _dataTableStyle2.default, _bootstrapStyles2.default);

			console.log('componentList rendered');

			return _react2.default.createElement(
				'div',
				{ style: this.styles.container },
				_react2.default.createElement(_radium.Style, { rules: stylesheets }),
				_react2.default.createElement(
					'div',
					{ style: this.styles.heading },
					'Available Components'
				),
				this.getComponents()
			);
		}
	}]);

	return ComponentList;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
	var _this2 = this;

	this.styles = {
		container: {
			position: 'relative',
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
			animationName: _radium2.default.keyframes({
				'0%': { opacity: '0' },
				'60%': { opacity: '0.7' },
				'100%': { opacity: '1' }
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
			backgroundColor: (0, _color2.default)('lightblue').lighten(.1).hexString()
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

	this.updateDimensions = function () {
		_this2.setState({
			tableWidth: window.innerWidth - 950
			//tableHeight: (window.innerHeight - 150)
		});
	};

	this.getComponentTableData = function (logEntries) {
		var sortedComponentIds = _this2.getSortedComponentIds(logEntries);
		return sortedComponentIds.map(function (id, ind) {
			var entry = logEntries[id];
			return {
				changed: entry.isChanged,
				name: entry.displayName,
				renderCount: entry.renderCount,
				warningCount: entry.unnecessaryUpdatesPrevented,
				id: id
			};
		});
	};

	this.mergeStyles = function (stylesArray) {
		stylesArray.unshift({});
		return Object.assign.apply(Object, _toConsumableArray(stylesArray));
	};

	this.getRowSelectedStyle = function (id) {
		if (_this2.state.selectedComponentId === id) {
			return _this2.styles.selectedCell;
		}
		return {};
	};

	this.getChangedCell = function (props) {
		var row = _this2.state.componentTableData[props.rowIndex];
		var changedStyle = [_this2.styles.cell, _this2.getRowSelectedStyle(row.id)];
		var isChanged = _this2.props.logEntries[row.id].isChanged;

		return _react2.default.createElement(_DataIconCell2.default, _extends({
			isChanged: isChanged
		}, props, {
			onClick: _this2.handleComponentSelected.bind(_this2, row.id),
			style: _this2.mergeStyles(changedStyle),
			childStyle: _this2.styles.changed
		}));
	};

	this.getComponentNameCell = function (props) {
		var row = _this2.state.componentTableData[props.rowIndex];
		var componentStyle = [_this2.styles.component, _this2.styles.cell];
		var entry = _this2.props.logEntries[row.id];
		if (!entry.isMounted) {
			componentStyle.push(_this2.styles.unmountedComponent);
		}
		componentStyle.push(_this2.getRowSelectedStyle(row.id));
		var data = row.name;
		return _react2.default.createElement(_TableCell2.default, _extends({
			data: data
		}, props, {
			onClick: _this2.handleComponentSelected.bind(_this2, row.id),
			style: _this2.mergeStyles(componentStyle),
			childStyle: _this2.styles.methodName
		}));
	};

	this.getRenderCountCell = function (props) {
		var row = _this2.state.componentTableData[props.rowIndex];
		var renderCountStyle = _this2.mergeStyles([_this2.styles.cell, _this2.styles.renderCount, _this2.getRowSelectedStyle(row.id)]);
		var data = row.renderCount;
		return _react2.default.createElement(_TableCell2.default, {
			data: data,
			onClick: _this2.handleComponentSelected.bind(_this2, row.id),
			style: renderCountStyle
		});
	};

	this.getWarningCountCell = function (props) {
		var row = _this2.state.componentTableData[props.rowIndex];
		if (!row.warningCount) {
			return false;
		}
		var warningStyle = [_this2.styles.cell, _this2.getRowSelectedStyle(row.id), _this2.styles.warning];
		var tooltip = row.warningCount + ' unnecessary rerenders prevented';
		var data = row.warningCount;
		return _react2.default.createElement(_TableCell2.default, {
			data: data,
			onClick: _this2.handleComponentSelected.bind(_this2, row.id),
			style: _this2.mergeStyles(warningStyle),
			title: tooltip
		});
	};

	this.onColumnResizeEnd = function (newColumnWidth, columnKey) {
		_this2.setState(function (_ref) {
			var columnWidths = _ref.columnWidths;
			return {
				columnWidths: _extends({}, columnWidths, _defineProperty({}, columnKey, newColumnWidth))
			};
		});
	};

	this.getComponents = function () {
		var rowHeight = 25;
		var headerHeight = 25;
		var rowsCount = _this2.state.componentTableData.length;
		return _react2.default.createElement(
			_fixedDataTable.Table,
			{
				rowsCount: rowsCount,
				rowHeight: rowHeight,
				headerHeight: headerHeight,
				width: _this2.state.tableWidth,
				overflowX: 'hidden',
				height: headerHeight + rowHeight * rowsCount + 2,
				maxHeight: 900,
				onColumnResizeEndCallback: _this2.onColumnResizeEnd,
				isColumnResizing: false,
				style: _this2.styles.table
			},
			_react2.default.createElement(_fixedDataTable.Column, {
				columnKey: 'changed',
				header: _react2.default.createElement(Cell, null),
				cell: _this2.getChangedCell,
				width: _this2.state.columnWidths.changed,
				isResizable: true
			}),
			_react2.default.createElement(_fixedDataTable.Column, {
				columnKey: 'name',
				header: _react2.default.createElement(
					Cell,
					null,
					'Name'
				),
				cell: _this2.getComponentNameCell,
				width: _this2.state.columnWidths.name,
				isResizable: true,
				flexGrow: 2
			}),
			_react2.default.createElement(_fixedDataTable.Column, {
				columnKey: 'renderCount',
				header: _react2.default.createElement(
					Cell,
					null,
					'Rendered'
				),
				cell: _this2.getRenderCountCell,
				width: _this2.state.columnWidths.renderCount,
				isResizable: true,
				flexGrow: 1
			}),
			_react2.default.createElement(_fixedDataTable.Column, {
				columnKey: 'warningCount',
				header: _react2.default.createElement(
					Cell,
					null,
					'Warnings'
				),
				cell: _this2.getWarningCountCell,
				width: _this2.state.columnWidths.warningCount,
				isResizable: true
			})
		);
	};

	this.getSortedComponentIds = function (components) {
		return Object.keys(components).sort(function (a, b) {
			var nameA = components[a].displayName.toLowerCase();
			var nameB = components[b].displayName.toLowerCase();
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0;
		});
	};

	this.handleComponentSelected = function (id) {
		_this2.setState({
			selectedComponentId: id
		});
		var option = { selectedComponentId: id };
		_this2.props.onChange(option);
	};
};

exports.default = (0, _radium2.default)(ComponentList);
module.exports = exports['default'];