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
                template: "requirejs",
                templateOptions: {
                    requireConfig: {
                        baseUrl: "src/",
                        paths: {
                            URIjs: "3rdparty/URIjs/src",
                            jquery: "3rdparty/jquery-1.8.2",
                            jquery_anythingslider: "3rdparty/jquery.anythingslider",
                            jquery_autosuggest: "3rdparty/jquery.autoSuggest",
                            jquery_chosen: "3rdparty/chosen.jquery",
                            jquery_ext: "jquery-ext",
                            jquery_form: "lib/jquery.form/jquery.form",
                            jquery_fullcalendar: "3rdparty/fullcalendar/fullcalendar",
                            jquery_placeholder: "3rdparty/jquery.placeholder",
                            jquery_textchange: "3rdparty/jquery.textchange/jquery.textchange",
                            jquery_validate: "3rdparty/jquery-validation/jquery.validate",
                            jquery_validate_additional_methods: "3rdparty/jquery-validation/additional-methods",
                            logging: "3rdparty/logging/src/logging",
                            less: "3rdparty/less-1.3.1",
                            modernizr: "3rdparty/modernizr-2.0.6",
                            prefixfree: "3rdparty/prefixfree",
                            tinymce: "3rdparty/tiny_mce/tiny_mce_src"
                        },
                        shim: {
                            jquery_anythingslider: {
                                deps: ["jquery"]
                            },
                            jquery_autosuggest: {
                                deps: ["jquery"]
                            },
                            jquery_chosen: {
                                deps: ["jquery"]
                            },
                            jquery_form: {
                                deps: ["jquery"]
                            },
                            jquery_fullcalendar: {
                                deps: ["jquery"]
                            },
                            jquery_placeholder: {
                                deps: ["jquery"]
                            },
                            jquery_textchange: {
                                deps: ["jquery"]
                            },
                            jquery_validate: {
                                deps: ["jquery"]
                            },
                            jquery_validate_additional_methods: {
                                deps: ["jquery_validate"]
                            }
                        }
                    }
                },
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

