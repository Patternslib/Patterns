define(["pat-checklist"], function() {

    describe("pat-checklist", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("Initialization via jQuery", function() {
            it("can be configured by passing in arguments to the jQuery plugin method", function () {
                $("#lab").html("<div></div>");
                $("#lab div").patternChecklist({select: ".one", deselect: ".two"});
                var $trigger = $("#lab div");
                expect($trigger.data("patternChecklist")).toEqual({select: ".one", deselect: ".two"});
            });

            it("can be configured via DOM element data- attributes", function() {
                $("#lab").html("<div data-pat-checklist='.one .two'></div>");
                $("#lab div").patternChecklist();
                var $trigger = $("#lab div");
                expect($trigger.data("patternChecklist")).toEqual({select: ".one", deselect: ".two"});
            });
        });
    });
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
