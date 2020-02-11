define(["pat-registry", "pat-collapsible"], function(registry, Pattern) {

    describe("pat-collapsible", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("wraps the collapsible within a div.panel-content", function() {
            var $lab = $("#lab");
            $lab.html([
                "<div class=\"pat-collapsible\">",
                "<h3>Trigger header</h3>",
                "<p>Collapsible content</p>",
                "</div>"
                ].join("\n"));
            var $collapsible = $("#lab .pat-collapsible");
            Pattern.init($collapsible);
            expect($collapsible.find(".panel-content").length).toBe(1);
        });

        describe("A Collapsible", function() {
            it("is open by default", function() {
                var $lab = $("#lab");
                $lab.html([
                    "<div class=\"pat-collapsible\">",
                    "<h3>Trigger header</h3>",
                    "<p>Collapsible content</p>",
                    "</div>"
                    ].join("\n"));
                var $collapsible = $("#lab .pat-collapsible");
                Pattern.init($collapsible);
                expect($collapsible.hasClass("open")).toBeTruthy();
            });

            it("can be explicitly closed by adding the class 'closed'", function() {
                var $lab = $("#lab");
                $lab.html([
                    "<div class=\"pat-collapsible closed\">",
                    "<h3>Trigger header</h3>",
                    "<p>Collapsible content</p>",
                    "</div>"
                    ].join("\n"));
                var $collapsible = $("#lab .pat-collapsible");
                Pattern.init($collapsible);
                expect($collapsible.hasClass("open")).toBeFalsy();
            });

            it("can be toggled closed if it's open", function() {
                var $lab = $("#lab");
                $lab.html([
                    "<div class=\"pat-collapsible\">",
                    "<h3>Trigger header</h3>",
                    "<p>Collapsible content</p>",
                    "</div>"
                    ].join("\n"));
                var $collapsible = $("#lab .pat-collapsible");
                var pat = Pattern.init($collapsible, {transition: "none"});
                pat.toggle($collapsible);
                expect($collapsible.hasClass("open")).toBe(false);
                expect($collapsible.hasClass("closed")).toBe(true);
                var $trigger = $("#lab h3");
                expect($trigger.hasClass("collapsible-open")).toBe(false);
                expect($trigger.hasClass("collapsible-closed")).toBe(true);
            });

            it("can be toggled open if it's closed", function() {
                var $lab = $("#lab");
                $lab.html([
                    "<div class=\"pat-collapsible closed\">",
                    "<h3>Trigger header</h3>",
                    "<p>Collapsible content</p>",
                    "</div>"
                    ].join("\n"));
                var $collapsible = $("#lab .pat-collapsible");
                var pat = Pattern.init($collapsible, {transition: "none"});
                pat.toggle($collapsible);
                expect($collapsible.hasClass("open")).toBe(true);
                expect($collapsible.hasClass("closed")).toBe(false);
                var $trigger = $("#lab h3");
                expect($trigger.hasClass("collapsible-open")).toBe(true);
                expect($trigger.hasClass("collapsible-closed")).toBe(false);
            });

            it("can be configured to have trigger which only opens it", function() {
                var $lab = $("#lab"), $collapsible;
                $lab.html([
                    "<div class=\"closed pat-collapsible\" data-pat-collapsible=\"open-trigger: #open\">",
                    "<button>toggle</button>",
                    "<p>Collapsible content</p>",
                    "<button id=\"open\">open</button>",
                    "</div>"
                    ].join("\n"));
                $collapsible = $("#lab .pat-collapsible");
                registry.scan($collapsible);
                expect($collapsible.hasClass("open")).toBe(false);
                expect($collapsible.hasClass("closed")).toBe(true);
                $('#open').click();
                setTimeout(function () {
                    expect($collapsible.hasClass("open")).toBe(true);
                    expect($collapsible.hasClass("closed")).toBe(false);
                }, 500);
            });

            it("can be configured to have trigger which only closes it", function() {
                var $lab = $("#lab"), $collapsible;
                $lab.html([
                    "<div class=\"pat-collapsible\" data-pat-collapsible=\"close-trigger: #close\">",
                    "<button>toggle</button>",
                    "<p>Collapsible content</p>",
                    "<button id=\"close\">close</button>",
                    "</div>"
                    ].join("\n"));
                $collapsible = $("#lab .pat-collapsible");
                registry.scan($collapsible);
                expect($collapsible.hasClass("closed")).toBe(false);
                expect($collapsible.hasClass("open")).toBe(true);
                $('#close').click();
                setTimeout(function () {
                    expect($collapsible.hasClass("closed")).toBe(true);
                    expect($collapsible.hasClass("open")).toBe(false);
                }, 500);
            });
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
