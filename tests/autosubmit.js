describe("autosubmit-plugin", function() {
    var pattern;

    requireDependencies(["patterns/autosubmit"], function(cls) {
        pattern = cls;
    });

    beforeEach(function() {
        $("<div/>", {id: "lab"}).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
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
