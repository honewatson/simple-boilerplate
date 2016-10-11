var path = require('path');
var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');
var port = '3031';

module.exports = {
    devtool: 'eval',
    entry: './src/index.rolled.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.webpack.min.js',
        publicPath: '/static/'
    },
    plugins: [
        new WebpackShellPlugin(
            {
                onBuildStart: [
                    'rollup -c --environment INCLUDE_DEPS,BUILD:production'
                ],
                onBuildEnd: []
            }
        ),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: [],
            include: path.join(__dirname, 'src')
        }]
    },
    port: port
};