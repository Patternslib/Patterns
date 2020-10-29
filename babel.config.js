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
                        targets: {
                            chrome: "80",
                            firefox: "80",
                        },
                    },
                ],
            ],
            plugins: ["@babel/plugin-proposal-optional-chaining"],
        };
    }

    return config;
};
