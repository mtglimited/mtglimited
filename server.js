var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  https: false,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  }
}).listen(3010, 'localhost', function(err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at http://localhost:3010');
});
