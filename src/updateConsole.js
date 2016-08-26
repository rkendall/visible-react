'use strict';

let consoleWindow = null;

const updateConsole = {

	getWindow: () => {
		if (consoleWindow === null || consoleWindow.closed) {
			consoleWindow = window.open(
				'index.html',
				'console',
				"width=1000,height=800,resizable,scrollbars=yes,status=1"
			);
			if (!consoleWindow) {
				alert('You must disable your popup blocker to use the Life Insurance Console.');
			}
			consoleWindow.focus();
		}
		window.onbeforeunload = () => {
			consoleWindow.close();
		};
		return consoleWindow;
	},

	update: () => {
		return window.log;
	}

};

export default updateConsole;