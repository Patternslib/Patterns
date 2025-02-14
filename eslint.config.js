const config_eslint = require("@patternslib/dev/eslint.config.js");

module.exports = [
    ...config_eslint,
    {
        ignores: [
            // Ignore auto-generated depends_parse.js file.
            "src/lib/depends_parse.js",
        ],
    },
]
