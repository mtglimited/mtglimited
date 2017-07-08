const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  // The entry file. All your app roots fromn here.
  entry: [
    'babel-polyfill',
    path.join(__dirname, 'app/index.jsx'),
  ],
  // Where you want the output to go
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].min.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
    }),

    // handles uglifying js
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
      },
      sourceMap: true,
    }),
    // creates a stats.json
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false,
    }),
    // plugin for passing in data to the js, like what NODE_ENV we are in.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                './node_modules',
                './node_modules/grommet/node_modules',
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', 'scss'],
    modules: [
      path.resolve(__dirname, 'app'),
      'node_modules',
    ],
  },
};
