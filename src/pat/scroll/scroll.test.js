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

    describe("pat-scroll ...", function () {
        it("will automatically scroll to an anchor if the trigger is set to 'auto' and will also handle 'click' events", async function (done) {
            $("#lab").html(
                [
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: auto">p1</a>',
                    '<p id="p1"></p>',
                ].join("\n")
            );
            const el = document.querySelector(".pat-scroll");
            const spy_animate = jest.spyOn($.fn, "animate");

            pattern.init(el);
            await utils.timeout(10); // wait some ticks for async to settle.

            expect(spy_animate).toHaveBeenCalledTimes(1);

            el.click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(spy_animate).toHaveBeenCalledTimes(2);

            done();
        });

        it("will scroll to an anchor on click if the trigger is set to 'click'", async function (done) {
            $("#lab").html(
                [
                    '<a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click">p1</a>',
                    '<p id="p1"></p>',
                ].join("\n")
            );
            const el = document.querySelector(".pat-scroll");
            const spy_animate = spyOn($.fn, "animate");

            pattern.init(el);
            await utils.timeout(1); // wait a tick for async to settle.

            el.click();
            await utils.timeout(1); // wait a tick for async to settle.

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

        // Skipping - passes only in isolation.
        it.skip("will scroll to bottom with selector:bottom", async function (done) {
            const outer = document.createElement("div");
            outer.innerHTML = `
                <div id="scroll-container" style="overflow: scroll">
                  <button class="pat-scroll" data-pat-scroll="selector: bottom">to bottom</button>
                </div>
            `;

            const container = outer.querySelector("#scroll-container");
            const trigger = outer.querySelector(".pat-scroll");

            // mocking stuff jsDOM doesn't implement
            jest.spyOn(container, "scrollHeight", "get").mockImplementation(
                () => 100000
            );

            expect(container.scrollTop).toBe(0);

            pattern.init(trigger);
            await utils.timeout(1); // wait a tick for async to settle.

            expect(container.scrollTop).toBe(0);

            trigger.click();
            await utils.timeout(1); // wait a tick for async to settle.

            expect(container.scrollTop > 0).toBe(true);

            jest.restoreAllMocks();

            done();
        });
    });
});
