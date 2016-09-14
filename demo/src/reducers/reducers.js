'use strict';

import deepcopy from 'deepcopy';
import uuid from 'node-uuid';

const questions = (state = {}, action) => {

	let newState = deepcopy(state);

	if (action.type === 'ADD_QUESTION') {
		let newQuestion = {
			...action.question,
			keywords: action.question.keywords !== '' ? action.question.keywords.trim().split(/\s+/) : [],
			user: newState.user.name,
			date: Date.now(),
			id: uuid.v1(),
			answers: []
		};
		newState.questions.unshift(newQuestion);
		return newState;
	} else if (action.type === 'ADD_ANSWER') {
		const answer = {
			text: action.answer,
			user: newState.user.name,
			date: Date.now()
		};
		let questionToUpdate = newState.questions.find((question) => {
			return question.id === action.questionId;
		});
		questionToUpdate.answers.push(answer);
		return newState;
	} else {
		return state;
	}

};

export default questions;