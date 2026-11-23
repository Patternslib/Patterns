const path = require("path");
const config = require("@patternslib/dev/jest.config.js");

config.setupFilesAfterEnv.push(path.resolve(__dirname, "./src/setup-tests.js"));
config.moduleNameMapper["@patternslib/patternslib/(.*)"] =
    path.resolve(__dirname) + "/$1";

// These ship ESM and need to be transformed by babel-jest to CommonJS before
// - signal-polyfill
// - marked
config.transformIgnorePatterns = config.transformIgnorePatterns.map((pattern) =>
    pattern.replace("preact/|", "preact/|signal-polyfill/|marked/|"),
);

module.exports = config;
