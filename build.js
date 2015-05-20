({
    baseUrl: "src",
    out: "bundle.js",
    include: ["patterns"],
    mainConfigFile: 'main.js',
    wrap: {
        endFile: "src/wrap-end.js"
    },
    optimize: "none"
})
