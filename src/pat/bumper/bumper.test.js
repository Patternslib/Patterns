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

    describe("Scroll listeners", function () {
        it("Multiple bumpers in the same scroll container are all updated.", async function () {
            document.body.innerHTML = `
                <div id="bump1" class="pat-bumper"></div>
                <div id="bump2" class="pat-bumper"></div>
            `;
            const instance1 = new Bumper(document.getElementById("bump1"));
            const instance2 = new Bumper(document.getElementById("bump2"));
            await events.await_pattern_init(instance1);
            await events.await_pattern_init(instance2);

            const spy1 = jest.spyOn(instance1, "set_bumping_classes");
            const spy2 = jest.spyOn(instance2, "set_bumping_classes");

            document.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(spy1).toHaveBeenCalledTimes(1);
            expect(spy2).toHaveBeenCalledTimes(1);
        });

        it("The scroll listener is removed on destroy.", async function () {
            document.body.innerHTML = `
                <div id="bump1" class="pat-bumper"></div>
            `;
            const el = document.getElementById("bump1");
            const instance = new Bumper(el);
            await events.await_pattern_init(instance);

            const spy = jest.spyOn(instance, "set_bumping_classes");

            el.remove();
            await utils.timeout(1);
            expect(instance.destroyed).toBe(true);

            document.dispatchEvent(events.scroll_event());
            await utils.animation_frame();

            expect(spy).not.toHaveBeenCalled();
        });
    });
});
