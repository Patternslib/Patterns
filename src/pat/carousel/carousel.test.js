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
                var spy_slick = spyOn($.fn, "slick").and.callThrough();
                pattern.init($carousel);
                expect(spy_slick).toHaveBeenCalled();
                var options = $.fn.slick.calls.argsFor(0)[0];
                expect(options.autoplay).toBe(false);
                expect(options.autoplaySpeed).toBe(1000);
                expect(options.speed).toBe(500);
                expect(options.adaptiveHeight).toBe(false);
                expect(options.arrows).toBe(true);
                expect(options.slidesToShow).toBe(1);
                expect(options.slidesToScroll).toBe(1);
                expect(options.dots).toBe(true);
                expect(options.appendDots).toBe(undefined);
            });

            it("Default options (DOM test)", function() {
                $("#lab").html(
                    "<ul class='pat-carousel'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>");
                var $carousel = $("#lab ul");
                pattern.init($carousel);
                // has been initialized
                expect($carousel.hasClass('slick-initialized')).toBe(true);
                // arrows created
                expect($carousel.find(".slick-arrow").length).toBe(2);
                // No navigation boxes
                expect($carousel.find(".slick-dots").length).toBe(1);
            });

            it("Tweak options via DOM", function() {
                $("#lab").html(
                    "<ul class='pat-carousel' data-pat-carousel='auto-play: true; auto-play-speed: 345; height: adaptive'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>");
                var $carousel = $("#lab ul");
                var spy_slick = spyOn($.fn, "slick").and.callThrough();
                pattern.init($carousel);
                expect(spy_slick).toHaveBeenCalled();
                var options = $.fn.slick.calls.argsFor(0)[0];
                expect(options.autoplay).toBe(true);
                expect(options.autoplaySpeed).toBe(345);
                expect(options.adaptiveHeight).toBe(true);
            });
        });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
