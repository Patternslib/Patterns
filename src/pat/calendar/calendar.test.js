import pattern from "./calendar";
import $ from "jquery";
import utils from "../../core/utils";
import "fullcalendar"; // no lazy-load for tests to please jest.

describe("pat-calendar", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
    });

    // This is clearly a stub!

    describe("init", function () {
        it("Initialise the fullcalendar", async function () {
            // currently, store cannot be none
            $("#lab").html(
                [
                    '<div id="calendar" class="pat-calendar" data-pat-calendar="store: local">',
                    "</div>",
                ].join("\n")
            );
            var $calendar = $("#lab .pat-calendar");
            pattern.init($calendar);
            await utils.timeout(1); // wait a tick for async to settle.
            var fc_view = $calendar.find("div.fc-view");
            expect(fc_view.length).toBe(1);
        });
    });
});
