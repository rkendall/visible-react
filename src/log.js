'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {StyleRoot} from 'radium';
import clone from 'deep-copy';
import Immutable from 'immutable';

import PopoutWindow from './components/PopoutWindow.js';
import entries from './store/reducers';
import lifecycleConfig from './store/lifecycleConfig';

let consoleWindow = null;

const initialStore = Immutable.fromJS({entries: {}}).toMap();
let store = createStore(entries, initialStore);

const log = {

	isTimerOn: false,

	add: (action) => {
		const {key, name} = action;
		const id = log.makeId(key, name);
		store.dispatch({
			type: 'ADD',
			key,
			name,
			id,
			displayName: log.makeDisplayName(key, name)
		});
		return id;
	},

	updateStore: (action) => {
		store.dispatch(action);
	},

	getFromStore: (keyPath) => {
		return store.getState().getIn(keyPath);
	},

	makeId: (key, name) => {
		return key ? `${name}-${key}` : name;
	},

	makeDisplayName: (key, name) => {
		const formattedName = log.removeComponentWrapperNames(name);
		return key ? `${formattedName} (${key})` : formattedName;
	},

	removeComponentWrapperNames: (name) => {
		const wrapperPattern = /[^\(]+\(([^\)]+)\)/;
		while (wrapperPattern.test(name)) {
			name = name.replace(/[^\(]+\(([^\)]+)\)/, '$1')
		}
		return name;
	},

	addCalculatedValues: () => {
		const entries = store.getState().get('entries');
		return lifecycleConfig.addRemainingPropertiesToAllEntries(entries);
	},

	// The timer returns control to the wrapped application while
	// Visible React processes a batch of updates and does it's own rendering.
	// This is necessary for performance.
	updateWindow: (lifecycleId) => {
		if (consoleWindow === null || consoleWindow.closed) {
			return;
		}
		if (log.isTimerOn) {
			return;
		}
		log.isTimerOn = true;
		const self = this;
		setTimeout(() => {
			const entries = log.addCalculatedValues();
			const container = consoleWindow.document.getElementById('visible-react');
			ReactDOM.render((
				<Provider store={store}>
					<StyleRoot>
						<PopoutWindow
							entries={entries}
						/>
					</StyleRoot>
				</Provider>
			), container);
			log.isTimerOn = false;
		}, 0);
	},

	getWindow: () => {
		if (window && consoleWindow === null || consoleWindow.closed) {
			consoleWindow = window.open(
				'',
				'console',
				"width=1350,height=900,resizable,scrollbars=yes,status=1"
			);
			if (!consoleWindow) {
				alert('You must disable your popup blocker to use the Visible React Console.');
			}
			consoleWindow.document.title = 'Visible React';
			const container = consoleWindow.document.createElement('div');
			container.id = 'visible-react';
			consoleWindow.document.body.appendChild(container);
			consoleWindow.focus();
			//log.updateWindow();
			window.onbeforeunload = () => {
				consoleWindow.close();
			};
		}
		return consoleWindow;
	}
};

export default log;