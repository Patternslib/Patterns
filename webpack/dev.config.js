const baseConfig = require('./base.config.js');
const BundleVisualizer = require('webpack-visualizer-plugin');
const merge = require('webpack-merge');


module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
    	inline: true,
        contentBase: './',
        port: '3001',
        host: '0.0.0.0'
    },
    plugins: [
        new BundleVisualizer(),
    ]
});
