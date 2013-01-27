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
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.registerTask("test", ["jasmine"]);
};

