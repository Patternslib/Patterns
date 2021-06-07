import $ from "jquery";
import pattern from "./carousel";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("carousel-plugin", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
        jest.restoreAllMocks();
    });

    describe("init", function () {
        it("Default options 1", async () => {
            $("#lab").html(
                "<ul class='pat-carousel'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>"
            );

            pattern.init(document.createElement("div")); // Just to async-load slick before initializing the spy.
            await utils.timeout(10); // wait a bit for all to settle.

            var $carousel = $("#lab ul");
            var spy_slick = jest.spyOn($.fn, "slick");

            pattern.init($carousel);
            await utils.timeout(20); // wait a bit for all to settle.

            expect(spy_slick).toHaveBeenCalled();

            var options = spy_slick.mock.calls[0][0];
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

        it("Default options 2 (DOM test)", async () => {
            $("#lab").html(
                "<ul class='pat-carousel'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>"
            );
            var $carousel = $("#lab ul");
            pattern.init($carousel);
            await utils.timeout(20); // wait a bit for all to settle.

            // has been initialized
            expect($carousel.hasClass("slick-initialized")).toBe(true);

            // arrows created
            expect($carousel.find(".slick-arrow").length).toBe(2);

            // No navigation boxes
            expect($carousel.find(".slick-dots").length).toBe(1);
        });

        it("Tweak options via DOM", async () => {
            $("#lab").html(
                "<ul class='pat-carousel' data-pat-carousel='auto-play: true; auto-play-speed: 345; height: adaptive'>" +
                    "  <li>Panel 1</li>" +
                    "  <li>Panel 2</li>" +
                    "</ul>"
            );
            var $carousel = $("#lab ul");
            var spy_slick = jest.spyOn($.fn, "slick");
            pattern.init($carousel);
            await utils.timeout(20); // wait a bit for all to settle.

            expect(spy_slick).toHaveBeenCalled();
            var options = spy_slick.mock.calls[0][0];
            expect(options.autoplay).toBe(true);
            expect(options.autoplaySpeed).toBe(345);
            expect(options.adaptiveHeight).toBe(true);
        });
    });
});
