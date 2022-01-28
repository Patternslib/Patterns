import pattern, { parser } from "./scroll-box";
import utils from "../../core/utils";
import events from "../../core/events";

describe("pat-scroll-box", function () {
    let orig_timeout;
    let custom_timeout = 10; // reduced timeout for faster testing
    beforeEach(function () {
        orig_timeout = parser.parameters["timeout-stop"].value;
        parser.parameters["timeout-stop"].value = custom_timeout;
    });

    afterEach(function () {
        jest.restoreAllMocks();
        document.body.innerHTML = "";
        parser.parameters["timeout-stop"].value = orig_timeout;
    });

    it("Basic functionality", async function () {
        document.body.innerHTML = `
          <div id="el1" style="overflow: scroll"></div>
        `;
        const el = document.querySelector("#el1");

        // mocks
        Object.defineProperty(el, "clientHeight", { value: 100, writable: false });
        Object.defineProperty(el, "scrollHeight", { value: 300, writable: false });
        Object.defineProperty(el, "scrollTop", { value: 0, writable: true });

        new pattern(el);
        await utils.timeout(1);

        el.scrollTop = 0;
        el.dispatchEvent(events.scroll_event());
        expect(el.classList).toContain("scroll-position-top");
        expect(el.classList).not.toContain("scroll-position-bottom");
        expect(el.classList).not.toContain("scroll-up");
        expect(el.classList).not.toContain("scroll-down");
        expect(el.classList).not.toContain("scrolling-up");
        expect(el.classList).not.toContain("scrolling-down");

        el.scrollTop = 100;
        el.dispatchEvent(events.scroll_event());
        await utils.animation_frame();
        expect(el.classList).not.toContain("scroll-position-top");
        expect(el.classList).not.toContain("scroll-position-bottom");
        expect(el.classList).not.toContain("scroll-up");
        expect(el.classList).toContain("scroll-down");
        expect(el.classList).not.toContain("scrolling-up");
        expect(el.classList).toContain("scrolling-down");

        el.scrollTop = 50;
        el.dispatchEvent(events.scroll_event());
        await utils.animation_frame();
        expect(el.classList).not.toContain("scroll-position-top");
        expect(el.classList).not.toContain("scroll-position-bottom");
        expect(el.classList).toContain("scroll-up");
        expect(el.classList).not.toContain("scroll-down");
        expect(el.classList).toContain("scrolling-up");
        expect(el.classList).not.toContain("scrolling-down");

        el.scrollTop = 200;
        el.dispatchEvent(events.scroll_event());
        await utils.animation_frame();
        expect(el.classList).not.toContain("scroll-position-top");
        expect(el.classList).toContain("scroll-position-bottom");
        expect(el.classList).not.toContain("scroll-up");
        expect(el.classList).toContain("scroll-down");
        expect(el.classList).not.toContain("scrolling-up");
        expect(el.classList).toContain("scrolling-down");

        el.scrollTop = 0;
        el.dispatchEvent(events.scroll_event());
        await utils.animation_frame();
        expect(el.classList).toContain("scroll-position-top");
        expect(el.classList).not.toContain("scroll-position-bottom");
        expect(el.classList).toContain("scroll-up");
        expect(el.classList).not.toContain("scroll-down");
        expect(el.classList).toContain("scrolling-up");
        expect(el.classList).not.toContain("scrolling-down");

        // Test for clearing the scrolling classes after a scroll stop
        // Still there...
        await utils.timeout(custom_timeout / 2);
        expect(el.classList).toContain("scrolling-up");
        // Now gone
        await utils.timeout(custom_timeout / 2 + 1);
        expect(el.classList).not.toContain("scrolling-up");

        el.scrollTop = 100;
        el.dispatchEvent(events.scroll_event());
        await utils.animation_frame();
        expect(el.classList).not.toContain("scroll-position-top");
        expect(el.classList).not.toContain("scroll-position-bottom");
        expect(el.classList).not.toContain("scroll-up");
        expect(el.classList).toContain("scroll-down");
        expect(el.classList).not.toContain("scrolling-up");
        expect(el.classList).toContain("scrolling-down");

        // Test for clearing the scrolling classes after a scroll stop
        // Still there...
        await utils.timeout(custom_timeout / 2);
        expect(el.classList).toContain("scrolling-down");
        // Now gone
        await utils.timeout(custom_timeout / 2 + 1);
        expect(el.classList).not.toContain("scrolling-down");
    });
});
