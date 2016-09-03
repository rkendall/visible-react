var path = require('path');
var webpack = require('webpack');

module.exports =
{
	name: 'demo',
	entry: path.join(__dirname, 'demo/lib/index'),
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
					path.join(__dirname, 'demo/lib'),
					path.join(__dirname, 'dist')
				],
				query: {
					presets: [
						'es2015',
						'stage-0',
						'react'
					]
				}
			}
		]
	},
	plugins: []
};


