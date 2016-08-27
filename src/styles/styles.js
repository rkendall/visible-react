import color from 'color';

const hoverColor = color('lightblue').darken(0.1).hexString();
const activeColor = color('lightblue').darken(0.2).hexString();

const styles = {
	base: {
		fontFamily: 'Arial, Helvetica, sans-serif',
		fontSize: '12px'
	},
	box: {
		padding: '10px',
		border: '1px solid lightgray',
		boxShadow: '4px 4px 8px rgba(0, 0, 0, .5)'
	},
	input: {
		width: '200px',
		margin: '5px 5px 0 0'
	},
	button: {
		height: '20px',
		width: '85px',
		padding: '0',
		backgroundColor: 'lightblue',
		border: '1px solid lightblue',
		borderRadius: 'none',
		boxShadow: '2px 2px 5px rgba(0, 0, 0, .5)',
		outline: 'none',
		cursor: 'pointer',
		':hover': {
			backgroundColor: hoverColor,
			border: '1px solid ' + hoverColor
		},
		':active': {
			backgroundColor: activeColor,
			border: '1px solid ' + activeColor
		}
	},
	description: {
		marginTop: '5px',
		color: 'red',
		fontWeight: 'normal'
	},
	props: {
		color: 'blue'
	},
	state: {
		color: '#4caf50'
	}
};

export default styles;