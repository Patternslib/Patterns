describe("switch-pattern", function() {
    var pattern;

    requireDependencies(["patterns/switch"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("_validateOptions", function() {
        it("Bad options", function() {
            var options = pattern._validateOptions([{}]);
            expect(options).toBeFalsy();
        });

        it("Mix valid and invalid options", function() {
            var options = pattern._validateOptions(
                [{selector: "#victim", add: "purple"}, {}]);
            expect(options.length).toBe(1);
            expect(options[0]).toEqual({selector: "#victim", add: "purple"});
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

        it("Keep other classes", function() {
            $("#lab").html("<div class='one two'/>");
            pattern._update("#lab div", "one");
            expect($("#lab div").attr("class")).toBe("two");
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

        it("Keep other classes when removing wildcards", function() {
            $("#lab").html("<div class='icon-alert foo'/>");
            pattern._update("#lab div", "icon-*");
            expect($("#lab div").attr("class")).toBe("foo");
        });

        it("Add class", function() {
            $("#lab").html("<div/>");
            pattern._update("#lab div", null, "icon-alert");
            expect($("#lab div").attr("class")).toBe("icon-alert");
        });
    });

    describe("jQuery plugin usage", function() {
        describe("Initialise via jQuery", function() {
            it("Specify defaults via API", function() {
                $("#lab").html("<button>Click me</button>");
                $("#lab button").patternSwitch({selector: "#victim", add: "pink"});
                var $trigger = $("#lab button");
                expect($trigger.data("patternSwitch")).toEqual([{selector: "#victim", remove: null, add: "pink"}]);
            });

            it("Invalid defaults via API", function() {
                $("#lab").html("<button>Click me</button>");
                $("#lab button").patternSwitch({selector: "#victim"});
                var $trigger = $("#lab button");
                expect($trigger.data("patternSwitch")).toBeFalsy();
            });

            it("Parse defaults from DOM", function() {
                $("#lab").html("<button data-pat-switch='#victim foo bar'>Click me</button>");
                $("#lab button").patternSwitch();
                var $trigger = $("#lab button");
                expect($trigger.data("patternSwitch")).toEqual([{selector: "#victim", remove:"foo", add: "bar"}]);
            });

            it("Setup click event handler", function() {
                // Note that this relies on jQuery implementation details to check
                // for registered event handlers.
                $("#lab").html("<button data-pat-switch='#victim foo'>Click me</button>");
                var $trigger = $("#lab button").patternSwitch(),
                     events = $._data($trigger[0]).events;
                expect(events.click).toBeDefined();
                expect(events.click[0].namespace).toBe("patternSwitch");
            });
        });

        it("Execute changes", function() {
            $("#lab")
                .append("<button data-pat-switch='#victim foo'>Click me</button>")
                .append("<div id='victim' class='foo'/>");
            var $trigger = $("#lab button").patternSwitch();
            $trigger.patternSwitch("execute");
            expect($("#victim").hasClass("foo")).toBeFalsy();

        });

        describe("Destroy all hooks", function() {
            it("Setup click event handler", function() {
                // Note that this relies on jQuery implementation details to check
                // for registered event handlers.
                $("#lab").html("<button data-pat-switch='#victim foo'>Click me</button>");
                var $trigger = $("#lab button").patternSwitch(),
                     events = $._data($trigger[0]).events;
                expect(events.click).toBeDefined();
                $trigger.patternSwitch("destroy");
                expect(events.click).not.toBeDefined();
                expect($trigger.data("patternSwitch")).toBeFalsy();
            });
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
