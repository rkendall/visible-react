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
		type: 'UPDATE_PROPSANDSTATE',
		keyPath,
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

export const updateMethod = (entryId, methodName, value) => {
	return {
		type: 'UPDATE_METHOD',
		entryId,
		methodName,
		value
	};
};

export const updateMethods = (entryId, value) => {
	return {
		type: 'UPDATE_METHODS',
		entryId,
		value
	};
};