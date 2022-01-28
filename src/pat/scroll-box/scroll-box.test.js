import pattern from "./scroll-box";
import utils from "../../core/utils";
import events from "../../core/events";

describe("pat-scroll-box", function () {
    afterEach(function () {
        jest.restoreAllMocks();
        document.body.innerHTML = "";
    });

    it("1 - Basic functionality", async function () {
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

        el.scrollTop = 100;
        el.dispatchEvent(events.scroll_event());
        await utils.animation_frame();
        expect(el.classList).not.toContain("scroll-position-top");
        expect(el.classList).not.toContain("scroll-position-bottom");
        expect(el.classList).not.toContain("scroll-up");
        expect(el.classList).toContain("scroll-down");

        el.scrollTop = 50;
        el.dispatchEvent(events.scroll_event());
        await utils.animation_frame();
        expect(el.classList).not.toContain("scroll-position-top");
        expect(el.classList).not.toContain("scroll-position-bottom");
        expect(el.classList).toContain("scroll-up");
        expect(el.classList).not.toContain("scroll-down");

        el.scrollTop = 200;
        el.dispatchEvent(events.scroll_event());
        await utils.animation_frame();
        expect(el.classList).not.toContain("scroll-position-top");
        expect(el.classList).toContain("scroll-position-bottom");
        expect(el.classList).not.toContain("scroll-up");
        expect(el.classList).toContain("scroll-down");

        el.scrollTop = 0;
        el.dispatchEvent(events.scroll_event());
        await utils.animation_frame();
        expect(el.classList).toContain("scroll-position-top");
        expect(el.classList).not.toContain("scroll-position-bottom");
        expect(el.classList).toContain("scroll-up");
        expect(el.classList).not.toContain("scroll-down");
    });
});
