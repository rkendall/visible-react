'use strict';

import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
import color from 'color';

class Button extends Component {

	static propTypes = {
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
		disabled: PropTypes.bool
	};

	static defaultProps = {
		disabled: false
	};

	styles = {
		button: {
			marginLeft: '10px',
			backgroundColor: color('lightblue').lighten(.1).hexString(),
			borderRadius: '0',
			boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
			border: 'lightgray',
			outline: 'none',
			cursor: 'pointer',
			':hover': {
				backgroundColor: 'lightblue'
			}
		},
		active: {
			boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)',
			transform: 'translateX(1px) translateY(1px)'
		},
		disabled: {
			cursor: 'default',
			color: 'gray',
			backgroundColor: color('lightgray').lighten(.1).hexString(),
			':hover': {
				backgroundColor: 'lightgray'
			}
		}
	};

	constructor() {
		super();
		this.state = {
			active: false
		};
	}

	handleMouseDown = () => {
	    this.setState({
	    	active: true
		});
	};

	handleMouseUp = () => {
	    this.setState({
	    	active: false
		});
	};

    render() {

		let buttonStyle = [this.styles.button];
		if (this.props.disabled) {
			buttonStyle.push(this.styles.disabled);
		} else if (this.state.active) {
			buttonStyle.push(this.styles.active);
		}

        return (
			<button
				onClick={this.props.onClick}
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				disabled={this.props.disabled}
				style={buttonStyle}
			>
				{this.props.label}
			</button>
        );

    }

}

export default Radium(Button);