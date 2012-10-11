describe("autosubmit-plugin", function() {
    var pattern;

    requireDependencies(["jqplugins/autosubmit"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("parse", function() {
        it("Shorthand notation", function() {
            var $trigger = $("<input data-pat-autosubmit='500'/>");
                options = pattern.parse($trigger);
            expect(options.delay).toBe("500");
        });

        it("Multiple options not accepted", function() {
            var $trigger = $("<input data-pat-autosubmit='500 && 400'/>");
                options = pattern.parse($trigger);
            expect(options.delay).toBe("500");
        });
    });

    describe("validateOptions", function() {
        it("Integer delay", function() {
            var options = pattern.validateOptions({delay: 500});
            expect(options.delay).toBe(500);
        });

        it("String integer delay", function() {
            var options = pattern.validateOptions({delay: "500"});
            expect(options.delay).toBe(500);
        });

        it("Delay keyword", function() {
            var options = pattern.validateOptions({delay: "delay"});
            expect(options.delay).toBe(400);
        });

        it("Delay set to true", function() {
            var options = pattern.validateOptions({delay: "true"});
            expect(options.delay).toBe(400);
        });

        it("Invalid syntax", function() {
            var options = pattern.validateOptions({delay: "invalid"});
            expect(options).toBeFalsy();
        });

        it("Bad type", function() {
            var options = pattern.validateOptions({delay: [500]});
            expect(options).toBeFalsy();
        });

        it("Negative delay", function() {
            var options = pattern.validateOptions({delay: -500});
            expect(options).toBeFalsy();
        });

    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
