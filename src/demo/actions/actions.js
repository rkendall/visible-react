'use strict';

export const addQuestion = (question) => {
	return {
		type: 'ADD_QUESTION',
		question
	};
};

export const addAnswer = (questionId, answer) => {
	return {
		type: 'ADD_ANSWER',
		questionId,
		answer
	};
};
