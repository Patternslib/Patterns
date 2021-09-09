process.traceDeprecation = true;
const path = require("path");
const webpack = require("webpack");
const webpack_helpers = require("./webpack-helpers");

// plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv, config) => {
    const base_config = {
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
                    // Exclude node modules except patternslib, pat-* and mockup packgages.
                    // Allows for extending this file without needing to override for a successful webpack build.
                    exclude:
                        /node_modules\/(?!(.*patternslib)\/)(?!(pat-.*)\/)(?!(mockup)\/).*/,
                    loader: "babel-loader",
                },
                {
                    test: /\.*(?:html|xml)$/i,
                    use: "raw-loader",
                },
                {
                    test: require.resolve("jquery"),
                    loader: "expose-loader",
                    options: {
                        exposes: ["$", "jQuery"],
                    },
                },
                {
                    test: /showdown-prettify/,
                    use: [
                        {
                            loader: "imports-loader?showdown,google-code-prettify",
                        },
                    ],
                },
                {
                    test: /\.(?:sass|scss|css)$/i,
                    use: [
                        {
                            loader: "style-loader",
                            options: {
                                insert: webpack_helpers.top_head_insert,
                            },
                        },
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(eot|woff|woff2|ttf|png|jpe?g|gif)$/i,
                    use: "file-loader",
                },
                {
                    test: /\.svg$/,
                    loader: "svg-inline-loader",
                },
                {
                    test: /\.modernizrrc\.js$/,
                    loader: "webpack-modernizr-loader",
                },
            ],
        },
        resolve: {
            alias: {
                modernizr$: path.resolve(__dirname, "../.modernizrrc.js"),
            },
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: path.resolve(__dirname, "../src/polyfills-loader.js"), }, // prettier-ignore
                ],
            }),
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

    // Override base_config with entries from config.
    // Most useful the ``entry`` entry.
    config = Object.assign(base_config, config);

    if (process.env.NODE_ENV === "development") {
        // Add a dev server.
        config.devServer = {
            inline: true,
            contentBase: "./",
            port: "3001",
            host: "0.0.0.0",
        };
        // Output public path for dev-server
        config.output.publicPath = "/dist/";
        // Don't minimize
        config.optimization.minimize = false;
        config.devtool = false;
    }
    if (process.env.NODE_ENV === "production") {
        // Also create minified bundles along with the non-minified ones.
        for (const bundle of Object.keys(config.entry)) {
            config.entry[`${bundle}.min`] = config.entry[bundle];
        }
        config.output.chunkFilename = "chunks/[name].[contenthash].min.js";
    }
    return config;
};
