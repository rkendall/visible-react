var path = require('path');
var webpack = require('webpack');

module.exports = [
	// {
	// 	name: 'main',
	// 	entry: path.join(__dirname, 'lib/components/Insure.js'),
	// 	output: {
	// 		path: path.join(__dirname, 'dist'),
	// 		filename: 'index.js'
	// 	},
	// 	module: {
	// 		loaders: [
	// 			{
	// 				test: /\.js$/,
	// 				loader: 'babel-loader',
	// 				include: path.join(__dirname, 'lib'),
	// 				query: {
	// 					presets: [
	// 						'es2015',
	// 						'stage-0',
	// 						'react'
	// 					]
	// 				}
	// 			}
	// 		]
	// 	}
	// },
	{
		name: 'console',
		entry: path.join(__dirname, 'lib/console/index.js'),
		output: {
			path: path.join(__dirname, 'dist'),
			filename: 'console.js'
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					include: [
						path.join(__dirname, 'lib/console'),
						path.join(__dirname, 'lib/insure/shared')
					],
					query: {
						presets: [
							'es2015',
							'stage-0',
							'react'
						]
					}
				},
				{
					test: /\.css$/,
					loader: "style-loader!css-loader"
				}
			]
		}
	},
	{
		name: 'demo',
		entry: path.join(__dirname, 'demo/lib/index'),
		output: {
			path: path.join(__dirname, 'demo/dist'),
			filename: 'index.js'
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					include: path.join(__dirname, 'demo/lib'),
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
	}
];


