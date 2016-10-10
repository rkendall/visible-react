'use strict';

import React, {Component, PropTypes} from 'react';

// Using dangerouslySetInnerHTML appears to be the only way to get UTF-8 characters to display if the client app
// doesn't specify the UTF-8 charset in its header
class Utf8Char extends Component {

	static propTypes = {
		char: PropTypes.string.isRequired
	};

	chars = {
		downArrow: '8595',
		rightArrow: '8627',
		dot: '8226'
	};
    
    render() {
    
        return (
			<span dangerouslySetInnerHTML={{__html: `&#${this.chars[this.props.char]};`}} />
        );
    
    }

}

export default Utf8Char;