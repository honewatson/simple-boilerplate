var path = require('path');
var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');
var port = '3031';
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const sassLoaders = [
    'css-loader',
    'postcss-loader',
    'sass-loader?includePaths[]=' + path.resolve(__dirname, './src')
]

module.exports = {
    entry: [
        './src/index.js',
        './src/stylesheets/scss.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.webpack.min.js',
        publicPath: '/static/'
    },
    plugins: [
        new WebpackShellPlugin(
            {
                onBuildStart: [

                ],
                onBuildEnd: []
            }
        ),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin('main.css')
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            include: path.join(__dirname, 'src')
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
};