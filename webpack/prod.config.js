const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('webpack-uglify-js-plugin');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  entry: {
    "bundle": "./src/patterns.js",
    "bundle.min": "./src/patterns.js"
  },

  plugins: [
    new UglifyJsPlugin({
      cacheFolder: path.resolve(__dirname, '../cache/'),
      debug: true,
      include: /\.min\.js$/,
      minimize: true,
      sourceMap: true,
      output: {
        comments: false
      },
      compressor: {
        warnings: false
      }
    }),
  ],
});