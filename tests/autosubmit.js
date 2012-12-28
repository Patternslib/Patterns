describe("autosubmit-plugin", function() {
    var pattern;

    requireDependencies(["patterns/autosubmit"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("parse", function() {
        it("Shorthand notation", function() {
            var $trigger = $("<input data-pat-autosubmit='500'/>");
                options = pattern.parser.parse($trigger);
            expect(options.delay).toBe(500);
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
