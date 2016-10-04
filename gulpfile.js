'use strict';

var path = require('path');
var gulp = require('gulp');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var webpack = require('webpack');
var runSequence = require('run-sequence');

gulp.task('default', [
	'build'
], function() {
	gulp.watch(['src/**/*', 'demo/src/**/*'], ['build']);
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
		.pipe(gulp.dest('demo/node_modules/visible-react'))
		.on('error', gutil.log);
});

// // This doesn't work
// gulp.task('vr-settings', function(callback) {
// 	var webpackConfig = {
// 		entry: path.join(__dirname, 'demo/build/index'),
// 		output: {
// 			path: path.join(__dirname, 'demo/dist'),
// 			filename: 'index.js'
// 		},
// 		devtool: 'source-map',
// 		plugins: [
// 			new webpack.DefinePlugin({
// 				'process.env.NODE_ENV': JSON.stringify('production')
// 			})
// 		]
// 	};
// 	// run webpack
// 	webpack(webpackConfig, function(err, stats) {
// 		if (err) throw new gutil.PluginError('webpack:build', err);
// 		gutil.log('[webpack:build]', stats.toString({
// 			colors: true
// 		}));
// 		callback();
// 	});
// });

gulp.task('vr-settings', function() {
	gulp.src('demo/build/index.js')
		// process.env.NODE_ENV is overridden by the settings below it
		.pipe(replace('process.env.NODE_ENV', process.env.NODE_ENV || JSON.stringify('development')))

		.pipe(replace('process.env.VR_DEV_ENABLED', process.env.VR_DEV_ENABLED || JSON.stringify('all')))
		.pipe(replace('process.env.VR_DEV_MONITOR', process.env.VR_DEV_MONITOR || JSON.stringify('all')))
		.pipe(replace('process.env.VR_DEV_LOGGING', process.env.VR_DEV_LOGGING || JSON.stringify('none')))
		.pipe(replace('process.env.VR_DEV_CONTROL', process.env.VR_DEV_CONTROL || JSON.stringify('all')))
		.pipe(replace('process.env.VR_DEV_COMPARE', process.env.VR_DEV_COMPARE || JSON.stringify('deep')))

		.pipe(replace('process.env.VR_PROD_ENABLED', process.env.VR_PROD_ENABLED || JSON.stringify('none')))
		.pipe(replace('process.env.VR_PROD_MONITOR', process.env.VR_PROD_MONITOR || JSON.stringify('none')))
		.pipe(replace('process.env.VR_PROD_LOGGING', process.env.VR_PROD_LOGGING || JSON.stringify('none')))
		.pipe(replace('process.env.VR_PROD_CONTROL', process.env.VR_PROD_CONTROL || JSON.stringify('selected')))
		.pipe(replace('process.env.VR_PROD_COMPARE', process.env.VR_PROD_COMPARE || JSON.stringify('shallow')))

		.pipe(replace('process.env.VR_ENABLED', process.env.VR_ENABLED || JSON.stringify('all')))
		.pipe(replace('process.env.VR_MONITOR', process.env.VR_MONITOR || JSON.stringify('all')))
		.pipe(replace('process.env.VR_LOGGING', process.env.VR_LOGGING || JSON.stringify('none')))
		.pipe(replace('process.env.VR_CONTROL', process.env.VR_CONTROL || JSON.stringify('all')))
		.pipe(replace('process.env.VR_COMPARE', process.env.VR_COMPARE || JSON.stringify('shallow')))
		.pipe(gulp.dest('demo/dist'));
	gulp.src('demo/build/index.js.map')
		.pipe(gulp.dest('demo/dist'));
});

gulp.task('visible', function(callback) {
	var webpackConfig = {
		entry: path.join(__dirname, 'src/index'),
		output: {
			path: path.join(__dirname, 'dist'),
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
						path.join(__dirname, 'src')
					]
				}
			]
		},
		plugins: [
			// new webpack.DefinePlugin({
			// 	'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
			// }),
			new webpack.optimize.DedupePlugin()
			//new webpack.optimize.UglifyJsPlugin()

		]
		// // To avoid duplicate copies of React being loaded
		// resolve: {
		// 	alias: {
		// 		react: path.resolve('./demo/node_modules/react')
		// 	}
		// }
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
		// gutil.log('[webpack:build]', stats.toString({
		// 	colors: true
		// }));
		callback();
	});
});


gulp.task('copy-index', function() {
	return gulp
		.src('dist/index.js')
		.pipe(gulp.dest('demo/node_modules/visible-react/dist'))
		.on('error', gutil.log);
});

gulp.task('demo', function(callback) {
	var webpackConfig = {
		entry: path.join(__dirname, 'demo/src/index'),
		output: {
			path: path.join(__dirname, 'demo/build'),
			filename: 'index.js'
		},
		devtool: 'source-map',
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					include: [
						path.join(__dirname, 'demo/src'),
						path.join(__dirname, 'dist')
					]
				}
			]
		},
		plugins: [
			new webpack.optimize.DedupePlugin(),
			// new webpack.DefinePlugin({
			// 	'process.env': {
			// 		'NODE_ENV': JSON.stringify('development'),
			// 		'VR_ENABLED': false
			// 	}
			// })
			//new webpack.optimize.UglifyJsPlugin()

		]
		// // To avoid duplicate copies of React being loaded
		// resolve: {
		// 	alias: {
		// 		react: path.resolve('./demo/node_modules/react')
		// 	}
		// }
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
		// gutil.log('[webpack:build]', stats.toString({
		// 	colors: true
		// }));
		callback();
	});
});