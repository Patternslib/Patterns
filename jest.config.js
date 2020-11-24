module.exports = {
    roots: ["./src", "./webpack"],
    setupFilesAfterEnv: ["./src/setupTests.js"],
    watchPlugins: [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname",
    ],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
    },
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
    transformIgnorePatterns: [
        "/node_modules/(?!@fullcalendar/*).+\\.[t|j]sx?$",
    ],
};
