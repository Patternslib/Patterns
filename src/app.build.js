({
    logLevel: 1,
    baseUrl: ".",
    mainConfigFile: "main.js",
    out: "../bundles/patterns.js",
    optimize: "none",

    name: "main",
    paths: {
        jquery: "empty:",
        tinymce: "../lib/tiny_mce/tiny_mce_src"
    },
    insertRequire: ["main"]
})

// vim: sw:4 sts:4 expandtab
