var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var util = require('./util');
var path = require('path');

const CSS_LOADERS = [
    'raw-loader',
    {
        loader: 'postcss-loader',
        options: {
            sourceMap: true,
            config: {
                path: path.resolve(__dirname, './postcss.config.js'),
            },
        },
    },
    'sass-loader'
];

module.exports = {
	entry: {
		'polyfills': './src/e2e-app/polyfills.ts',
		'vendor': './src/e2e-app/vendor.ts',
		'app': './src/e2e-app/main.ts'
	},

	resolve: {
		extensions: ['.js', '.ts'],
		mainFields: ["module", "main", "browser"]
	},

	// avoid errors like Error: Can't resolve 'net' in '...angular2-mdl-ext/node_modules/debug'
	node: {
		fs: 'empty',
		net: 'empty'
	},

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /.ts$/,
				loader: 'string-replace-loader',
				options: {
					search: 'moduleId: module.id,',
					replace: '',
					flags: 'g'
				}
			},
			{
				test: /\.ts$/,
				exclude: [
					/\.(spec)\.ts$/
				],
				use: [
					{
						loader: 'awesome-typescript-loader',
						options: {
							configFileName: './src/e2e-app/tsconfig.json'
						}
					},
					{
						loader: 'angular2-template-loader'
					}
				]
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'file-loader',
				options: {
					name: 'assets/[name].[hash].[ext]'
				}
			},
			{
				test: /\.scss$/,
				exclude: [util.root('src', 'e2e-app', 'app'), util.root('src', 'components')],
				use: ExtractTextPlugin.extract({
					use: CSS_LOADERS,
					// use style-loader in development
					fallback: "style-loader"
				})
			},
			{
				test: /\.scss$/,
				include: [util.root('src', 'e2e-app', 'app'), util.root('src', 'components')],
				loaders: CSS_LOADERS
			},
			{
				test: /\.hbs$/,
				loader: 'handlebars-loader'
			}
		]
	},
    optimization: {
		splitChunks: {
			// ['app', 'vendor', 'polyfills']
		}
	},
	plugins: [
		// avoid: WARNING in ./~/@angular/core/@angular/core.es5.js
		// 3702:272-293 Critical dependency: the request of a dependency is an expression
		new webpack.ContextReplacementPlugin(
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			/@angular(\\|\/)core(\\|\/)fesm5/,
			util.root('src') // location of your src
		),
		new HtmlWebpackPlugin({
			template: '!!handlebars-loader!src/e2e-app/index.hbs',
			baseUrl: process.env.NODE_ENV == 'production' ? '/angular2-mdl-ext/' : '/',
			production: process.env.NODE_ENV == 'production' ? true : false
		})
	]
};
