module.exports = (env) => {
    let config = {
        presets: [
            [
                "@babel/preset-env",
                {
                    useBuiltIns: "entry",
                    corejs: 3,
                },
            ],
        ],
        plugins: ["@babel/plugin-proposal-optional-chaining"],
    };

    // passed via NODE_ENV=development environment variable.
    if (env.env() === "development") {
        // For development, do less transformations for better readability.
        config = {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        modules: false,
                        debug: true,
                        useBuiltIns: false,
                        targets: "last 1 Chrome version, last 1 Firefox version",
                    },
                ],
            ],
            plugins: ["@babel/plugin-proposal-optional-chaining"],
        };
    }

    return config;
};
