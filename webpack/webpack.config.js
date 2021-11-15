process.traceDeprecation = true;
const path = require("path");
const webpack = require("webpack");
const webpack_helpers = require("./webpack-helpers");

// plugins
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const { DuplicatesPlugin } = require("inspectpack/plugin");

module.exports = (env, argv, config, babel_include = []) => {
    // Webpack config

    // Packages in node_modules to NOT exclude from babel processing.
    // We exclude everything under `node_modules` except packages listed in
    // babel_include, like any packages within `@patternslib`, any other
    // `pat-*` and other packges which need babel processing so that node can
    // make sense of it when compiling.
    babel_include = new Set(["patternslib", "pat-.*", ...babel_include]);
    let babel_exclude = "";
    for (const it of babel_include) {
        babel_exclude += `(?!(${it})/)`;
    }
    babel_exclude = `node_modules/${babel_exclude}.*`;

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
            clean: true, // Clean directory before compiling
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
                    exclude: new RegExp(babel_exclude),
                    loader: "babel-loader",
                },
                {
                    test: require.resolve("jquery"),
                    loader: "expose-loader",
                    options: {
                        exposes: [
                            // Webpack module federation does load multiple expose-loaders. Just override previous set values.
                            { globalName: "$", override: true },
                            { globalName: "jQuery", override: true },
                        ],
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
                    test: /\.*(?:html|xml|svg)$/i,
                    type: "asset/source",
                },
                {
                    test: /\.(eot|woff|woff2|ttf|png|jpe?g|gif)$/i,
                    type: "asset/resource",
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
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            }),
            //new DuplicatesPlugin({
            //    emitErrors: false,
            //    verbose: true,
            //    ignoredPackages: [/.css/],
            //}),
        ],
    };

    // Override base_config with entries from config.
    // Most useful the ``entry`` entry.
    config = Object.assign(base_config, config);

    if (process.env.NODE_ENV === "development") {
        // Add a dev server.
        config.devServer = {
            static: {
                directory: path.resolve(__dirname, "../"),
            },
            port: "3001",
            host: "0.0.0.0",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
        // Output public path for dev-server
        config.output.publicPath = "/dist/";
        // Don't minimize
        config.optimization.minimize = false;
        config.devtool = false;
        config.watchOptions = {
            ignored: ["node_modules/**", "docs/**"],
        };
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
