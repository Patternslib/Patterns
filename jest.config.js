const path = require("path");
const config = require("@patternslib/dev/jest.config.js");

config.setupFilesAfterEnv.push(path.resolve(__dirname, "./src/setup-tests.js"));
config.moduleNameMapper["@patternslib/patternslib/(.*)"] =
    path.resolve(__dirname) + "/$1";

// The official signal polyfill ships ESM and needs Babel in Jest.
config.transformIgnorePatterns = config.transformIgnorePatterns.map((pattern) =>
    pattern.replace("preact/|", "preact/|signal-polyfill/|")
);

module.exports = config;
