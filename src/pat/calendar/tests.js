define(["pat-calendar"], function(pattern) {

    describe("pat-calendar", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        // This is clearly a stub!

        describe("init", function() {
            it("Initialise the fullcalendar", function() {
                // currently, store cannot be none
                $("#lab").html([
                    "<div id=\"calendar\" class=\"pat-calendar\" data-pat-calendar=\"store: local\">",
                    "</div>"
                    ].join("\n"));
                var $calendar = $("#lab .pat-calendar");
                pattern.init($calendar);
                var fc_view = $calendar.find("div.fc-view");
                expect(fc_view.length).toBe(1);
            });
        });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
