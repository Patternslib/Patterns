describe("toggle", function() {
    var pattern;

    requireDependencies(["patterns/toggle"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("onClick", function() {
        it("Bad syntax", function() {
            $("#lab").html("<button id='trigger' data-pat-toggle='#victim'>Click</button>");
            var trigger = document.getElementById("trigger"),
                event = jasmine.createSpyObj("event", ["preventDefault"]);
            spyOn(pattern, "_update");
            pattern.onClick.bind(trigger)(event);
            expect(pattern._update).not.toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it("Shorthand notation", function() {
            $("#lab").html("<button id='trigger' data-pat-toggle='#victim;;on'>Click</button>");
            var trigger = document.getElementById("trigger"),
                event = jasmine.createSpyObj("event", ["preventDefault"]);
            spyOn(pattern, "_update");
            pattern.onClick.bind(trigger)(event);
            expect(pattern._update).toHaveBeenCalledWith("#victim", "class", "on");
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it("Multiple changes", function() {
            $("#lab").html("<button id='trigger' data-pat-toggle='#victim;;on && #victim;;enabled'>Click</button>");
            var trigger = document.getElementById("trigger"),
                event = jasmine.createSpyObj("event", ["preventDefault"]);
            spyOn(pattern, "_update");
            pattern.onClick.bind(trigger)(event);
            expect(pattern._update).toHaveBeenCalledWith("#victim", "class", "on");
            expect(pattern._update).toHaveBeenCalledWith("#victim", "class", "enabled");
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe("_update", function() {
        it("No targets", function() {
            spyOn(jQuery.fn, "toggleClass");
            spyOn(jQuery.fn, "removeAttr");
            spyOn(jQuery.fn, "attr");
            pattern._update(".missing");
            expect(jQuery.fn.toggleClass).not.toHaveBeenCalled();
            expect(jQuery.fn.removeAttr).not.toHaveBeenCalled();
            expect(jQuery.fn.attr).not.toHaveBeenCalled();
        });

        it("Toggle class", function() {
            $("#lab").html("<div id='victim' class='always'/>");
            pattern._update("#victim", "class", "check on");
            expect($("#victim").hasClass("on")).toBe(true);
            expect($("#victim").hasClass("always")).toBe(true);
            pattern._update("#victim", "class", "on");
            expect($("#victim").hasClass("on")).toBe(false);
            expect($("#victim").hasClass("always")).toBe(true);
        });

        it("Toggle attribute", function() {
            $("#lab").html("<input type='checkbox' id='victim'/>");
            pattern._update("#victim", "checked", "checked");
            expect(document.getElementById('victim').checked).toBe(true);
            pattern._update("#victim", "checked", "checked");
            expect(document.getElementById('victim').checked).toBe(false);
        });

        it("Multiple targets", function() {
            $("#lab")
                .append("<div id='one' class='victim'/>")
                .append("<div id='two' class='victim'/>");
            pattern._update(".victim", "class", "on");
            expect($("#one").hasClass("on")).toBe(true);
            expect($("#two").hasClass("on")).toBe(true);
        });

    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
