({
    baseUrl: "src",
    out: "bundle.js",
    include: ["patterns"],
    name: "almond",
    mainConfigFile: 'main.js',
    wrap: {
        endFile: "src/wrap-end.js"
    },
    optimize: "none",
    paths: {
        "almond":                      "bower_components/almond/almond"
    }
})
