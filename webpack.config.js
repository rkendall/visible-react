var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		'bundle': path.join(__dirname, 'src/index'),
		'demo-bundle': path.join(__dirname, 'src/demo/index'),
		'small-demo-bundle': path.join(__dirname, 'src/small-demo')
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
				include: path.join(__dirname, 'src'),
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
	// 		template: __dirname + '/src/index.html',
	// 		filename: 'index.html',
	// 		inject: 'body'
	// 	}),
	// 	new HtmlWebpackPlugin({
	// 		template: __dirname + '/src/small-demo.html',
	// 		filename: 'small-demo.html',
	// 		inject: 'body'
	// 	})
	// ]
};
