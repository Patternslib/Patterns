define(["pat-collapsible"], function(pattern) {

    describe("collapsible-pattern", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Create panel-content", function() {
                var $lab = $("#lab");
                $lab.html([
                    "<div class=\"pat-collapsible\">",
                    "<h3>Trigger header</h3>",
                    "<p>Collapsible content</p>",
                    "</div>"
                    ].join("\n"));
                var $collapsible = $("#lab .pat-collapsible");
                pattern.init($collapsible);
                expect($collapsible.find(".panel-content").length).toBe(1);
            });

            it("Panels are open by default", function() {
                var $lab = $("#lab");
                $lab.html([
                    "<div class=\"pat-collapsible\">",
                    "<h3>Trigger header</h3>",
                    "<p>Collapsible content</p>",
                    "</div>"
                    ].join("\n"));
                var $collapsible = $("#lab .pat-collapsible");
                pattern.init($collapsible);
                expect($collapsible.hasClass("open")).toBeTruthy();
            });

            it("Explicitly closed panel is not open", function() {
                var $lab = $("#lab");
                $lab.html([
                    "<div class=\"pat-collapsible closed\">",
                    "<h3>Trigger header</h3>",
                    "<p>Collapsible content</p>",
                    "</div>"
                    ].join("\n"));
                var $collapsible = $("#lab .pat-collapsible");
                pattern.init($collapsible);
                expect($collapsible.hasClass("open")).toBeFalsy();
            });
        });

        describe("toggle", function() {
            it("Toggle an open panel", function() {
                var $lab = $("#lab");
                $lab.html([
                    "<div class=\"pat-collapsible\">",
                    "<h3>Trigger header</h3>",
                    "<p>Collapsible content</p>",
                    "</div>"
                    ].join("\n"));
                var $collapsible = $("#lab .pat-collapsible");
                pattern.init($collapsible, {transition: "none"});
                pattern.toggle($collapsible);
                expect($collapsible.hasClass("open")).toBe(false);
                expect($collapsible.hasClass("closed")).toBe(true);
                var $trigger = $("#lab h3");
                expect($trigger.hasClass("collapsible-open")).toBe(false);
                expect($trigger.hasClass("collapsible-closed")).toBe(true);
            });

            it("Toggle a closed panel", function() {
                var $lab = $("#lab");
                $lab.html([
                    "<div class=\"pat-collapsible closed\">",
                    "<h3>Trigger header</h3>",
                    "<p>Collapsible content</p>",
                    "</div>"
                    ].join("\n"));
                var $collapsible = $("#lab .pat-collapsible");
                pattern.init($collapsible, {transition: "none"});
                pattern.toggle($collapsible);
                expect($collapsible.hasClass("open")).toBe(true);
                expect($collapsible.hasClass("closed")).toBe(false);
                var $trigger = $("#lab h3");
                expect($trigger.hasClass("collapsible-open")).toBe(true);
                expect($trigger.hasClass("collapsible-closed")).toBe(false);
            });
        });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
