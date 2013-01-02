module.exports = function(grunt) {
    grunt.initConfig({
        requirejs: {
            options: {
                baseUrl: "src",
                insertRequire: ["main"],
                mainConfigFile: "src/main.js",
                name: "main",
                optimize: "none"
            },
            build: {
                options: {
                    out: "bundles/patterns.js"
                }
            },
            standalone: {
                options: {
                    name: "../lib/almond",
                    include: "main",
                    wrap: true,
                    out: "bundles/patterns-standalone.js",
                    almond: true
                }
            }
        },
        jshint: {
            sources: [
                "Gruntfile.js",
                "src/*.js",
                "src/core/.js",
                "src/patterns/*.js"
            ],
            tests: {
                src: ["tests/*.js"],
                options: {
                    jquery: true,
                    predef: [
                        "define",
                        "module",
                        "describe",
                        "it",
                        "expect",
                        "spyOn",
                        "beforeEach",
                        "afterEach",
                        "requireDependencies",
                        "jasmine"
                    ]
                }
            },
            options: {
                indent: 4,
                eqeqeq: true,
                browser: true,
                devel: true,
                jquery: false,
                quotmark: "double",
                smarttabs: true,
                trailing: true,
                undef: true,
                unused: true,
                white: false,
                predef: [
                    "define",
                    "module"
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.registerTask("default", "jshint requirejs");
};

