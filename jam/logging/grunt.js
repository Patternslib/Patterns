module.exports = function(grunt) {
    grunt.initConfig({
        lint: {
            all: ["grunt.js", "src/*.js"]
        },
        jshint: {
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
        },
        jasmine: {
            src: "src/*.js",
            specs: "tests/*.js"
        }
    });

    grunt.loadNpmTasks("grunt-jasmine-runner");
    grunt.registerTask("default", "lint jasmine");
};
