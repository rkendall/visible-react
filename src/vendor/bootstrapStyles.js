const bootstrapStyles = {
	html: {
		fontFamily: 'sans-serif',
		msTextSizeAdjust: '100%',
		WebkitTextSizeAdjust: '100%',
		fontSize: 10,
		WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
	},
	body: {
		margin: 0,
		fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
		fontSize: 14,
		lineHeight: 1.42857143,
		color: '#333333',
		backgroundColor: '#ffffff'
	},
	'article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary': {
		display: 'block'
	},
	'audio, canvas, progress, video': {
		display: 'inline-block',
		verticalAlign: 'baseline'
	},
	'audio:not([controls])': {
		display: 'none',
		height: 0
	},
	'[hidden], template': {
		display: 'none'
	},
	a: {
		backgroundColor: 'transparent',
		color: '#337ab7',
		textDecoration: 'none'
	},
	'a:active, a:hover': {
		outline: 0
	},
	'abbr[title]': {
		borderBottom: '1px dotted'
	},
	'b, strong': {
		fontWeight: 'bold'
	},
	dfn: {
		fontStyle: 'italic'
	},
	h1: {
		fontSize: '2em',
		margin: '0.67em 0'
	},
	mark: {
		background: '#ff0',
		color: '#000'
	},
	small: {
		fontSize: '80%'
	},
	'sub, sup': {
		fontSize: '75%',
		lineHeight: 0,
		position: 'relative',
		verticalAlign: 'baseline'
	},
	sup: {
		top: '-0.5em'
	},
	sub: {
		bottom: '-0.25em'
	},
	img: {
		border: 0,
		verticalAlign: 'middle'
	},
	'svg:not(:root)': {
		overflow: 'hidden'
	},
	figure: {
		margin: 0
	},
	hr: {
		WebkitBoxSizing: 'content-box',
		MozBoxSizing: 'content-box',
		boxSizing: 'content-box',
		height: 0,
		marginTop: 20,
		marginBottom: 20,
		border: 0,
		borderTop: '1px solid #eeeeee'
	},
	pre: {
		overflow: 'auto'
	},
	'code, kbd, pre, samp': {
		fontFamily: 'monospace, monospace',
		fontSize: '1em'
	},
	'button, input, optgroup, select, textarea': {
		color: 'inherit',
		font: 'inherit',
		margin: 0
	},
	button: {
		overflow: 'visible'
	},
	'button, select': {
		textTransform: 'none'
	},
	'button, html input[type="button"], input[type="reset"], input[type="submit"]': {
		WebkitAppearance: 'button',
		cursor: 'pointer'
	},
	'button[disabled], html input[disabled]': {
		cursor: 'default'
	},
	'button::-moz-focus-inner, input::-moz-focus-inner': {
		border: 0,
		padding: 0
	},
	input: {
		lineHeight: 'normal'
	},
	'input[type="checkbox"], input[type="radio"]': {
		WebkitBoxSizing: 'border-box',
		MozBoxSizing: 'border-box',
		boxSizing: 'border-box',
		padding: 0
	},
	'input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button': {
		height: 'auto'
	},
	'input[type="search"]': {
		WebkitAppearance: 'textfield',
		WebkitBoxSizing: 'content-box',
		MozBoxSizing: 'content-box',
		boxSizing: 'content-box'
	},
	'input[type="search"]::-webkit-search-cancel-button, input[type="search"]::-webkit-search-decoration': {
		WebkitAppearance: 'none'
	},
	fieldset: {
		border: '1px solid #c0c0c0',
		margin: '0 2px',
		padding: '0.35em 0.625em 0.75em'
	},
	legend: {
		border: 0,
		padding: 0
	},
	textarea: {
		overflow: 'auto'
	},
	optgroup: {
		fontWeight: 'bold'
	},
	table: {
		borderCollapse: 'collapse',
		borderSpacing: 0
	},
	'td, th': {
		padding: 0
	},
	'*': {
		WebkitBoxSizing: 'border-box',
		MozBoxSizing: 'border-box',
		boxSizing: 'border-box'
	},
	'*:before, *:after': {
		WebkitBoxSizing: 'border-box',
		MozBoxSizing: 'border-box',
		boxSizing: 'border-box'
	},
	'input, button, select, textarea': {
		fontFamily: 'inherit',
		fontSize: 'inherit',
		lineHeight: 'inherit'
	},
	'a:hover, a:focus': {
		color: '#23527c',
		textDecoration: 'underline'
	},
	'a:focus': {
		outline: '5px auto -webkit-focus-ring-color',
		outlineOffset: -2
	},
	'.img-responsive': {
		display: 'block',
		maxWidth: '100%',
		height: 'auto'
	},
	'.img-rounded': {
		borderRadius: 6
	},
	'.img-thumbnail': {
		padding: 4,
		lineHeight: 1.42857143,
		backgroundColor: '#ffffff',
		border: '1px solid #dddddd',
		borderRadius: 4,
		WebkitTransition: 'all 0.2s ease-in-out',
		OTransition: 'all 0.2s ease-in-out',
		transition: 'all 0.2s ease-in-out',
		display: 'inline-block',
		maxWidth: '100%',
		height: 'auto'
	},
	'.img-circle': {
		borderRadius: '50%'
	},
	'.sr-only': {
		position: 'absolute',
		width: 1,
		height: 1,
		margin: -1,
		padding: 0,
		overflow: 'hidden',
		clip: 'rect(0, 0, 0, 0)',
		border: 0
	},
	'.sr-only-focusable:active, .sr-only-focusable:focus': {
		position: 'static',
		width: 'auto',
		height: 'auto',
		margin: 0,
		overflow: 'visible',
		clip: 'auto'
	},
	'[role="button"]': {
		cursor: 'pointer'
	},
	'.tooltip': {
		position: 'absolute',
		zIndex: 1070,
		display: 'block',
		fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
		fontStyle: 'normal',
		fontWeight: 'normal',
		letterSpacing: 'normal',
		lineBreak: 'auto',
		lineHeight: 1.42857143,
		textAlign: 'start',
		textDecoration: 'none',
		textShadow: 'none',
		textTransform: 'none',
		whiteSpace: 'normal',
		wordBreak: 'normal',
		wordSpacing: 'normal',
		wordWrap: 'normal',
		fontSize: 12,
		opacity: 0,
		filter: 'alpha(opacity=0)'
	},
	'.tooltip.in': {
		opacity: 0.9,
		filter: 'alpha(opacity=90)'
	},
	'.tooltip.top': {
		marginTop: -3,
		padding: '5px 0'
	},
	'.tooltip.right': {
		marginLeft: 3,
		padding: '0 5px'
	},
	'.tooltip.bottom': {
		marginTop: 3,
		padding: '5px 0'
	},
	'.tooltip.left': {
		marginLeft: -3,
		padding: '0 5px'
	},
	'.tooltip-inner': {
		maxWidth: 200,
		padding: '3px 8px',
		color: '#ffffff',
		textAlign: 'center',
		backgroundColor: '#000000',
		borderRadius: 4
	},
	'.tooltip-arrow': {
		position: 'absolute',
		width: 0,
		height: 0,
		borderColor: 'transparent',
		borderStyle: 'solid'
	},
	'.tooltip.top .tooltip-arrow': {
		bottom: 0,
		left: '50%',
		marginLeft: -5,
		borderWidth: '5px 5px 0',
		borderTopColor: '#000000'
	},
	'.tooltip.top-left .tooltip-arrow': {
		bottom: 0,
		right: 5,
		marginBottom: -5,
		borderWidth: '5px 5px 0',
		borderTopColor: '#000000'
	},
	'.tooltip.top-right .tooltip-arrow': {
		bottom: 0,
		left: 5,
		marginBottom: -5,
		borderWidth: '5px 5px 0',
		borderTopColor: '#000000'
	},
	'.tooltip.right .tooltip-arrow': {
		top: '50%',
		left: 0,
		marginTop: -5,
		borderWidth: '5px 5px 5px 0',
		borderRightColor: '#000000'
	},
	'.tooltip.left .tooltip-arrow': {
		top: '50%',
		right: 0,
		marginTop: -5,
		borderWidth: '5px 0 5px 5px',
		borderLeftColor: '#000000'
	},
	'.tooltip.bottom .tooltip-arrow': {
		top: 0,
		left: '50%',
		marginLeft: -5,
		borderWidth: '0 5px 5px',
		borderBottomColor: '#000000'
	},
	'.tooltip.bottom-left .tooltip-arrow': {
		top: 0,
		right: 5,
		marginTop: -5,
		borderWidth: '0 5px 5px',
		borderBottomColor: '#000000'
	},
	'.tooltip.bottom-right .tooltip-arrow': {
		top: 0,
		left: 5,
		marginTop: -5,
		borderWidth: '0 5px 5px',
		borderBottomColor: '#000000'
	},
	'.clearfix:before, .clearfix:after': {
		content: '" "',
		display: 'table'
	},
	'.clearfix:after': {
		clear: 'both'
	},
	'.center-block': {
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto'
	},
	'.pull-right': {
		float: 'right'
	},
	'.pull-left': {
		float: 'left'
	},
	'.hide': {
		display: 'none'
	},
	'.show': {
		display: 'block'
	},
	'.invisible': {
		visibility: 'hidden'
	},
	'.text-hide': {
		font: '0/0 a',
		color: 'transparent',
		textShadow: 'none',
		backgroundColor: 'transparent',
		border: 0
	},
	'.hidden': {
		display: 'none'
	},
	'.affix': {
		position: 'fixed'
	}
};

export default bootstrapStyles;