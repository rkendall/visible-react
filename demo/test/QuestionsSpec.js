'use strict';

import expect from 'expect';
import React from 'react';
import {shallow} from 'enzyme';

import {QuestionList} from '../src/components/QuestionList';
import {QuestionDetail} from '../src/components/QuestionDetail';
import {SubmitQuestion} from '../src/components/SubmitQuestion';
import questionData from '../fixtures/questions.json';

describe('Components', () => {

	const props = {
		questions: questionData,
		params: {id: '1'}
	};

	describe('Question List', () => {
		const wrapper = shallow(<QuestionList {...props} />);
		it('Should render', () => {
			const wrapper = shallow(<QuestionList {...props} />);
			expect(wrapper.find('Question').length).toEqual(2);
		});
	});

	describe('Question Detail', () => {
		it('Should render Question Detail', () => {
			const wrapper = shallow(<QuestionDetail {...props} />);
			expect(wrapper.find('#question').length).toBe(1);
			expect(wrapper.find('#title').text()).toBe('What is the quickest way to double my money?');
			expect(wrapper.find('Keywords').props().keywords.length).toBe(3);
			expect(wrapper.find('Byline').props().user).toBe('Jane Doe');
			expect(wrapper.find('#description').text()).toBe('I need expert financial advice on this matter.');
			expect(wrapper.find('#answer-heading').text()).toBe('1 Answer');
			expect(wrapper.find('Answer').length).toBe(1);
		});
	});

	describe('Submit Question', () => {
		const wrapper = shallow(<SubmitQuestion />);
		it('Submit button should be disabled when there\'s no title', () => {
			const button = wrapper.find('#submit-question-button');
			expect(button.prop('disabled')).toBe(true);
		});
		it('Adding text should update state', () => {
			const titleField = wrapper.find('#title-input-field');
			titleField.simulate('change', {target: {value: 'foo'}});
			expect(wrapper.state().title).toEqual('foo');
		});
	});

});

