var gulp = require('gulp');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

gulp.task('default', [
	'insure',
	'demo'
], function() {
	gulp.watch('lib/**/*', ['insure', 'demo']);
});

gulp.task('insure', function() {
	return gulp
		.src('lib/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('build'))
		.pipe(gulp.dest('demo/node_modules/life-insurance/lib'));
});

gulp.task('demo', ['insure'], function(callback) {
	// modify some webpack config options
	var config = Object.create(webpackConfig);
	config.plugins = config.plugins.concat(
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
	);

	// run webpack
	webpack(config, function(err, stats) {
		if (err) throw new gutil.PluginError('webpack:build', err);
		// gutil.log('[webpack:build]', stats.toString({
		// 	colors: true
		// }));
		callback();
	});
});