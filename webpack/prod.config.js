const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const path = require('path');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: {
    "bundle": path.resolve(__dirname, "../src/patterns.js"),
    "bundle.min": path.resolve(__dirname, "../src/patterns.js"),
    "bundle-polyfills": path.resolve(__dirname, "../src/polyfills.js"),
    "bundle-polyfills.min": path.resolve(__dirname, "../src/polyfills.js"),
  }
});
