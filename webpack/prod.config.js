const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: {
    "bundle": "./src/patterns.js",
    "bundle.min": "./src/patterns.js"
  },

  plugins: [
    new UglifyJsPlugin({
      cache: path.resolve(__dirname, '../cache/'),
      include: /\.min\.js$/,
      sourceMap: true,
      extractComments: false
    }),
  ],
});
