'use strict';

import expect from 'expect';
import gulp from 'gulp';
import replace from 'gulp-replace';
import gutil from 'gulp-util';
import path from 'path';
import del from 'del';

const runGulp = (dir, callback) => {
	gulp.task('vr-settings', function() {
		gulp.src('src/settingsManager.js')
			.pipe(replace('process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV) || null))
			.pipe(replace('process.env.VR_DEV_ENABLED', JSON.stringify(process.env.VR_DEV_ENABLED) || null))
			.pipe(replace('process.env.VR_DEV_MONITOR', JSON.stringify(process.env.VR_DEV_MONITOR) || null))
			.pipe(replace('process.env.VR_DEV_LOGGING', JSON.stringify(process.env.VR_DEV_LOGGING) || null))
			.pipe(replace('process.env.VR_DEV_CONTROL', JSON.stringify(process.env.VR_DEV_CONTROL) || null))
			.pipe(replace('process.env.VR_DEV_COMPARE', JSON.stringify(process.env.VR_DEV_COMPARE) || null))
			.pipe(replace('process.env.VR_PROD_ENABLED', JSON.stringify(process.env.VR_PROD_ENABLED) || null))
			.pipe(replace('process.env.VR_PROD_MONITOR', JSON.stringify(process.env.VR_PROD_MONITOR) || null))
			.pipe(replace('process.env.VR_PROD_LOGGING', JSON.stringify(process.env.VR_PROD_LOGGING) || null))
			.pipe(replace('process.env.VR_PROD_CONTROL', JSON.stringify(process.env.VR_PROD_CONTROL) || null))
			.pipe(replace('process.env.VR_PROD_COMPARE', JSON.stringify(process.env.VR_PROD_COMPARE) || null))
			.pipe(gulp.dest(path.join('test/temp', dir)))
			.on('finish', function() {
				callback();
				gutil.log('Gulp done');
			});
	});
	gulp.start('vr-settings');
};

describe('Configuration', function() {
	after(function() {
		del(['test/temp/**']);
	});
	describe('Settings Manager', function() {
		it('Should use default settings if no variables passed in', function() {
			const settingsManager = require('../src/settingsManager');
			settingsManager.set();
			const settings = settingsManager.get();
			expect(settings.enabled).toEqual(true);
			expect(settings.monitor).toEqual(true);
			expect(settings.logging).toEqual(false);
			expect(settings.compare).toEqual('deep');
		});
	});
	describe('Settings Manager Production Settings', function() {
		const dir = 'production';
		before(function(done) {
			process.env.NODE_ENV = 'production';
			runGulp(dir, done);
		});
		it('Should use default production settings if env variable is set to production', function() {
			const settingsManager = require('./temp/' + dir + '/settingsManager');
			settingsManager.set();
			const settings = settingsManager.get();
			expect(settings.enabled).toEqual(false);
			expect(settings.monitor).toEqual(false);
			expect(settings.logging).toEqual(false);
			expect(settings.compare).toEqual('shallow');
		});
	});
	describe('Settings Manager Custom Dev', function() {
		const dir = 'custom-dev';
		before(function(done) {
			process.env.NODE_ENV = 'development';
			process.env.VR_DEV_MONITOR = 'none';
			process.env.VR_DEV_LOGGING = 'all';
			process.env.VR_DEV_CONTROL = 'none';
			runGulp(dir, done);
		});
		it('Should enable logging and disable monitoring and comparison', function() {
			const settingsManager = require('./temp/' + dir + '/settingsManager');
			settingsManager.set();
			const settings = settingsManager.get();
			expect(settings.enabled).toEqual(true);
			expect(settings.monitor).toEqual(false);
			expect(settings.logging).toEqual(true);
			expect(settings.compare).toEqual('none');
		});
	});
	describe('Settings Manager Custom Prod', function() {
		const dir = 'custom-prod';
		before(function(done) {
			process.env.NODE_ENV = 'production';
			process.env.VR_PROD_ENABLED = 'all';
			process.env.VR_PROD_MONITOR = 'all';
			process.env.VR_PROD_LOGGING = 'all';
			process.env.VR_PROD_CONTROL = 'all';
			process.env.VR_PROD_COMPARE = 'deep';
			process.env.VR_DEV_ENABLED = 'none';
			process.env.VR_DEV_MONITOR = 'none';
			process.env.VR_DEV_LOGGING = 'none';
			process.env.VR_DEV_CONTROL = 'none';
			runGulp(dir, done);
		});
		it('Should enable all features in prod', function() {
			const settingsManager = require('./temp/' + dir + '/settingsManager');
			settingsManager.set();
			const settings = settingsManager.get();
			expect(settings.enabled).toEqual(true);
			expect(settings.monitor).toEqual(true);
			expect(settings.logging).toEqual(true);
			expect(settings.compare).toEqual('deep');
		});
	});
	describe('Settings Manager Invalid Settings', function() {
		const dir = 'invalid';
		before(function(done) {
			process.env.NODE_ENV = 'development';
			process.env.VR_DEV_FOO = 'all';
			process.env.VR_DEV_MONITOR = 'some';
			process.env.VR_DEV_LOGGING = true;
			process.env.VR_DEV_CONTROL = false;
			process.env.VR_DEV_ENABLED = 'all';
			process.env.VR_DEV_COMPARE = 'deep';
			runGulp(dir, done);
		});
		it('Should ignore invalid settings', function() {
			const settingsManager = require('./temp/' + dir + '/settingsManager');
			settingsManager.set();
			const settings = settingsManager.get();
			console.log(settings);
			expect(settings.enabled).toEqual(true);
			expect(settings.monitor).toEqual(true);
			expect(settings.logging).toEqual(false);
			expect(settings.compare).toEqual('deep');
		});
	});
	describe('Settings Manager Local Prod', function() {
		const dir = 'local-prod';
		before(function(done) {
			process.env.NODE_ENV = 'production';
			process.env.VR_PROD_ENABLED = 'selected';
			process.env.VR_PROD_MONITOR = 'selected';
			process.env.VR_PROD_LOGGING = 'none';
			process.env.VR_PROD_CONTROL = 'none';
			runGulp(dir, done);
		});
		it('Should use local settings for prod', function() {
			const settingsManager = require('./temp/' + dir + '/settingsManager');
			const localSettings = {
				enabled: true,
				monitor: true,
				logging: true
			};
			settingsManager.set(localSettings);
			const settings = settingsManager.get();
			expect(settings.enabled).toEqual(true);
			expect(settings.monitor).toEqual(true);
			expect(settings.logging).toEqual(false);
			expect(settings.compare).toEqual('none');
		});
	});
	describe('Settings Manager Local Dev', function() {
		const dir = 'local-dev';
		before(function(done) {
			process.env.NODE_ENV = 'development';
			process.env.VR_DEV_ENABLED = 'selected';
			process.env.VR_DEV_MONITOR = 'none';
			process.env.VR_DEV_LOGGING = 'none';
			process.env.VR_DEV_CONTROL = 'selected';
			process.env.VR_DEV_COMPARE = 'none';
			runGulp(dir, done);
		});
		it('Should use local settings for dev', function() {
			const settingsManager = require('./temp/' + dir + '/settingsManager');
			const localSettings = {
				enabled: true,
				compare: 'shallow'
			};
			settingsManager.set(localSettings);
			const settings = settingsManager.get();
			expect(settings.enabled).toEqual(true);
			expect(settings.monitor).toEqual(false);
			expect(settings.logging).toEqual(false);
			expect(settings.compare).toEqual('shallow');
		});
	});
	describe('Settings Manager Local Invalide', function() {
		const dir = 'local-invalid';
		before(function(done) {
			process.env.NODE_ENV = 'development';
			process.env.VR_DEV_ENABLED = 'all';
			process.env.VR_DEV_MONITOR = 'none';
			process.env.VR_DEV_LOGGING = 'selected';
			// 'selected' is invalid here
			process.env.VR_DEV_CONTROL = 'selected';
			process.env.VR_DEV_COMPARE = 'shallow';
			runGulp(dir, done);
		});
		it('Should use local settings for dev', function() {
			const settingsManager = require('./temp/' + dir + '/settingsManager');
			const localSettings = {
				logging: 'all',
				compare: 'foo'
			};
			settingsManager.set(localSettings);
			const settings = settingsManager.get();
			expect(settings.enabled).toEqual(true);
			expect(settings.monitor).toEqual(false);
			expect(settings.logging).toEqual(false);
			expect(settings.compare).toEqual('shallow');
		});
	});
});
