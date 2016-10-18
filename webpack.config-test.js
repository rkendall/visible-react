// Not currently used
// For using with mocha-webpack, which precompiles each test with Webpack
// before it's run; this enables support for radium-loader and css-loader
// but makes the tests run very slowly so not using it anymore

var nodeExternals = require('webpack-node-externals');

module.exports = {
	target: 'node',
	externals: [nodeExternals()],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader"
			}
		]
	}
};