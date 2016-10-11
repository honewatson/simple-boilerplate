var path = require('path');
var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');

const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const sassLoaders = [
    'css-loader',
    'postcss-loader',
    'sass-loader?includePaths[]=' + path.resolve(__dirname, './src')
]

var port = '3031';

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:' + port,
        'webpack/hot/only-dev-server',
        './src/index.js',
        './src/stylesheets/scss.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.webpack.js',
        publicPath: '/dist/'
    },
    plugins: [
        new WebpackShellPlugin(
            {
                onBuildStart: [
                    'rollup -c',
                    'node_modules/node-sass/bin/node-sass src/stylesheets/base.scss ./dist/main.css'
                ],
                onBuildEnd: []
            }
        ),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('main.css')
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: [path.join(__dirname, 'src')]
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.scss'],
        root: [path.join(__dirname, './src')]
    },
    port: port
}
;