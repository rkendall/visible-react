'use strict';

import root from './root.js';

const settingsManager = {

	settings: {},

	set(wrapperParams = {}) {

		let envVars = {};
		let localVars = {
			enabled: wrapperParams.enabled !== undefined ? wrapperParams.enabled : false,
			monitor: wrapperParams.monitor !== undefined ? wrapperParams.monitor : false,
			logging: wrapperParams.logging !== undefined ? wrapperParams.logging : false,
			compare: wrapperParams.compare !== undefined ? wrapperParams.compare : 'none'
		};

		let process = process ? process : {};
		process.env = process.env ? process.env : {};

		envVars.mode = process.env.NODE_ENV || 'development';

		envVars.devEnabled = process.env.VR_DEV_ENABLED || 'all';
		envVars.devMonitor = process.env.VR_DEV_MONITOR || 'all';
		envVars.devLogging = process.env.VR_DEV_LOGGING || 'selected';
		envVars.devControlRender = process.env.VR_DEV_CONTROL || 'all';
		envVars.devCompare = process.env.VR_DEV_COMPARE || 'deep';

		envVars.prodEnabled = process.env.VR_PROD_ENABLED || 'none';
		envVars.prodMonitor = process.env.VR_PROD_MONITOR || 'none';
		envVars.prodLogging = process.env.VR_PROD_LOGGING || 'none';
		envVars.prodControlRender = process.env.VR_PROD_CONTROL || 'selected';
		envVars.prodCompare = process.env.VR_PROD_COMPARE || 'shallow';

		envVars.enabled = process.env.VR_ENABLED || 'all';
		envVars.monitor = process.env.VR_MONITOR || 'all';
		envVars.logging = process.env.VR_LOGGING || 'none';
		envVars.controlRender = process.env.VR_CONTROL || 'selected';
		envVars.compare = process.env.VR_COMPARE || 'shallow';

		let settingValues = {};

		const envProperties = [
			'enabled',
			'monitor',
			'logging',
			'controlRender'
		];

		envProperties.forEach((prop) => {
			let defaultValue = true;
			if (prop === 'logging') {
				defaultValue = false;
			}
			const propSuffix = prop[0].toUpperCase() + prop.substr(1);
			const devProp = 'dev' + propSuffix;
			const prodProp = 'prod' + propSuffix;
			if (prop !== 'enabled' && !settingValues.enabled) {
				settingValues[prop] = false;
			} else if (envVars[prop] === 'all') {
				settingValues[prop] = true;
			} else if (envVars[prop] === 'selected') {
				settingValues[prop] = wrapperParams[prop] !== undefined ? wrapperParams[prop] : false;
			} else if (envVars[prop] === 'none') {
				settingValues[prop] = false;
			} else if (envVars.mode === 'development') {
				if (envVars[devProp] === 'all') {
					settingValues[prop] = true;
				} else if (envVars[devProp] === 'selected') {
					settingValues[prop] = wrapperParams[prop] !== undefined ? wrapperParams[prop] : false;
				} else if (envVars[devProp] === 'none') {
					settingValues[prop] = false;
				}
			} else if (envVars.mode === 'production') {
				if (envVars[prodProp] === 'all') {
					settingValues[prop] = true;
				} else if (envVars[prodProp] === 'selected') {
					settingValues[prop] = wrapperParams[prop] !== undefined ? wrapperParams[prop] : false;
				} else if (envVars[prodProp] === 'none') {
					settingValues[prop] = false;
				}
			} else {
				settingValues[prop] = defaultValue;
			}
		});

		// compare
		if (!settingValues.enabled || !settingValues.controlRender || envVars.compare === 'none') {
			settingValues.compare = 'none';
		} else if (wrapperParams.compare !== undefined) {
			settingValues.compare = wrapperParams.compare;
		} else if (envVars.compare !== 'none') {
			settingValues.compare = envVars.compare;
		} else if (envVars.mode === 'development') {
			settingValues.compare = envVars.devCompare;
		} else if (envVars.mode === 'production') {
			settingValues.compare = envVars.prodCompare;
		} else {
			settingValues.compare = 'none';
		}

		this.settings = {
			enabled: settingValues.enabled,
			monitor: settingValues.monitor,
			logging: settingValues.logging,
			compare: settingValues.compare
		};

		root.setSettings({monitor: settingValues.monitor});

	},

	get enabled() {
		return this.settings.enabled;
	},

	get monitor() {
		return this.settings.monitor;
	},

	get logging() {
		return this.settings.logging;
	},

	get compare() {
		return this.settings.compare;
	}

};

export default settingsManager;