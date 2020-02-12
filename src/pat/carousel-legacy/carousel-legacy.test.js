import pattern from "./carousel-legacy";
import $ from "jquery";

describe("carousel-legacy-plugin", function() {
    beforeEach(function() {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function() {
        $("#lab").remove();
    });

    describe("init", function() {
        it("Default options", function() {
            $("#lab").html(
                "<ul class='pat-carousel-legacy'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>"
            );
            var $carousel = $("#lab ul");
            var spy_slider = spyOn(
                $.fn,
                "anythingSlider"
            ).and.callThrough();
            pattern.init($carousel);
            expect(spy_slider).toHaveBeenCalled();
            var options = $.fn.anythingSlider.calls.argsFor(0)[0];
            expect(options.autoPlay).toBe(false);
            expect(options.stopAtEnd).toBe(false);
            expect(options.resizeContents).toBe(false);
            expect(options.expand).toBe(false);
            expect(options.buildArrows).toBe(true);
            expect(options.expand).toBe(false);
        });

        it("Default options (DOM test)", function() {
            $("#lab").html(
                "<ul class='pat-carousel-legacy'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>"
            );
            var $carousel = $("#lab ul");
            pattern.init($carousel);
            // No arrows created
            expect($carousel.find(".arrow").length).toBe(0);
            // No start-stop button created
            expect($carousel.find(".start-stop").length).toBe(0);
            // No navigation boxes
            expect($carousel.find(".anythingNavWindow").length).toBe(0);
        });

        it("Tweak options via DOM", function() {
            $("#lab").html(
                "<ul class='pat-carousel-legacy' data-pat-carousel-legacy='auto-play: false; loop: false; time-delay: 50'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>"
            );
            var $carousel = $("#lab ul");
            var spy_slider = spyOn(
                $.fn,
                "anythingSlider"
            ).and.callThrough();
            pattern.init($carousel);
            expect(spy_slider).toHaveBeenCalled();
            var options = $.fn.anythingSlider.calls.argsFor(0)[0];
            expect(options.autoPlay).toBe(false);
            expect(options.stopAtEnd).toBe(true);
            expect(options.delay).toBe(50);
        });
    });
});
