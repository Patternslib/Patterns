// Webpack configuration for the Patternslib bundle distribution.
process.traceDeprecation = true;
const CopyPlugin = require("copy-webpack-plugin");
const mf_config = require("@patternslib/dev/webpack/webpack.mf");
const package_json = require("../package.json");
const path = require("path");
const webpack_config = require("@patternslib/dev/webpack/webpack.config").config;
const modernizr_config = require("../.modernizrrc.js");
const modernizr = require("modernizr");

module.exports = () => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "../src/index.js"),
        },
    };

    config = webpack_config({
        config: config,
        package_json: package_json,
    });

    config.output.path = path.resolve(__dirname, "../dist/");

    // Module federation
    config.plugins.push(
        mf_config({
            name: "patternslib",
            remote_entry: config.entry["bundle.min"],
            dependencies: package_json.dependencies,
            shared: {
                "jquery": {
                    singleton: true,
                    requiredVersion: package_json.dependencies["jquery"],
                    eager: true,
                },
                "highlight.js": {
                    singleton: true,
                    version: package_json.dependencies["highlight.js"],
                },
            },
        })
    );

    // Copy static files
    config.plugins.push(
        new CopyPlugin({
            patterns: [
                // Copy polyfills loader to the output path.
                // TODO: Polyfills not used anymore, remove for next major version.
                { from: path.resolve(__dirname, "../src/polyfills-loader.js") },

                // Build and copy Modernizr.
                // We're abusing the CopyPlugin transform method here to build
                // a Modernizr bundle using the modernizr config. The input
                // file does not matter and could be anything - we're using the
                // modernizr config itself.
                // Why building modernizr here and not in the Makefile?
                // Because we want webpack-dev-server also to serve it.
                {
                    from: path.resolve(__dirname, "../.modernizrrc.js"),
                    to: "[path]modernizr.min.js",
                    transform: {
                        transformer: () => {
                            return new Promise((resolve) => {
                                modernizr.build(
                                    {
                                        ...modernizr_config,
                                        minify: process.env.NODE_ENV === "production",
                                    },
                                    (result) => {
                                        resolve(result);
                                    }
                                );
                            });
                        },
                        cache: true,
                    },
                },
            ],
        })
    );

    if (process.env.NODE_ENV === "development") {
        config.devServer.static.directory = path.resolve(__dirname, "../");
        config.devServer.watchFiles = ["src/"];
        // Add a strict Content-Security-Policy without 'unsafe-inline' to the dev
        // server for testing CSR issues.
        //config.devServer.headers["Content-Security-Policy"] =
        //    "default-src https: http: data: 'self';";
    }

    // Add an @patternslib/patternslib alias when building within this repository.
    // That way, add-on packages referring to @patternslib/patternslib do work.
    if (process.env.BUILD_ENV === "patternslib") {
        config.resolve.alias["@patternslib/patternslib"] = path.resolve(
            __dirname,
            "../"
        );
    }

    //console.log(JSON.stringify(config, null, 4));

    return config;
};
