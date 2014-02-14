define(["pat-depends"], function(pattern) {

    describe("depends-pattern", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Hide if condition is not met initially", function() {
                $("#lab").html([
                    "<input type=\"checkbox\" id=\"control\" value=\"yes\"/>",
                    "<div id=\"slave\" class=\"pat-depends\"/>"
                    ].join("\n"));
                var $slave = $("#slave");
                pattern.init($slave, {condition: "control"});
                expect($slave.css("display")).toBe("none");
            });

            it("Show if condition is not met initially", function() {
                $("#lab").html([
                    "<input type=\"checkbox\" id=\"control\" value=\"yes\" checked=\"checked\"/>",
                    "<div id=\"slave\" class=\"pat-depends\" style=\"display: none\"/>"
                    ].join("\n"));
                var $slave = $("#slave");
                pattern.init($slave, {condition: "control"});
                expect($slave.css("display")).not.toBe("none");
            });
        });

        describe("_disable", function() {
            it("Input element", function() {
                $("#lab").append("<button type=\"button\">Click me</button>");
                var $slave = $("#lab button");
                pattern._disable($slave);
                expect($slave[0].disabled).toBeTruthy();
                expect($slave.hasClass("disabled")).toBe(true);
            });

            it("Anchor", function() {
                $("#lab").append("<a href=\"#target\">Click me</a>");
                var $slave = $("#lab a");
                pattern._disable($slave);
                var events = $._data($slave[0]).events;
                expect($slave.hasClass("disabled")).toBe(true);
                expect(events.click).toBeDefined();
                expect(events.click[0].namespace).toBe("patternDepends");
            });
        });

        describe("_enable", function() {
            it("Input element", function() {
                $("#lab").append("<button disabled=\"disabled\" class=\"disabled\" type=\"button\">Click me</button>");
                var $slave = $("#lab button");
                pattern._enable($slave);
                expect($slave[0].disabled).toBeFalsy();
                expect($slave.hasClass("disabled")).toBe(false);
            });

            it("Anchor", function() {
                $("#lab").append("<a href=\"#target\" class=\"disabled\">Click me</a>");
                var $slave = $("#lab a");
                $slave.on("click.patternDepends", false);
                pattern._enable($slave);
                expect($slave.hasClass("disabled")).toBe(false);
                expect($._data($slave[0]).events).toBe(undefined);
            });
        });

    });

});
