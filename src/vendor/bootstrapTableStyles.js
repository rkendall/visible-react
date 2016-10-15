const bootstrapTableStyles = {
	".react-bs-table-container .react-bs-table-search-form": {"marginBottom": 0},
	".react-bs-table table": {"marginBottom": 0, "tableLayout": "fixed"},
	".react-bs-table table td,.react-bs-table table th": {
		"overflow": "hidden",
		"whiteSpace": "nowrap",
		"textOverflow": "ellipsis"
	},
	".react-bs-table": {"border": "1px solid #ddd", "borderRadius": 5, "margin": "5px 10px"},
	".react-bs-table-pagination": {"margin": 10},
	".react-bs-table-tool-bar": {"margin": "10px 10px 0"},
	".react-bs-container-header": {"overflow": "hidden", "width": "100%"},
	".react-bs-container-body": {"overflow": "auto", "width": "100%"},
	".react-bs-table .table-bordered": {"border": 0},
	".react-bs-table .table-bordered>thead>tr>td,.react-bs-table .table-bordered>thead>tr>th": {"borderBottomWidth": 2},
	".react-bs-table .table-bordered>tfoot>tr>td,.react-bs-table .table-bordered>tfoot>tr>th": {
		"borderTopWidth": 2,
		"borderBottomWidth": 0
	},
	".react-bs-table .table-bordered>tbody>tr>td:first-child,.react-bs-table .table-bordered>tbody>tr>th:first-child,.react-bs-table .table-bordered>tfoot>tr>td:first-child,.react-bs-table .table-bordered>tfoot>tr>th:first-child,.react-bs-table .table-bordered>thead>tr>td:first-child,.react-bs-table .table-bordered>thead>tr>th:first-child": {"borderLeftWidth": 0},
	".react-bs-table .table-bordered>tbody>tr>td:last-child,.react-bs-table .table-bordered>tbody>tr>th:last-child,.react-bs-table .table-bordered>tfoot>tr>td:last-child,.react-bs-table .table-bordered>tfoot>tr>th:last-child,.react-bs-table .table-bordered>thead>tr>td:last-child,.react-bs-table .table-bordered>thead>tr>th:last-child": {"borderRightWidth": 0},
	".react-bs-table .table-bordered>thead>tr:first-child>td,.react-bs-table .table-bordered>thead>tr:first-child>th": {"borderTopWidth": 0},
	".react-bs-table .table-bordered>tfoot>tr:last-child>td,.react-bs-table .table-bordered>tfoot>tr:last-child>th": {"borderBottomWidth": 0},
	".react-bs-table .react-bs-container-header>table>thead>tr>th": {"verticalAlign": "middle"},
	".react-bs-table .react-bs-container-header>table>thead>tr>th .filter": {"fontWeight": 400},
	".react-bs-table .react-bs-container-header>table>thead>tr>th .filter::-webkit-input-placeholder,.react-bs-table .react-bs-container-header>table>thead>tr>th .number-filter-input::-webkit-input-placeholder,.react-bs-table .react-bs-container-header>table>thead>tr>th .select-filter option[value=''],.react-bs-table .react-bs-container-header>table>thead>tr>th .select-filter.placeholder-selected": {
		"color": "#d3d3d3",
		"fontStyle": "italic"
	},
	".react-bs-table .react-bs-container-header>table>thead>tr>th .select-filter.placeholder-selected option:not([value=''])": {
		"color": "initial",
		"fontStyle": "initial"
	},
	".react-bs-table .react-bs-container-header>table>thead>tr>th .date-filter,.react-bs-table .react-bs-container-header>table>thead>tr>th .number-filter": {"display": "flex"},
	".react-bs-table .react-bs-container-header>table>thead>tr>th .date-filter-input,.react-bs-table .react-bs-container-header>table>thead>tr>th .number-filter-input": {
		"marginLeft": 5,
		"float": "left",
		"width": "calc(100% - 67px - 5px)"
	},
	".react-bs-table .react-bs-container-header>table>thead>tr>th .date-filter-comparator,.react-bs-table .react-bs-container-header>table>thead>tr>th .number-filter-comparator": {
		"width": 67,
		"float": "left"
	},
	".react-bs-table .react-bs-container-header .sort-column": {"cursor": "pointer"},
	".react-bs-container .textarea-save-btn": {"position": "absolute", "zIndex": 100, "right": 0, "top": -21},
	".react-bs-table-no-data": {"textAlign": "center"},
	".animated": {"animationFillMode": "both"},
	".animated.bounceIn,.animated.bounceOut": {"animationDuration": ".75s"},
	".animated.shake": {"animationDuration": ".3s"},
	".shake": {"animationName": "shake"},
	".bounceIn": {"animationName": "bounceIn"},
	".bounceOut": {"animationName": "bounceOut"},
	".toast-title": {"fontWeight": 700},
	".toast-message": {"msWordWrap": "break-word", "wordWrap": "break-word"},
	".toast-message a,.toast-message label": {"color": "#fff"},
	".toast-message a:hover": {"color": "#ccc", "textDecoration": "none"},
	".toast-close-button": {
		"position": "relative",
		"right": "-.3em",
		"top": "-.3em",
		"float": "right",
		"fontSize": 20,
		"fontWeight": 700,
		"color": "#fff",
		"WebkitTextShadow": "0 1px 0 #fff",
		"textShadow": "0 1px 0 #fff",
		"opacity": 0.8,
		"msFilter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)",
		"filter": "alpha(opacity=80)"
	},
	".toast-top-center,.toast-top-full-width": {"top": 0, "right": 0, "width": "100%"},
	".toast-close-button:focus,.toast-close-button:hover": {
		"color": "#000",
		"textDecoration": "none",
		"cursor": "pointer",
		"opacity": 0.4,
		"msFilter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)",
		"filter": "alpha(opacity=40)"
	},
	"button.toast-close-button": {
		"padding": 0,
		"cursor": "pointer",
		"background": "0 0",
		"border": 0,
		"WebkitAppearance": "none"
	},
	".toast-bottom-center": {"bottom": 0, "right": 0, "width": "100%"},
	".toast-bottom-full-width": {"bottom": 0, "right": 0, "width": "100%"},
	".toast-top-left": {"top": 12, "left": 12},
	".toast-top-right": {"top": 12, "right": 12},
	".toast-bottom-right": {"right": 12, "bottom": 12},
	".toast-bottom-left": {"bottom": 12, "left": 12},
	"#toast-container": {"position": "fixed", "zIndex": 999999},
	"#toast-container *": {"MozBoxSizing": "border-box", "WebkitBoxSizing": "border-box", "boxSizing": "border-box"},
	"#toast-container>div": {
		"position": "relative",
		"overflow": "hidden",
		"margin": "0 0 6px",
		"padding": "15px 15px 15px 50px",
		"width": 300,
		"MozBorderRadius": 3,
		"WebkitBorderRadius": 3,
		"borderRadius": 3,
		"backgroundPosition": "15px center",
		"backgroundRepeat": "no-repeat",
		"MozBoxShadow": "0 0 12px #999",
		"WebkitBoxShadow": "0 0 12px #999",
		"boxShadow": "0 0 12px #999",
		"color": "#fff",
		"opacity": 0.8,
		"msFilter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)",
		"filter": "alpha(opacity=80)"
	},
	"#toast-container>:hover": {
		"MozBoxShadow": "0 0 12px #000",
		"WebkitBoxShadow": "0 0 12px #000",
		"boxShadow": "0 0 12px #000",
		"opacity": 1,
		"msFilter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
		"filter": "alpha(opacity=100)",
		"cursor": "pointer"
	},
	"#toast-container>.toast-info": {"backgroundImage": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=)"},
	"#toast-container>.toast-error": {"backgroundImage": null},
	"#toast-container>.toast-success": {"backgroundImage": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==)"},
	"#toast-container>.toast-warning": {"backgroundImage": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=)"},
	"#toast-container.toast-bottom-center>div,#toast-container.toast-top-center>div": {"width": 300, "margin": "auto"},
	"#toast-container.toast-bottom-full-width>div,#toast-container.toast-top-full-width>div": {
		"width": "96%",
		"margin": "auto"
	},
	".toast": {"backgroundColor": "#030303"},
	".toast-success": {"backgroundColor": "#51a351"},
	".toast-error": {"backgroundColor": "#bd362f"},
	".toast-info": {"backgroundColor": "#2f96b4"},
	".toast-warning": {"backgroundColor": "#f89406"},
	".toast-progress": {
		"position": "absolute",
		"left": 0,
		"bottom": 0,
		"height": 4,
		"backgroundColor": "#000",
		"opacity": 0.4,
		"msFilter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)",
		"filter": "alpha(opacity=40)"
	},
	"mediaQueries": {
		"all and (max-width:240px)": {
			"#toast-container>div": {
				"padding": "8px 8px 8px 50px",
				"width": "11em"
			}, "#toast-container .toast-close-button": {"right": "-.2em", "top": "-.2em"}
		},
		"all and (min-width:241px) and (max-width:480px)": {
			"#toast-container>div": {
				"padding": "8px 8px 8px 50px",
				"width": "18em"
			}, "#toast-container .toast-close-button": {"right": "-.2em", "top": "-.2em"}
		},
		"all and (min-width:481px) and (max-width:768px)": {
			"#toast-container>div": {
				"padding": "15px 15px 15px 50px",
				"width": "25em"
			}
		}
	}
};

export default bootstrapTableStyles;