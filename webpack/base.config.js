// Organised as described in https://simonsmith.io/organising-webpack-config-environments/
process.traceDeprecation = true;
const path = require("path");
const webpack = require("webpack");

// plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

module.exports = (env) => {
    const config = {
        entry: {
            "bundle": path.resolve(__dirname, "../src/patterns.js"),
            "bundle-polyfills": path.resolve(__dirname, "../src/polyfills.js"),
        },
        externals: [
            {
                window: "window",
            },
        ],
        output: {
            filename: "[name].js",
            chunkFilename: "chunks/[name].[contenthash].js",
            path: path.resolve(__dirname, "../dist/"),
            // publicPath set in bundle entry points via __webpack_public_path__
            // See: https://webpack.js.org/guides/public-path/
            // publicPath: "/dist/",
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    include: /(\.min\.js$)/,
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
                    loader: "babel-loader",
                },
                {
                    test: /\.html$/i,
                    use: "raw-loader",
                },
                {
                    test: require.resolve("jquery"),
                    use: [
                        {
                            loader: "expose-loader",
                            query: "$",
                        },
                        {
                            loader: "expose-loader",
                            query: "jQuery",
                        },
                    ],
                },
                {
                    test: /showdown-prettify/,
                    use: [
                        {
                            loader:
                                "imports-loader?showdown,google-code-prettify",
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
                },
            ],
        },
        resolve: {
            alias: {
                "moment": path.resolve(__dirname, "../node_modules/moment"),
                "moment-timezone": path.resolve(
                    __dirname,
                    "../node_modules/moment-timezone"
                ),
            },
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                jquery: "jquery",
            }),
            new DuplicatePackageCheckerPlugin({
                verbose: true,
                emitError: true,
            }),
        ],
    };
    if (env.NODE_ENV === "development") {
        // Set public path to override __webpack_public_path__
        // for webpack-dev-server
        config.output.publicPath = "/dist/";
    }
    return config;
};
