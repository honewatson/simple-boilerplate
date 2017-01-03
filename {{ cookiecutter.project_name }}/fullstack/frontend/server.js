var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  proxy: {
    '/api/**': {
      target: 'http://localhost:8181',
      secure: false,
      changeOrigin: true
    },
      '/static/**': {
      target: 'http://localhost:8181',
      secure: false,
      changeOrigin: true
    }
  }
}).listen(config.port, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:' + config.port + '/');
});