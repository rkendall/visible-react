'use strict';

const item = {
	margin: '15px 0',
	padding: '10px',
	boxShadow: '1px 1px 6px lightgray'
};

const styles = {
	heading: {
		margin: '20px 0',
		fontSize: '16px',
		fontWeight: 'bold'
	},
	question: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		...item,
		backgroundColor: '#fff8dc'
	},
	answer: {
		...item,
		border: '1px solid #eaeaea'
	}
};

export default styles;