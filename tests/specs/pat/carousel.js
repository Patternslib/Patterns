define(["pat-carousel"], function(pattern) {

    describe("carousel-plugin", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("init", function() {
            it("Default options", function() {
                $("#lab").html(
                    "<ul class='pat-carousel'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>");
                var $carousel = $("#lab ul");
                spyOn($.fn, "anythingSlider").andCallThrough();
                pattern.init($carousel);
                expect($.fn.anythingSlider).toHaveBeenCalled();
                var options = $.fn.anythingSlider.calls[0].args[0];
                expect(options.autoPlay).toBe(false);
                expect(options.stopAtEnd).toBe(false);
                expect(options.resizeContents).toBe(false);
                expect(options.expand).toBe(false);
                expect(options.buildArrows).toBe(true);
                expect(options.expand).toBe(false);
            });

            it("Default options (DOM test)", function() {
                $("#lab").html(
                    "<ul class='pat-carousel'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>");
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
                    "<ul class='pat-carousel' data-pat-carousel='auto-play: false; loop: false; time-delay: 50'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>");
                var $carousel = $("#lab ul");
                spyOn($.fn, "anythingSlider").andCallThrough();
                pattern.init($carousel);
                expect($.fn.anythingSlider).toHaveBeenCalled();
                var options = $.fn.anythingSlider.calls[0].args[0];
                expect(options.autoPlay).toBe(false);
                expect(options.stopAtEnd).toBe(true);
                expect(options.delay).toBe(50);
            });
        });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
