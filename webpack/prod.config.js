const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: {
    "bundle": path.resolve(__dirname, "../src/patterns.js"),
    "bundle.min": path.resolve(__dirname, "../src/patterns.js"),
    "bundle-polyfills": path.resolve(__dirname, "../src/polyfills.js"),
    "bundle-polyfills.min": path.resolve(__dirname, "../src/polyfills.js"),
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
