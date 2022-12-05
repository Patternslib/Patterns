import Bumper from "./bumper";
import events from "../../core/events";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-bumper", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    describe("Set bumping classes when bumping", function () {
        it("against the viewport.", async function () {
            document.body.innerHTML = `
            <div
                id="bump"
                class="pat-bumper"></div>
        `;

            const el = document.getElementById("bump");

            // Viewport mocks
            Object.defineProperty(document.documentElement, "clientHeight", {
                value: 100,
                writable: false,
            });
            Object.defineProperty(document.documentElement, "clientWidth", {
                value: 100,
                writable: false,
            });

            // Element mocks
            const el_bounds = { top: 40, right: 40, bottom: 40, left: 40 };
            jest.spyOn(el, "getBoundingClientRect").mockImplementation(() => el_bounds);

            const instance = new Bumper(el);
            await events.await_pattern_init(instance);

            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(false);
            expect(el.classList.contains("bumped-top")).toBe(false);
            expect(el.classList.contains("bumped-right")).toBe(false);
            expect(el.classList.contains("bumped-bottom")).toBe(false);
            expect(el.classList.contains("bumped-left")).toBe(false);

            // Scroll to top, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 0, right: 40, bottom: 80, left: 40 });
            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(true);
            expect(el.classList.contains("bumped-top")).toBe(true);
            expect(el.classList.contains("bumped-right")).toBe(false);
            expect(el.classList.contains("bumped-bottom")).toBe(false);
            expect(el.classList.contains("bumped-left")).toBe(false);

            // Scroll to top-right, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 0, right: 100, bottom: 80, left: 80 });

            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(true);
            expect(el.classList.contains("bumped-top")).toBe(true);
            expect(el.classList.contains("bumped-right")).toBe(true);
            expect(el.classList.contains("bumped-bottom")).toBe(false);
            expect(el.classList.contains("bumped-left")).toBe(false);

            // Scroll to right, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 40, right: 100, bottom: 40, left: 80 });
            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(true);
            expect(el.classList.contains("bumped-top")).toBe(false);
            expect(el.classList.contains("bumped-right")).toBe(true);
            expect(el.classList.contains("bumped-bottom")).toBe(false);
            expect(el.classList.contains("bumped-left")).toBe(false);

            // Scroll to bottom-right, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 80, right: 100, bottom: 100, left: 80 });
            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(true);
            expect(el.classList.contains("bumped-top")).toBe(false);
            expect(el.classList.contains("bumped-right")).toBe(true);
            expect(el.classList.contains("bumped-bottom")).toBe(true);
            expect(el.classList.contains("bumped-left")).toBe(false);

            // Scroll to bottom, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 80, right: 40, bottom: 100, left: 40 });
            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(true);
            expect(el.classList.contains("bumped-top")).toBe(false);
            expect(el.classList.contains("bumped-right")).toBe(false);
            expect(el.classList.contains("bumped-bottom")).toBe(true);
            expect(el.classList.contains("bumped-left")).toBe(false);

            // Scroll to bottom-left, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 80, right: 80, bottom: 100, left: 0 });
            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(true);
            expect(el.classList.contains("bumped-top")).toBe(false);
            expect(el.classList.contains("bumped-right")).toBe(false);
            expect(el.classList.contains("bumped-bottom")).toBe(true);
            expect(el.classList.contains("bumped-left")).toBe(true);

            // Scroll to left, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 40, right: 80, bottom: 40, left: 0 });
            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(true);
            expect(el.classList.contains("bumped-top")).toBe(false);
            expect(el.classList.contains("bumped-right")).toBe(false);
            expect(el.classList.contains("bumped-bottom")).toBe(false);
            expect(el.classList.contains("bumped-left")).toBe(true);

            // Scroll to top-left, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 0, right: 80, bottom: 80, left: 0 });
            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(true);
            expect(el.classList.contains("bumped-top")).toBe(true);
            expect(el.classList.contains("bumped-right")).toBe(false);
            expect(el.classList.contains("bumped-bottom")).toBe(false);
            expect(el.classList.contains("bumped-left")).toBe(true);

            // Scroll to top, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 0, right: 40, bottom: 80, left: 40 });
            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(true);
            expect(el.classList.contains("bumped-top")).toBe(true);
            expect(el.classList.contains("bumped-right")).toBe(false);
            expect(el.classList.contains("bumped-bottom")).toBe(false);
            expect(el.classList.contains("bumped-left")).toBe(false);

            // Scroll to middle, update getBoundingClientRect.
            Object.assign(el_bounds, { top: 40, right: 40, bottom: 40, left: 40 });
            el.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(el.classList.contains("bumped")).toBe(false);
            expect(el.classList.contains("bumped-top")).toBe(false);
            expect(el.classList.contains("bumped-right")).toBe(false);
            expect(el.classList.contains("bumped-bottom")).toBe(false);
            expect(el.classList.contains("bumped-left")).toBe(false);
        });
    });
});
