describe("checklist-pattern", function() {
    var pattern;

    requireDependencies(["pat/checklist"], function(cls) {
        pattern = cls;
    });

    beforeEach(function() {
        $("<div/>", {id: "lab"}).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
    });

    describe("jQuery plugin usage", function() {
        
        describe("Initialise via jQuery", function() {
            it("Specify options via API", function() {
                $("#lab").html("<div></div>");
                $("#lab div").patternChecklist({select: ".one", deselect: ".two"});
                var $trigger = $("#lab div");
                expect($trigger.data("patternChecklist")).toEqual({select: ".one", deselect: ".two"});
            });

            it("Parse options from DOM", function() {
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
