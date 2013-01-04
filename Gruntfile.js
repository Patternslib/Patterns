module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            build: [
                "bundles/patterns*.js",
                "bundles/patterns*.map"
            ],
            test: [
                "_SpecRunner.html"
            ]
        },

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

        jasmine: {
            src: [],
            options: {
                template: "tests/runner.tmpl",
                vendor: [
                    "lib/requireHelper.js"
                ],
                specs: [
                    "tests/*.js"
                ]
            }
        },

        uglify: {
            build: {
                files: {
                    "bundles/patterns.min.js": ["bundles/patterns.js"]
                },
                options: {
                    preserveComments: false,
                    sourceMap: "bundles/patterns.min.map",
                    sourceMapRoot: "http://patterslib.com"
                }
            },
            standalone: {
                files: {
                    "bundles/patterns-standalone.min.js": ["bundles/patterns-standalone.js"]
                },
                options: {
                    preserveComments: false,
                    sourceMap: "bundles/patterns-standalone.min.map",
                    sourceMapRoot: "http://patterslib.com"
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

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("test", ["jasmine"]);  // No jshint for now
    grunt.registerTask("default", "jasmine jshint clean requirejs uglify");
};

