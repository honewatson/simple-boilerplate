var path = require('path');
var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');


var port = '3031';

module.exports = {
    context: __dirname,
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:' + port,
        'webpack/hot/only-dev-server',
        './src/index.js',
        //'./src/stylesheets/base.scss'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.webpack.js',
        publicPath: '/static/'
    },
    plugins: [
        new WebpackShellPlugin(
            {
                onBuildStart:[
                    'rollup -c',
                    'node_modules/node-sass/bin/node-sass src/stylesheets/base.scss dist/main.css'
                ],
                onBuildEnd:[]
            }
        ),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            include: [path.join(__dirname, 'src')]
        }]
    },
    port: port
};