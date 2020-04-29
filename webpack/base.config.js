// Organised as described in https://simonsmith.io/organising-webpack-config-environments/
process.traceDeprecation = true;
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');


module.exports = {
    entry: {
        "bundle": "./src/patterns.js",
    },
    externals: [{
        "window": "window"
    }],
    output: {
        filename: "[name].js",
        chunkFilename: 'chunks/[name].[contenthash].js',
        publicPath: '/',
        path: path.resolve(__dirname, '../'),
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'initial',
                    filename: 'bundle-[name].js',
                }
            }
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /(\.min\.js$|bundle-vendors.js$)/,
                extractComments: false,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.html$/i,
                use: 'raw-loader',
            },
            {
                test: require.resolve('jquery'),
                use: [{
                        loader: 'expose-loader',
                        query: '$'
                    },
                    {
                        loader: 'expose-loader',
                        query: 'jQuery'
                    }
                ]
            },
            {
                test: /showdown-prettify/,
                use: [
                    {
                      loader: 'imports-loader?showdown,google-code-prettify',
                    }
                ]
            },
	        {
		        test: /\.css$/,
		        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
	        },
        ]
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery"
        })
    ]
};
