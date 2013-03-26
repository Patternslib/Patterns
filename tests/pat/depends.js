define(["pat/depends"], function(pattern) {

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

        describe("_hide_or_show", function() {
            beforeEach(function() {
                jasmine.Clock.useMock();$("<div/>", {id: "lab"}).appendTo(document.body);
                $.fx.off=true;
            });

            afterEach(function() {
                $.fx.off=false;
            });

            it("Hide without a transition", function() {
                $("#lab").append("<div/>");
                var $slave = $("#lab div");
                pattern._hide_or_show($slave, false, {transition: "none", effect: {duration: "fast", easing: "swing"}});
                expect($slave[0].style.display).toBe("none");
                expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
            });

            it("Show without a transition", function() {
                $("#lab").append("<div style=\"display: none\"/>");
                var $slave = $("#lab div");
                pattern._hide_or_show($slave, true, {transition: "none", effect: {duration: "fast", easing: "swing"}});
                expect($slave[0].style.display).toBe("");
                expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["visible"]);
            });

            it("Fadeout with 0 duration", function() {
                $("#lab").append("<div/>");
                var $slave = $("#lab div");
                pattern._hide_or_show($slave, false, {transition: "slide", effect: {duration: 0, easing: "swing"}});
                expect($slave[0].style.display).toBe("none");
                expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
            });

            it("Fadeout with non-zero duration", function() {
                $("#lab").append("<div/>");
                var $slave = $("#lab div");
                pattern._hide_or_show($slave, false, {transition: "slide", effect: {duration: "fast", easing: "swing"}});
                expect($slave[0].style.display).toBe("none");
                expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
            });

            it("CSS-only hide", function() {
                $("#lab").append("<div/>");
                var $slave = $("#lab div");
                pattern._hide_or_show($slave, false, {transition: "css", effect: {duration: "fast", easing: "swing"}});
                expect($slave[0].style.display).toBe("");
                expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
            });
        });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
