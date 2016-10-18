'use strict';

import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import {shallow, mount} from 'enzyme';
import Immutable from 'immutable';
import jsdom from 'jsdom';
import {StyleRoot} from 'radium';
import getComputedStyle from 'computed-style';

// Mocks
const doc = jsdom.jsdom('<!doctype html><html><head><title></title></head><body></body></html>');
global.document = doc;
global.window = doc.defaultView;
global.window.document = doc;
global.window.open = function() {
	let consoleWindow = jsdom.jsdom('<!doctype html><html><head><title>Test</title></head><body></body></html>');
	consoleWindow.document = {
		title: '',
		body: {
			appendChild: function() {
			}
		},
		createElement: function() {
			return {id: ''}
		}
	};
	consoleWindow.close = function() {
	};
	consoleWindow.focus = function() {
	};
	return consoleWindow;
};
global.alert = function() {
};
global.getComputedStyle = function() {
	return {
		width: '',
		paddingLeftWidth: '',
		paddingRightWidth: '',
		borderRightWidth: '',
		borderLeftWidth: ''
	}
};
ReactDOM.findDOMNode = function() {
	return {
		offsetParent: {
			offsetTop: 100
		}
	}
};

// Fixture for initial load of detail of first question
import entries from './fixtures/entries.json';
import Console from '../src/components/Console';

describe('Console', function() {

	let consoleWrapper;

	beforeEach(function() {
		const props = {
			entries: Immutable.fromJS(entries),
			windowWidth: 1200
		};
		consoleWrapper = mount(<StyleRoot><Console {...props} /></StyleRoot>);
	});

	describe('ComponentList', function() {
		it('Should render correct numbers of rows and cells', function() {
			expect(consoleWrapper.find('BootstrapTable').length).toBe(1);
			expect(consoleWrapper.find('TableRow').length).toBe(4);
			expect(consoleWrapper.find('TableRow').at(0).find('TableColumn').length).toBe(6);
		});
		it('Should render correct values in row 1', function() {
			const row1Columns = consoleWrapper.find('TableRow').at(0).find('TableColumn');
			expect(row1Columns.at(0).text()).toBe('Component1');
			expect(row1Columns.at(1).text()).toBe('••');
			expect(row1Columns.at(2).text()).toBe('Component1');
			expect(row1Columns.at(3).text()).toBe('1');
			expect(row1Columns.at(4).text()).toBe('');
		});
		it('Should render correct values in row 2', function() {
			const row2Columns = consoleWrapper.find('TableRow').at(1).find('TableColumn');
			expect(row2Columns.at(1).text()).toBe('•');
			expect(row2Columns.at(1).find('.propsIcon').length).toBe(1);
			expect(row2Columns.at(1).find('.stateIcon').length).toBe(0);
			expect(row2Columns.at(4).text()).toBe('2');
		});
		it('Should render correct values in row 3', function() {
			const row3Columns = consoleWrapper.find('TableRow').at(2).find('TableColumn');
			expect(row3Columns.at(1).text()).toBe('•');
			expect(row3Columns.at(1).find('.propsIcon').length).toBe(0);
			expect(row3Columns.at(1).find('.stateIcon').length).toBe(1);
			expect(row3Columns.at(2).text()).toBe('Component3');
		});
	});

	describe('LifeCyle Pane', function() {
		it('Should render correct number of method cards', function() {
			expect(consoleWrapper.find('Method').length).toBe(9);
		});

		it('Should render correct content for first method card', function() {

			expect(consoleWrapper.find('#constructor-method-name').text()).toBe('constructor(props) or getInitialState()');
			expect(consoleWrapper.find('#constructor-method-times-called').text()).toBe('Times called: 1');

			const propsElement = consoleWrapper.find('#component-will-mount-props-value-0');
			const props = JSON.parse(propsElement.text());
			expect(props.propValueForComponent1).toBe('Component1 props');
			console.log(propsElement.get(0).getAttribute('style'));
			expect(propsElement.get(0).getAttribute('style')).toContain('color: gray');

			const stateElement = consoleWrapper.find('#component-will-mount-state-value-0');
			const state = JSON.parse(stateElement.text());
			expect(state.stateValueForComponent1).toBe('Component1 state');
			expect(stateElement.get(0).getAttribute('style')).toContain('color: rgb(76, 175, 80)');

		});

		it('Should correctly indicate existing methods', function() {

			const bgColorIfExists = 'background: rgb(253, 253, 184)';
			const title = 'This method exists in the wrapped component';
			const shadow = /box\-shadow: \dpx \dpx/;

			let element = consoleWrapper.find('#constructor-method-name > div').get(0);
			expect(element.getAttribute('title')).toBe(title);
			// Style if method exists in wrapped component
			expect(element.getAttribute('style')).toContain(bgColorIfExists);
			expect(element.getAttribute('style')).toMatch(shadow);

			element = consoleWrapper.find('#component-will-mount-name > div').get(0);
			expect(element.getAttribute('title').length).toBe(0);
			// Style if method exists in wrapped component
			expect(element.getAttribute('style')).toNotContain(bgColorIfExists);
			expect(element.getAttribute('style')).toNotMatch(shadow);

			element = consoleWrapper.find('#component-did-mount-name > div').get(0);
			expect(element.getAttribute('title').length).toBe(0);
			// Style if method exists in wrapped component
			expect(element.getAttribute('style')).toNotContain(bgColorIfExists);
			expect(element.getAttribute('style')).toNotMatch(shadow);

			element = consoleWrapper.find('#component-will-update-name > div').get(0);
			expect(element.getAttribute('title')).toBe(title);
			// Style if method exists in wrapped component
			expect(element.getAttribute('style')).toContain(bgColorIfExists);
			expect(element.getAttribute('style')).toMatch(shadow);

			element = consoleWrapper.find('#render-name > div').get(0);
			expect(element.getAttribute('title')).toBe(title);
			// Style if method exists in wrapped component
			expect(element.getAttribute('style')).toContain(bgColorIfExists);
			expect(element.getAttribute('style')).toMatch(shadow);

		});
	});

});

