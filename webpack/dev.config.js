const baseConfig = require('./base.config.js');
const merge = require('webpack-merge');


module.exports = env => {
    return merge(baseConfig(env), {
        mode: 'development',
        devServer: {
            inline: true,
            contentBase: './',
            port: '3001',
            host: '0.0.0.0'
        }
    });
};
