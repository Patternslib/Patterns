// Organised as described in https://simonsmith.io/organising-webpack-config-environments/
process.traceDeprecation = true;
const path = require('path');
const webpack = require('webpack');

// plugins
const BundleVisualizer = require('webpack-visualizer-plugin');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = env => {

    console.log(env.NODE_ENV);

    return {
        entry: {
            "bundle": path.resolve(__dirname, "../src/patterns.js"),
            "bundle-polyfills": path.resolve(__dirname, "../src/polyfills.js"),
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
        resolve: {
            alias: {
                'moment': path.resolve(__dirname, '../node_modules/moment'),
                'moment-timezone': path.resolve(__dirname, '../node_modules/moment-timezone'),
            }
        },
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                jquery: "jquery"
            }),
            new BundleVisualizer(),
        ]
    };
};
