var path = require('path');
var gulp = require('gulp');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var webpack = require('webpack');

gulp.task('default', [
	'insure',
	'demo'
], function() {
	gulp.watch('src/**/*', ['insure', 'demo']);
});

gulp.task('insure', function() {
	return gulp
		.src('src/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('lib'))
		.pipe(gulp.dest('demo/node_modules/life-insurance/lib'));
});

gulp.task('demo', ['insure'], function(callback) {
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

		],
		// To avoid duplicate copies of React being loaded
		resolve: {
			alias: {
				react: path.resolve('./demo/node_modules/react')
			}
		}
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