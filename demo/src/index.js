'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {Router, Route, hashHistory} from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {StyleRoot} from 'radium';
import Visible from 'visible-react';

import questions from './reducers/reducers.js';
import App from './components/App.js';
import QuestionList from './components/QuestionList.js';
import QuestionDetail from './components/QuestionDetail.js';
import SubmitQuestion from './components/SubmitQuestion.js';

import questionData from 'json!../fixtures/questions.json';
import userData from 'json!../fixtures/user.json';

// import Perf from 'react-addons-perf';
// window.Perf = Perf;

Visible.setup();

const WrappedApp = Visible()(App);

const initialStore = {
	questions: questionData,
	user: userData
};
let store = createStore(questions, initialStore);

render((
	<Provider store={store}>
		<StyleRoot>
			<MuiThemeProvider>
				<Router history={hashHistory}>
						<Route component={WrappedApp}>
							<Route path='/' component={QuestionList}/>
							<Route path='question/:id' component={QuestionDetail}/>
							<Route path='new-question' component={SubmitQuestion}/>
							<Route path='*' component={QuestionList}/>
						</Route>
				</Router>
			</MuiThemeProvider>
		</StyleRoot>
	</Provider>
), document.getElementById('root'));
