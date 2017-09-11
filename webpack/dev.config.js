const merge = require('webpack-merge');
var baseConfig = require('./base.config.js');
var JasmineWebpackPlugin = require('jasmine-webpack-plugin');


module.exports = merge(baseConfig, {
	devtool: "source-map",
        node: {
            // https://github.com/webpack-contrib/css-loader/issues/447
            fs: 'empty'
        },
    devServer: {
    	inline: true,
        contentBase: './',
        port: '3001'
    },
	plugins: [
        new JasmineWebpackPlugin(),
    ],
});
