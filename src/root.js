'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {StyleRoot} from 'radium';
import Immutable from 'immutable';

import PopoutWindow from './components/PopoutWindow.js';
import entries from './store/reducers';
import lifecycleConfig from './store/lifecycleConfig';

let consoleWindow = null;

const initialStore = Immutable.fromJS({entries: {}}).toMap();
let store = createStore(entries, initialStore);

const root = {

	isTimerOn: false,
	isWindowInitialized: false,
	_autoRefresh: true,

	add(action) {
		const {key, name} = action;
		const id = this.makeId(key, name);
		store.dispatch({
			type: 'ADD',
			key,
			name,
			id,
			displayName: this.makeDisplayName(key, name)
		});
		return id;
	},

	updateStore(action) {
		store.dispatch(action);
	},

	getFromStore(keyPath) {
		return store.getState().getIn(keyPath);
	},

	makeId(key, name) {
		return key ? `${name}-${key}` : name;
	},

	makeDisplayName(key, name) {
		const formattedName = this.removeComponentWrapperNames(name);
		return key ? `${formattedName} (${key})` : formattedName;
	},

	removeComponentWrapperNames(name) {
		const wrapperPattern = /[^\(]+\(([^\)]+)\)/;
		while (wrapperPattern.test(name)) {
			name = name.replace(/[^\(]+\(([^\)]+)\)/, '$1')
		}
		return name;
	},

	addCalculatedValues() {
		const entries = store.getState().get('entries');
		return lifecycleConfig.addRemainingPropertiesToAllEntries(entries);
	},

	set autoRefresh(value) {
		this._autoRefresh = value;
	},

	get autoRefresh() {
		return this._autoRefresh;
	},

	// The timer returns control to the wrapped application while
	// Visible React processes a batch of updates and does it's own rendering.
	// This is necessary for performance.
	updateWindow(isManualRefresh = false) {
		if (this.isWindowInitialized && !this.autoRefresh && !isManualRefresh) {
			return;
		}
		if (this.isTimerOn || consoleWindow === null || consoleWindow.closed) {
			return;
		}
		this.isTimerOn = true;
		setTimeout(() => {
			const entries = this.addCalculatedValues();
			const container = consoleWindow.document.getElementById('visible-react');
			if (!this.isWindowInitialized) {
				this.isWindowInitialized = true;
			}
			ReactDOM.render((
				<Provider store={store}>
					<StyleRoot>
						<PopoutWindow
							entries={entries}
						/>
					</StyleRoot>
				</Provider>
			), container);
			this.isTimerOn = false;
		}, 0);
	},

	getWindow() {

		if ((window && consoleWindow === null) || consoleWindow.closed) {

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
			window.onbeforeunload = () => {
				consoleWindow.close();
			};
		}
		return consoleWindow;
	}

};

export default root;