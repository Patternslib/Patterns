module.exports = {
    roots: ["./src", "./webpack"],
    setupFilesAfterEnv: ["./src/setupTests.js"],
    watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
        "\\.(html|xml|svg)$": "<rootDir>/webpack/jest-raw-loader.js",
    },
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
    testEnvironment: "jsdom",
    transformIgnorePatterns: ["/node_modules/(?!preact/)(?!screenfull/).+\\.[t|j]sx?$"],
};
