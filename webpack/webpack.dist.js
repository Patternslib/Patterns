// Webpack configuration for the Patternslib bundle distribution.
process.traceDeprecation = true;
const path = require("path");
const patternslib_config = require("./webpack.config");

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

    //console.log(JSON.stringify(config, null, 4));

    return config;
};
