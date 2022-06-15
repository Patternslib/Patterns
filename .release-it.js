const config = require("@patternslib/dev/.release-it.js");

config.plugins["@release-it/conventional-changelog"].header =
    "# Changelog\n\nSee the [history](./docs/history/index.md) for older changelog entries.\n\n";

module.exports = config;
