describe("switch", function() {
    var pattern;

    requireDependencies(["patterns/switch"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("onClick", function() {
        it("Bad syntax", function() {
            $("#lab")
               .append("<button id='trigger' data-switch='#victim'>Click</button>");
            var trigger = document.getElementById("trigger");
            spyOn(pattern, "_update");
            pattern.onClick.bind(trigger)();
            expect(pattern._update).not.toHaveBeenCalledWith();
        });

        it("Shorthand notation", function() {
            $("#lab")
               .append("<button id='trigger' data-switch='#victim; hide; show'>Click</button>");
            var trigger = document.getElementById("trigger");
            spyOn(pattern, "_update");
            pattern.onClick.bind(trigger)();
            expect(pattern._update).toHaveBeenCalledWith("#victim", "hide", "show");
        });

        it("Multiple changes", function() {
            $("#lab")
               .append("<button id='trigger' data-switch='#victim; hide; show && #victim; hide; red'>Click</button>");
            var trigger = document.getElementById("trigger");
            spyOn(pattern, "_update");
            pattern.onClick.bind(trigger)();
            expect(pattern._update).toHaveBeenCalledWith("#victim", "hide", "show");
            expect(pattern._update).toHaveBeenCalledWith("#victim", "hide", "red");
        });
    });

    describe("_update", function() {
        it("No targets", function() {
            spyOn(jQuery.fn, "addClass");
            spyOn(jQuery.fn, "removeClass");
            pattern._update(".missing");
            expect(jQuery.fn.addClass).not.toHaveBeenCalled();
            expect(jQuery.fn.removeClass).not.toHaveBeenCalled();
        });

        it("Remove basic class", function() {
            $("#lab").html("<div class='on'/>");
            pattern._update("#lab div", "on");
            expect($("#lab div").hasClass("on")).toBe(false);
        });

        it("Remove uses whole words", function() {
            $("#lab").html("<div class='cheese-on-bread'/>");
            pattern._update("#lab div", "on");
            expect($("#lab div").attr("class")).toBe("cheese-on-bread");
        });

        it("Remove wildcard postfix class", function() {
            $("#lab").html("<div class='icon-small/>");
            pattern._update("#lab div", "icon-*");
            expect($("#lab div").attr("class")).toBeFalsy();
        });

        it("Remove wildcard infix class", function() {
            $("#lab").html("<div class='icon-small-alert'/>");
            pattern._update("#lab div", "icon-*-alert");
            expect($("#lab div").attr("class")).toBeFalsy();
        });

        it("Add class", function() {
            $("#lab").html("<div/>");
            pattern._update("#lab div", null, "icon-alert");
            expect($("#lab div").attr("class")).toBe("icon-alert");
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
