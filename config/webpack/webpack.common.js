var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var util = require('./util');

console.log(util.root('node_modules/angular2-mdl/src/scss-mdl'));
module.exports = {
	entry: {
		'polyfills': './src/e2e-app/polyfills.ts',
		'vendor': './src/e2e-app/vendor.ts',
		'app': './src/e2e-app/main.ts'
	},

	resolve: {
		extensions: ['', '.js', '.ts']
	},

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loaders: ['awesome-typescript-loader?tsconfig=./src/e2e-app/tsconfig.json', 'angular2-template-loader']
			},
			{
				test: /\.html$/,
				loader: 'html'
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'file?name=assets/[name].[hash].[ext]'
			},
			{
				test: /\.css$/,
				exclude: util.root('src/e2e-app', 'app'),
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
			},
			{
				test: /\.css$/,
				include: util.root('src/e2e-app', 'app'),
				loaders: ['raw-loader']
			},
			{
				test: /\.scss$/,
				exclude: util.root('src/e2e-app', 'app'),
				loaders: [ExtractTextPlugin.extract('style', 'css?sourceMap'), 'css-loader', 'sass-loader']
			},
			{
				test: /\.scss$/,
				include: util.root('src/e2e-app', 'app'),
				loaders: ['raw-loader', 'sass-loader']
			},
			{
				test: /\.hbs$/,
				loader: 'handlebars'
			}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: ['app', 'vendor', 'polyfills']
		}),

		new HtmlWebpackPlugin({
			template: '!!handlebars!src/e2e-app/index.hbs',
			baseUrl: process.env.NODE_ENV == 'production' ? '/angular2-mdl-ext/' : '/'
		})
	],

	sassLoader: {
		includePaths: [util.root('node_modules/angular2-mdl/src/scss-mdl')]
	}
};
