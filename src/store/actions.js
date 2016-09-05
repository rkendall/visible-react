'use strict';

export const add = (key, name) => {
	return {
		type: 'ADD',
		key,
		name
	};
};

export const updateEntry = (key, value) => {
	return {
		type: 'UPDATE_ENTRY',
		key,
		value
	};
};

export const updateValue = (key, value) => {
	return {
		type: 'UPDATE_VALUE',
		keyPath,
		value
	};
};

export const updateMethods = (key, value) => {
	return {
		type: 'UPDATE_METHODS',
		key,
		value
	};
};