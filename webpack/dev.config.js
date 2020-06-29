const merge = require('webpack-merge');
var baseConfig = require('./base.config.js');


module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
    	inline: true,
        contentBase: './',
        port: '3001',
        host: '0.0.0.0'
    }
});
