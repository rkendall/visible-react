'use strict';

import expect from 'expect';
import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';

import {Console} from '../src/components/Console';
import propData from '../fixtures/consoleProps.json';

describe('Console', () => {

	const props = Immutable.Map(JSON.parse(propData).entries);

	describe('Console', () => {
		it('Should render', () => {
			const wrapper = shallow(<Console {...props} />);
			expect(wrapper.find('Console').length).toEqual(1);
		});
	});
	
});

