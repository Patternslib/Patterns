module.exports = function(grunt) {
    grunt.initConfig({
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
                // disputable
                //quotmark: "double",
                smarttabs: true,
                trailing: true,
                undef: true,
                unused: true,
                white: false,
                predef: [
                    "requirejs",
                    "require",
                    "define",
                    "module",
                    "Markdown",
                    "Modernizr",
                    "tinyMCE"
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.registerTask("test", ["jasmine", "jshint"]);
};

