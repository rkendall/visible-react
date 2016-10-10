'use strict';

const settingsManager = {

	settings: {},

	set(wrapperParams = {}) {

		let process = process ? process : {};
		process.env = process.env ? process.env : {};
		let buildVars = null;

		try {
			buildVars = {
				mode: process.env.NODE_ENV,
				development: {
					enabled: process.env.VR_DEV_ENABLED,
					monitor: process.env.VR_DEV_MONITOR,
					logging: process.env.VR_DEV_LOGGING,
					control: process.env.VR_DEV_CONTROL,
					compare: process.env.VR_DEV_COMPARE
				},
				production: {
					enabled: process.env.VR_PROD_ENABLED,
					monitor: process.env.VR_PROD_MONITOR,
					logging: process.env.VR_PROD_LOGGING,
					control: process.env.VR_PROD_CONTROL,
					compare: process.env.VR_PROD_COMPARE
				}
			};
		} catch(error) {
			console.error('Error setting environment variables from build -- ' + error);
		}

		const isBuildVarsValid = Boolean(buildVars);

		let defaultValues = {
			development: {
				enabled: 'all',
				monitor: 'all',
				logging: 'selected',
				control: 'all',
				compare: 'deep'
			},
			production: {
				enabled: 'none',
				monitor: 'none',
				logging: 'none',
				control: 'all',
				compare: 'shallow'
			}
		};

		let envVars = {};
		if (isBuildVarsValid) {
			envVars = this.getValueFromBuildVar(buildVars, defaultValues);
		} else {
			envVars = defaultValues;
		}
		envVars.mode = (isBuildVarsValid && buildVars.mode === 'production') ? 'production' : 'development';

		let localVars = {
			enabled: wrapperParams.enabled !== undefined ? wrapperParams.enabled : false,
			monitor: wrapperParams.monitor !== undefined ? wrapperParams.monitor : false,
			logging: wrapperParams.logging !== undefined ? wrapperParams.logging : false,
			compare: wrapperParams.compare !== undefined ? wrapperParams.compare : null
		};

		let settingValues = {};

		const mode = envVars.mode;

		const envProperties = [
			'enabled',
			'monitor',
			'logging',
			'control'
		];

		envProperties.forEach((prop) => {
			let value = envVars[mode][prop];
			if (value === 'all') {
				settingValues[prop] = true;
			} else if (value === 'selected') {
				const localValue = localVars[prop];
				if ([true, false].includes(localValue)) {
					settingValues[prop] = localValue;
				} else {
					settingValues[prop] = false;
					console.error(`Illegal Visible React configuration value "${localValue}" for "${prop}" passed to Visible function`);
				}
			} else if (value === 'none') {
				settingValues[prop] = false;
			}
		});

		// compare
		// If control is false, no comparison will be done
		if (!settingValues.control) {
			settingValues.compare = 'none';
		// Local compare settings will always override global compare settings
		} else if (localVars.compare !== null && this.isValueValid('compare', localVars.compare)) {
			settingValues.compare = localVars.compare;
		} else  {
			settingValues.compare = envVars[mode].compare;
		}

		this.settings = {
			enabled: settingValues.enabled,
			monitor: settingValues.monitor,
			logging: settingValues.logging,
			compare: settingValues.compare
		};

	},

	getValueFromBuildVar(buildVars, defaultValues) {
		let envVars = {};
		for (let category in defaultValues) {
			envVars[category] = {};
			for (let prop in defaultValues[category]) {
				let value = buildVars[category][prop];
				if (value === null || value === undefined || !this.isValueValid(prop, value)) {
					value = defaultValues[category][prop];
				}
				envVars[category][prop] = value;
			}
		}
		return envVars;
	},

	isValueValid(prop, value) {
		let isValid = false;
		if (['enabled', 'monitor', 'logging'].includes(prop)) {
			isValid = ['all', 'selected', 'none'].includes(value);
		} else if (prop === 'control') {
			isValid = ['all', 'none'].includes(value);
		} else if (prop === 'compare') {
			isValid = ['none', 'shallow', 'deep'].includes(value);
		}
		if (!isValid) {
			console.error(`Illegal Visible React configuration value "${value}" for "${prop}"`);
			return false;
		} else {
			return true;
		}
	},

	get() {
		return Object.assign({}, this.settings);
	}

};

export default settingsManager;