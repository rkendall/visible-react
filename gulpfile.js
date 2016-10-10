'use strict';

var path = require('path');
var gulp = require('gulp');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var webpack = require('webpack');
var runSequence = require('run-sequence');

var visibleSrc = 'src';
var demoSrc = 'demo/src';

// Transpiled Visible React
var visibleDist = 'dist';
var vrNodeModule = 'demo/node_modules/visible-react';
var vrNodeModuleDist = path.join(vrNodeModule, 'dist');

// Transpiled demo build without converted env variables
var demoBuild = 'demo/build';
// Converted env variables
var demoDist = 'demo/dist';

gulp.task('default', [
	'build'
], function() {
	gulp.watch([path.join(visibleSrc, '**/*'), path.join(demoSrc, '**/*')], ['build']);
});

gulp.task('build', function(done) {
	runSequence(
		'package-json',
		'visible',
		'copy-index',
		'demo',
		'vr-settings',
		done)
});

gulp.task('package-json', function() {
	return gulp
		.src('package.json')
		.pipe(gulp.dest(vrNodeModule))
		.on('error', gutil.log);
});

gulp.task('visible', function(callback) {
	var webpackConfig = {
		entry: path.join(__dirname, visibleSrc, 'index'),
		output: {
			path: path.join(__dirname, visibleDist),
			filename: 'index.js',
			library: 'visible-react',
			libraryTarget: 'umd'
		},
		externals: [
			{
				react: {
					root: 'React',
					commonjs2: 'react',
					commonjs: 'react',
					amd: 'react'
				}
			},
			{
				'react-dom': {
					root: 'ReactDOM',
					commonjs2: 'react-dom',
					commonjs: 'react-dom',
					amd: 'react-dom'
				}
			}
		],
		devtool: 'source-map',
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					include: [
						path.join(__dirname, visibleSrc)
					]
				}
			]
		},
		plugins: [
			new webpack.optimize.DedupePlugin()

		]
	};

	// run webpack
	webpack(webpackConfig, function(err, stats) {
		if (err) throw new gutil.PluginError('webpack:build', err);
		if (stats.compilation.errors.toString()) {
			gutil.log("[webpack:errors]", stats.compilation.errors.toString({
				colors: true
			}));
		}
		if (stats.compilation.warnings.toString()) {
			gutil.log("[webpack:warnings]", stats.compilation.warnings.toString({
				colors: true
			}));
		}
		callback();
	});
});

gulp.task('copy-index', function() {
	return gulp
		.src(path.join(visibleDist, 'index.js'))
		.pipe(gulp.dest(vrNodeModuleDist))
		.on('error', gutil.log);
});

gulp.task('demo', function(callback) {
	var webpackConfig = {
		entry: path.join(__dirname, demoSrc, 'index'),
		output: {
			path: path.join(__dirname, demoBuild),
			filename: 'index.js'
		},
		devtool: 'source-map',
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					include: [
						path.join(__dirname, demoSrc),
						path.join(__dirname, visibleDist)
					]
				}
			]
		},
		plugins: [
			new webpack.optimize.DedupePlugin(),
		]
	};

	// run webpack
	webpack(webpackConfig, function(err, stats) {
		if (err) throw new gutil.PluginError('webpack:build', err);
		if (stats.compilation.errors.toString()) {
			gutil.log("[webpack:errors]", stats.compilation.errors.toString({
				colors: true
			}));
		}
		if (stats.compilation.warnings.toString()) {
			gutil.log("[webpack:warnings]", stats.compilation.warnings.toString({
				colors: true
			}));
		}
		callback();
	});
});

process.env.NODE_ENV = 'production';

gulp.task('vr-settings', function() {

	gulp.src(path.join(demoBuild, 'index.js'))

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

		.pipe(gulp.dest(demoDist));

	gulp.src(path.join(demoBuild, 'index.js.map'))
		.pipe(gulp.dest(demoDist));
});