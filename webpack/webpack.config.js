// Webpack configuration for the Patternslib bundle distribution.
process.traceDeprecation = true;
const CopyPlugin = require("copy-webpack-plugin");
const mf_config = require("@patternslib/dev/webpack/webpack.mf");
const package_json = require("../package.json");
const path = require("path");
const patternslib_config = require("@patternslib/dev/webpack/webpack.config");

module.exports = (env, argv) => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "../src/index.js"),
            "bundle-polyfills.min": path.resolve(__dirname, "../src/polyfills.js"),
        },
    };

    config = patternslib_config(env, argv, config);

    config.output.path = path.resolve(__dirname, "../dist/");

    // Modernizr
    config.module.rules.push({
        test: /\.modernizrrc\.js$/,
        loader: "webpack-modernizr-loader",
    });
    config.resolve.alias = {
        modernizr$: path.resolve(__dirname, "../.modernizrrc.js"),
    };

    config.plugins.push(
        mf_config({
            name: "patternslib",
            package_json: package_json,
            remote_entry: config.entry["bundle.min"],
        })
    );

    // Polyfills
    config.plugins.push(
        // Copy polyfills loader to the output path.
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "../src/polyfills-loader.js"), }, // prettier-ignore
            ],
        })
    );

    if (process.env.NODE_ENV === "development") {
        config.devServer.static.directory = path.resolve(__dirname, "../");
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
    //
    return config;
};
