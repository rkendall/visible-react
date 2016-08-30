var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		'bundle': path.join(__dirname, 'lib/index'),
		'demo-bundle': path.join(__dirname, 'lib/demo/index'),
		'small-demo-bundle': path.join(__dirname, 'lib/small-demo')
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: path.join(__dirname, 'lib'),
				query: {
					presets: [
						'es2015',
						'stage-0',
						'react'
					]
				}
			}
		]
	}
	// plugins: [
	// 	new HtmlWebpackPlugin({
	// 		template: __dirname + '/lib/index.html',
	// 		filename: 'index.html',
	// 		inject: 'body'
	// 	}),
	// 	new HtmlWebpackPlugin({
	// 		template: __dirname + '/lib/small-demo.html',
	// 		filename: 'small-demo.html',
	// 		inject: 'body'
	// 	})
	// ]
};
