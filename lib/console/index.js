'use strict';

import React from 'react';
import {render} from 'react-dom';
import {StyleRoot} from 'radium';

import Console from './components/Console';

render((
	<StyleRoot>
		<Console />
	</StyleRoot>
), document.getElementById('root'));
