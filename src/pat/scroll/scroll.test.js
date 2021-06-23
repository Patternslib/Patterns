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

    it("will allow for programmatic scrolling with trigger set to 'manual'", async () => {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: manual">p1</a>
            <p id="p1"></p>
        `;
        const el = document.querySelector(".pat-scroll");
        const spy_animate = jest.spyOn($.fn, "animate");

        const pat = pattern.init(el);
        await utils.timeout(1); // wait some ticks for async to settle.

        expect(spy_animate).not.toHaveBeenCalled();

        await pat.smoothScroll();

        expect(spy_animate).toHaveBeenCalled();
    });

    it("will scroll to bottom with selector:bottom", async () => {
        document.body.innerHTML = `
            <div id="scroll-container" style="overflow: scroll">
              <button class="pat-scroll" data-pat-scroll="selector: bottom; trigger: manual">to bottom</button>
            </div>
        `;

        const container = document.querySelector("#scroll-container");
        const trigger = document.querySelector(".pat-scroll");

        // mocking stuff jsDOM doesn't implement
        jest.spyOn(container, "scrollHeight", "get").mockImplementation(() => 1000);

        expect(container.scrollTop).toBe(0);

        const pat = pattern.init(trigger);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(container.scrollTop).toBe(0);

        await pat.smoothScroll();

        expect(container.scrollTop).toBe(1000);
    });

    it("will add an offset to the scroll position", async () => {
        // Testing with `selector: top`, as this just sets scrollTop to 0

        document.body.innerHTML = `
            <div id="scroll-container" style="overflow: scroll">
              <button class="pat-scroll" data-pat-scroll="selector: top; offset: 40; trigger: manual">to bottom</button>
            </div>
        `;

        const container = document.querySelector("#scroll-container");
        const trigger = document.querySelector(".pat-scroll");
        const spy_animate = jest.spyOn($.fn, "animate");

        expect(container.scrollTop).toBe(0);

        const pat = pattern.init(trigger);
        await utils.timeout(1); // wait a tick for async to settle.
        await pat.smoothScroll();

        // get first called argument
        const arg_1 = spy_animate.mock.calls[0][0];
        expect(arg_1.scrollTop).toBe(-40); // the offset is substracted from the scroll position to stop BEFORE the target position
    });

    it("will adds a negative offset to scroll position", async () => {
        // Testing with `selector: top`, as this just sets scrollTop to 0

        document.body.innerHTML = `
            <div id="scroll-container" style="overflow: scroll">
              <button class="pat-scroll" data-pat-scroll="selector: top; offset: -40; trigger: manual">to bottom</button>
            </div>
        `;

        const container = document.querySelector("#scroll-container");
        const trigger = document.querySelector(".pat-scroll");
        const spy_animate = jest.spyOn($.fn, "animate");

        expect(container.scrollTop).toBe(0);

        const pat = pattern.init(trigger);
        await utils.timeout(1); // wait a tick for async to settle.
        await pat.smoothScroll();

        // get first called argument
        const arg_1 = spy_animate.mock.calls[0][0];
        expect(arg_1.scrollTop).toBe(40); // the offset is substracted from the scroll position, so a negative offset is added to the scroll position and stops AFTER the target position.
    });

    it("handles different selector options.", () => {
        document.body.innerHTML = `
            <a href="#el3" class="pat-scroll" />
            <div id="#el1" />
            <div class=".el2 />
            <div id="#el3" />
        `;

        const el_pat = document.querySelector(".pat-scroll");
        const el_1 = document.querySelector("#el1");
        const el_2 = document.querySelector(".el2");
        const el_3 = document.querySelector("#el3");

        const pat = pattern.init(el_pat);

        pat.options.selector = "self";
        expect(pat._get_selector_target()).toBe(el_pat);

        pat.options.selector = "#el1";
        expect(pat._get_selector_target()).toBe(el_1);

        pat.options.selector = ".el2";
        expect(pat._get_selector_target()).toBe(el_2);

        pat.options.selector = null; // Using href target
        expect(pat._get_selector_target()).toBe(el_3);
    });
});
