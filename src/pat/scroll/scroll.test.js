import $ from "jquery";
import pattern from "./scroll";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-scroll", function () {
    afterEach(function () {
        jest.restoreAllMocks();
    });

    it("will automatically scroll to an anchor if the trigger is set to 'auto' and will also handle 'click' events", async () => {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: auto">p1</a>
            <p id="p1"></p>
        `;
        const el = document.querySelector(".pat-scroll");
        const spy_animate = jest.spyOn($.fn, "animate");

        pattern.init(el);
        await utils.timeout(10); // wait some ticks for async to settle.

        expect(spy_animate).toHaveBeenCalledTimes(1);

        el.click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(spy_animate).toHaveBeenCalledTimes(2);
    });

    it("will scroll to an anchor on click if the trigger is set to 'click'", async () => {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click">p1</a>
            <p id="p1"></p>
        `;
        const el = document.querySelector(".pat-scroll");
        const spy_animate = jest.spyOn($.fn, "animate");

        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        el.click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(spy_animate).toHaveBeenCalled();
    });

    it("allows to define a delay after which it will scroll to an anchor", async () => {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click; delay: 200">p1</a>
            <p id="p1"></p>
        `;
        const el = document.querySelector(".pat-scroll");
        const spy_animate = jest.spyOn($.fn, "animate");

        pattern.init(el);
        await utils.timeout(1); // wait a tick for async to settle.

        el.click();
        await utils.timeout(1); // wait a tick for async to settle.
        expect(spy_animate).not.toHaveBeenCalled();

        await utils.timeout(300);

        expect(spy_animate).toHaveBeenCalled();
    });

    it("will scroll to an anchor on pat-update with originalEvent of click", async () => {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click">p1</a>
            <p id="p1"></p>
        `;
        const $el = $(".pat-scroll");
        const spy_animate = jest.spyOn($.fn, "animate");
        pattern.init($el);
        await utils.timeout(1); // wait a tick for async to settle.
        $el.trigger("pat-update", {
            pattern: "stacks",
            originalEvent: {
                type: "click",
            },
        });
        expect(spy_animate).toHaveBeenCalled();
    });

    it("will scroll to bottom with selector:bottom", async () => {
        document.body.innerHTML = `
            <div id="scroll-container" style="overflow: scroll">
              <button class="pat-scroll" data-pat-scroll="selector: bottom">to bottom</button>
            </div>
        `;

        const container = document.querySelector("#scroll-container");
        const trigger = document.querySelector(".pat-scroll");

        // mocking stuff jsDOM doesn't implement
        jest.spyOn(container, "scrollHeight", "get").mockImplementation(() => 100000);

        expect(container.scrollTop).toBe(0);

        pattern.init(trigger);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(container.scrollTop).toBe(0);

        trigger.click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(container.scrollTop > 0).toBe(true);
    });
});
