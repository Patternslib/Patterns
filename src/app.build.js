({
    logLevel: 1,
    baseUrl: ".",
    mainConfigFile: "main.js",
    out: "../build/patterns.min.js",
//    optimize: "none",
    paths: {
        "jquery": "3rdparty/require-jquery",
        "modernizr": "3rdparty/modernizr-2.0.6",
        "jquery.fancybox": "3rdparty/jquery.fancybox-1.3.4",
        "jquery.tools": "3rdparty/jquery.tools.min"
    },

    name: "main",
    exclude: ["jquery"]
})

// vim: sw:4 sts:4 expandtab
