'use strict';

import expect from 'expect';
import React from 'react';
import {shallow, mount} from 'enzyme';
import Immutable from 'immutable';
import jsdom from 'jsdom';
import {StyleRoot} from 'radium';

const doc = jsdom.jsdom('<!doctype html><html><head><title></title></head><body></body></html>');
global.document = doc;
global.window = doc.defaultView;
global.window.document = doc;
global.window.open = function() {
	let consoleWindow = jsdom.jsdom('<!doctype html><html><head><title>Test</title></head><body></body></html>');
	consoleWindow.document = {
		title: '',
		body: {appendChild: function() {}},
		createElement: function() {
			return {id: ''}
		}
	};
	consoleWindow.close = function() {};
	consoleWindow.focus = function() {};
	return consoleWindow;
};
global.alert = function() {};

// Fixture for initial load of detail of first question
import entries from './fixtures/entries.json';
import Console from '../src/components/Console';


describe('Monitor', () => {

	let consoleWrapper;

	beforeEach(() => {
		const props = {
			entries: Immutable.fromJS(entries),
			windowWidth: 1200
		};
		consoleWrapper = mount(<StyleRoot><Console {...props} /></StyleRoot>);
	});

	describe('Console', () => {
		it('Should render table and rows', () => {
			expect(consoleWrapper.find('FixedDataTable').length).toEqual(1);
			expect(consoleWrapper.find('FixedDataTableRow').length).toEqual(8);
		});
		it('Should render correct names in cells', () => {
			expect(consoleWrapper.find('#name-cell-0').text()).toEqual('Answer (answer-0)');
			expect(consoleWrapper.find('#name-cell-6').text()).toEqual('SubmitAnswer');
		});
		it('Should render correct isChanged icons', () => {
			expect(consoleWrapper.find('#is-changed-cell-0 .propsIcon').length).toEqual(1);
			expect(consoleWrapper.find('#is-changed-cell-0 .stateIcon').length).toEqual(0);
			expect(consoleWrapper.find('#is-changed-cell-1 .propsIcon').length).toEqual(1);
			expect(consoleWrapper.find('#is-changed-cell-1 .stateIcon').length).toEqual(1);
		});
	});

});

