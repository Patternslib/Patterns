const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: {
    "bundle": "./src/patterns.js",
    "bundle.min": "./src/patterns.js"
  }
});
