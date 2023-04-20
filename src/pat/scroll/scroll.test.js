import $ from "jquery";
import Pattern from "./scroll";
import events from "../../core/events";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-scroll", function () {
    beforeEach(function () {
        // polyfill window.scrollTo for jsdom, which just runs but does not scroll.
        this.spy_scrollTo = jest
            .spyOn(window, "scrollTo")
            .mockImplementation(() => null);
    });

    afterEach(function () {
        jest.restoreAllMocks();
    });

    it("1 - will automatically scroll to an anchor if the trigger is set to 'auto' and will also handle 'click' events", async function () {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: auto">p1</a>
            <p id="p1"></p>
        `;
        const el = document.querySelector(".pat-scroll");

        const instance = new Pattern(el);
        await events.await_pattern_init(instance);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(this.spy_scrollTo).toHaveBeenCalledTimes(1);

        el.click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(this.spy_scrollTo).toHaveBeenCalledTimes(2);
    });

    it("2 - will scroll to an anchor on click if the trigger is set to 'click'", async function () {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click">p1</a>
            <p id="p1"></p>
        `;
        const el = document.querySelector(".pat-scroll");

        const instance = new Pattern(el);
        await events.await_pattern_init(instance);

        el.click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(this.spy_scrollTo).toHaveBeenCalled();
    });

    it("3 - allows to define a delay after which it will scroll to an anchor", async function () {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click; delay: 200">p1</a>
            <p id="p1"></p>
        `;
        const el = document.querySelector(".pat-scroll");

        const instance = new Pattern(el);
        await events.await_pattern_init(instance);

        el.click();
        await utils.timeout(1); // wait a tick for async to settle.
        expect(this.spy_scrollTo).not.toHaveBeenCalled();
        await utils.timeout(100);
        expect(this.spy_scrollTo).not.toHaveBeenCalled();
        await utils.timeout(100);
        expect(this.spy_scrollTo).toHaveBeenCalled();
    });

    it("4 - allows to define a delay with units after which it will scroll to an anchor", async function () {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click; delay: 200ms">p1</a>
            <p id="p1"></p>
        `;
        const el = document.querySelector(".pat-scroll");

        const instance = new Pattern(el);
        await events.await_pattern_init(instance);

        el.click();
        await utils.timeout(1); // wait a tick for async to settle.
        expect(this.spy_scrollTo).not.toHaveBeenCalled();
        await utils.timeout(100);
        expect(this.spy_scrollTo).not.toHaveBeenCalled();
        await utils.timeout(100);
        expect(this.spy_scrollTo).toHaveBeenCalled();
    });

    it("5 - will scroll to an anchor on pat-update with originalEvent of click", async function () {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: click">p1</a>
            <p id="p1"></p>
        `;
        const $el = $(".pat-scroll");

        const instance = new Pattern($el[0]);
        await events.await_pattern_init(instance);
        $el.trigger("pat-update", {
            pattern: "stacks",
            originalEvent: {
                type: "click",
            },
        });
        expect(this.spy_scrollTo).toHaveBeenCalled();
    });

    it("6 - will allow for programmatic scrolling with trigger set to 'manual'", async function () {
        document.body.innerHTML = `
            <a href="#p1" class="pat-scroll" data-pat-scroll="trigger: manual">p1</a>
            <p id="p1"></p>
        `;
        const el = document.querySelector(".pat-scroll");

        const instance = new Pattern(el);
        await events.await_pattern_init(instance);

        expect(this.spy_scrollTo).not.toHaveBeenCalled();

        await instance.scrollTo();

        expect(this.spy_scrollTo).toHaveBeenCalled();
    });

    it("7 - will scroll to bottom with selector:bottom", async function () {
        document.body.innerHTML = `
            <div id="scroll-container" style="overflow-y: scroll">
              <button class="pat-scroll" data-pat-scroll="selector: bottom; trigger: manual">to bottom</button>
            </div>
        `;

        const container = document.querySelector("#scroll-container");
        const trigger = document.querySelector(".pat-scroll");

        // mocking stuff jsDOM doesn't implement
        jest.spyOn(container, "scrollHeight", "get").mockImplementation(() => 1000);
        // Need to force overwrite scrollTo, otherwise jest doesn't let it to
        // mock as it thinks it's a property.
        container.scrollTo = () => null;
        jest.spyOn(container, "scrollTo").mockImplementation((options) => {
            // We're at least testing that scrollTo is called with the right args
            container.scrollTop = options.top;
        });

        expect(container.scrollTop).toBe(0);

        const instance = new Pattern(trigger);
        await events.await_pattern_init(instance);

        expect(container.scrollTop).toBe(0);

        await instance.scrollTo();

        expect(container.scrollTop).toBe(1000);
    });

    it("8 - will add an offset to the scroll position", async function () {
        // Testing with `selector: top`, as this just sets scrollTop to 0

        document.body.innerHTML = `
            <div id="scroll-container" style="overflow-y: scroll">
              <button class="pat-scroll" data-pat-scroll="selector: top; offset: 40; trigger: manual">to bottom</button>
            </div>
        `;

        const container = document.querySelector("#scroll-container");
        const trigger = document.querySelector(".pat-scroll");

        // Need to force overwrite scrollTo, otherwise jest doesn't let it to
        // mock as it thinks it's a property.
        container.scrollTo = () => null;
        jest.spyOn(container, "scrollTo").mockImplementation((options) => {
            // We're at least testing that scrollTo is called with the right args
            container.scrollTop = options.top;
        });

        expect(container.scrollTop).toBe(0);

        const instance = new Pattern(trigger);
        await events.await_pattern_init(instance);

        await instance.scrollTo();

        expect(container.scrollTop).toBe(-40);
    });

    it("9 - will adds a negative offset to scroll position", async function () {
        // Testing with `selector: top`, as this just sets scrollTop to 0

        document.body.innerHTML = `
            <div id="scroll-container" style="overflow-y: scroll">
              <button class="pat-scroll" data-pat-scroll="selector: top; offset: -40; trigger: manual">to bottom</button>
            </div>
        `;

        const container = document.querySelector("#scroll-container");
        const trigger = document.querySelector(".pat-scroll");

        // Need to force overwrite scrollTo, otherwise jest doesn't let it to
        // mock as it thinks it's a property.
        container.scrollTo = () => null;
        jest.spyOn(container, "scrollTo").mockImplementation((options) => {
            // We're at least testing that scrollTo is called with the right args
            container.scrollTop = options.top;
        });

        expect(container.scrollTop).toBe(0);

        const instance = new Pattern(trigger);
        await events.await_pattern_init(instance);
        await instance.scrollTo();

        expect(container.scrollTop).toBe(40);
    });

    it("10 - handles different selector options.", async function () {
        document.body.innerHTML = `
            <a href="#el3" class="pat-scroll">scroll</a>
            <div id="el1"></div>
            <div class="el2"></div>
            <div id="el3"></div>
        `;

        const el_pat = document.querySelector(".pat-scroll");
        const el_1 = document.querySelector("#el1");
        const el_2 = document.querySelector(".el2");
        const el_3 = document.querySelector("#el3");

        const pat = new Pattern(el_pat);
        await events.await_pattern_init(pat);

        pat.options.selector = "self";
        expect(pat.get_target()).toBe(el_pat);

        pat.options.selector = "top";
        expect(pat.get_target()).toBe(el_pat);

        pat.options.selector = "bottom";
        expect(pat.get_target()).toBe(el_pat);

        pat.options.selector = "#el1";
        expect(pat.get_target()).toBe(el_1);

        pat.options.selector = ".el2";
        expect(pat.get_target()).toBe(el_2);

        pat.options.selector = null; // Using href target
        expect(pat.get_target()).toBe(el_3);
    });
});
