'use strict';

var path = require('path');
var gulp = require('gulp');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var webpack = require('webpack');

gulp.task('default', [
	'visible',
	'demo'
], function() {
	gulp.watch(['src/**/*', 'demo/src/**/*'], ['visible', 'demo']);
});

gulp.task('build', [
	'visible',
	'demo'
]);

gulp.task('packagejson', function() {
	return gulp
		.src('package.json')
		.pipe(gulp.dest('demo/node_modules/visible-react'));
});

gulp.task('visible',[
	'packagejson'
], function(callback) {
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
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('development')
				}
			}),
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
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));
		callback();
	});
});


gulp.task('copy-index', [
	'visible'
], function() {
	return gulp
		.src('dist/index.js')
		.pipe(gulp.dest('demo/node_modules/visible-react/dist'));
});

gulp.task('demo', [
	'visible',
	'copy-index'
], function(callback) {
	var webpackConfig = {
		entry: path.join(__dirname, 'demo/src/index'),
		output: {
			path: path.join(__dirname, 'demo/dist'),
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
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('development')
				}
			}),
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
		// gutil.log('[webpack:build]', stats.toString({
		// 	colors: true
		// }));
		callback();
	});
});