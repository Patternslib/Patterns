import $ from "jquery";
import pattern from "./scroll";
import utils from "../../core/utils";

describe("pat-scroll", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });
    afterEach(function () {
        $("#lab").remove();
        jest.restoreAllMocks();
    });

    describe("If the trigger is set to 'auto", function () {
        it("will automatically scroll to an anchor if the trigger is set to 'auto'", async function (done) {
            $("#lab").html(
                [
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: auto">p1</a>',
                    '<p id="p1"></p>',
                ].join("\n")
            );
            const spy_animate = jest.spyOn($.fn, "animate");
            pattern.init($(".pat-scroll"));
            await utils.timeout(10); // wait some ticks for async to settle.
            expect(spy_animate).toHaveBeenCalled();
            done();
        });
    });

    describe("If the trigger is set to 'click'", function () {
        it("will scroll to an anchor on click", async function (done) {
            $("#lab").html(
                [
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click">p1</a>',
                    '<p id="p1"></p>',
                ].join("\n")
            );
            const $el = $(".pat-scroll");
            const spy_animate = spyOn($.fn, "animate");
            pattern.init($el);
            await utils.timeout(1); // wait a tick for async to settle.
            $el.click();
            await utils.timeout(1); // wait a tick for async to settle.
            // wait for scrolling via click to be done.
            expect(spy_animate).toHaveBeenCalled();
            done();
        });

        it("will scroll to an anchor on pat-update with originalEvent of click", async function (done) {
            $("#lab").html(
                [
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click">p1</a>',
                    '<p id="p1"></p>',
                ].join("\n")
            );
            const $el = $(".pat-scroll");
            const spy_animate = spyOn($.fn, "animate");
            pattern.init($el);
            await utils.timeout(1); // wait a tick for async to settle.
            $el.trigger("pat-update", {
                pattern: "stacks",
                originalEvent: {
                    type: "click",
                },
            });
            expect(spy_animate).toHaveBeenCalled();
            done();
        });
    });
});
