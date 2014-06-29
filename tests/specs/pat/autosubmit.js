define(["pat-autosubmit"], function(pattern) {

    describe("autosubmit-plugin", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("parse", function() {
            it("Shorthand notation", function() {
                var $trigger = $("<input data-pat-autosubmit='500ms'/>"),
                    options = pattern.parser.parse($trigger);
                expect(options.delay).toBe(500);
            });
            it("defocus", function() {
                var $trigger = $("<input data-pat-autosubmit='defocus'/>"),
                    options = pattern.parser.parse($trigger);
                expect(options.delay).toBe("defocus");
            });
        });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
