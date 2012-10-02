describe("checklist-plugin", function() {
    var pattern;

    requireDependencies(["jquery/checklist"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("parse", function() {
        it("Shorthand notation", function() {
            var $trigger = $("<input data-checklist='.select; .deselect'/>");
                options = pattern.parse($trigger);
            expect(options.select).toBe(".select");
            expect(options.deselect).toBe(".deselect");
        });

        it("Multiple options not accepted", function() {
            var $trigger = $("<input data-checklist='.select1 && .select2'/>");
                options = pattern.parse($trigger);
            expect(options.select).toBe(".select1");
        });
    });

    describe("Initialise via jQuery", function() {
        it("Specify options via API", function() {
            $("#lab").html("<div></div>");
            $("#lab div").patternChecklist({select: ".one", deselect: ".two"});
            var $trigger = $("#lab div");
            expect($trigger.data("patternChecklist")).toEqual({select: ".one", deselect: ".two"});
        });

        it("Parse options from DOM", function() {
            $("#lab").html("<div data-checklist='.one; .two'></div>");
            $("#lab div").patternChecklist();
            var $trigger = $("#lab div");
            expect($trigger.data("patternChecklist")).toEqual({select: ".one", deselect: ".two"});
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
