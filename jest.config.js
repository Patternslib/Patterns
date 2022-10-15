const path = require("path");
const config = require("@patternslib/dev/jest.config.js");

config.setupFilesAfterEnv.push(path.resolve(__dirname, "./src/setup-tests.js"));
config.moduleNameMapper["@patternslib/patternslib/(.*)"] =
    path.resolve(__dirname) + "/$1";

module.exports = config;
