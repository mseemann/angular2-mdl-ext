var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var util = require('./util');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
	devtool: 'source-map',

	output: {
		path: util.root('dist'),
		publicPath: '',
		filename: '[name].[hash].js',
		chunkFilename: '[id].[hash].chunk.js'
	},
	
	//
	// htmlLoader: {
	// 	minimize: false // workaround for ng2
	// },

	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				uglifyOptions: {
				  compress: true,
				  ecma: 5,
				  mangle: true
				}
			})
		]
	},

	plugins: [
		new CopyWebpackPlugin([{ from: util.root('src', 'e2e-app', '404.html') }], {copyUnmodified: true}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.LoaderOptionsPlugin({
			minimize: false,
			debug: false
		}),
		new ExtractTextPlugin('[name].[hash].css'),
		new webpack.DefinePlugin({
			'process.env': {
				'ENV': JSON.stringify(ENV)
			}
		})
	]
});
