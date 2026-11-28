import $ from "jquery";
import Pattern from "./equaliser";
import events from "../../core/events";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

describe("pat-equaliser", function () {
    beforeEach(function () {
        const style = document.createElement("style");
        style.id = "pat-equaliser-style";
        style.textContent = `
            .small { height: 50px; }
            .large { height: 100px; }
        `;
        document.head.appendChild(style);
    });

    afterEach(function () {
        document.body.innerHTML = "";
        document.querySelector("#pat-equaliser-style").remove();
        jest.restoreAllMocks();
    });

    describe("update", function () {
        it("Equalises the height of the children.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div class="small"></div>
                    <div class="large"></div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);

            const small = pattern_el.querySelector(".small");
            const large = pattern_el.querySelector(".large");
            expect($(large).height()).toBe(100);
            expect(large.classList.contains("equalised")).toBe(true);
            expect($(small).height()).toBe(100);
            expect(small.classList.contains("equalised")).toBe(true);
        });

        it("Ignores inline styles.", async function () {
            // This is necessary so we do not get fooled by the height we
            // set ourselves.
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div class="small" style="height: 200px"></div>
                    <div class="large" style="height: 200px"></div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);

            expect($(pattern_el.querySelector(".small")).height()).toBe(100);
            expect($(pattern_el.querySelector(".large")).height()).toBe(100);
        });

        it("Triggers pat-update after equalisation.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div class="small"></div>
                    <div class="large"></div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");

            let data = null;
            $(pattern_el).on("pat-update", (e, d) => {
                data = d;
            });

            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);

            expect(data.pattern).toBe("equaliser");
            expect(data.action).toBe("attribute-changed");
            expect(data.dom).toBe(pattern_el);
        });
    });

    describe("init", function () {
        it("Equalises on initialization.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div class="small"></div>
                    <div class="large"></div>
                </div>
            `;
            const spy_update = jest.spyOn(Pattern.prototype, "update");
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);

            expect(spy_update).toHaveBeenCalledTimes(1);
        });

        it("Re-equalises after an image has been loaded or failed loading.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div><img src="a.png" /></div>
                    <div><img src="b.png" /></div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);
            await utils.timeout(150); // wait for the debounced observer.

            const spy_update = jest.spyOn(instance, "update");
            const [img1, img2] = pattern_el.querySelectorAll("img");

            img1.dispatchEvent(new Event("load"));
            await utils.timeout(150); // debounce
            expect(spy_update).toHaveBeenCalledTimes(1);

            img2.dispatchEvent(new Event("error"));
            await utils.timeout(150); // debounce
            expect(spy_update).toHaveBeenCalledTimes(2);
        });

        it("Re-equalises when the window is resized.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div></div>
                    <div></div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);
            await utils.timeout(150); // wait for the debounced observer.

            const spy_update = jest.spyOn(instance, "update");

            window.dispatchEvent(new Event("resize"));
            await utils.timeout(150); // debounce
            expect(spy_update).toHaveBeenCalledTimes(1);
        });

        it("Re-equalises when the DOM changes.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div></div>
                    <div></div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);
            await utils.timeout(150); // wait for the debounced observer.

            const spy_update = jest.spyOn(instance, "update");

            pattern_el.children[0].innerHTML = "<p>new content</p>";
            await utils.timeout(150); // debounce
            expect(spy_update).toHaveBeenCalledTimes(1);
        });

        it("Re-equalises when other code changes the class of a direct child.", async function () {
            // E.g. a column which is opened by a class on itself.
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div></div>
                    <div></div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);
            await utils.timeout(150); // wait for the debounced observer.

            const spy_update = jest.spyOn(instance, "update");

            pattern_el.children[0].classList.add("open");
            await utils.timeout(150); // debounce
            expect(spy_update).toHaveBeenCalledTimes(1);
        });

        it("Re-equalises when other code changes the style of a direct child.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div></div>
                    <div></div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);
            await utils.timeout(150); // wait for the debounced observer.

            const spy_update = jest.spyOn(instance, "update");

            pattern_el.children[0].style.padding = "20px";
            await utils.timeout(150); // debounce
            expect(spy_update).toHaveBeenCalledTimes(1);
        });

        it("Does not re-equalise because of its own changes with the grow transition.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: grow; effect-duration: 50">
                    <div class="small"></div>
                    <div class="large"></div>
                </div>
            `;
            const spy_update = jest.spyOn(Pattern.prototype, "update");
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);

            await utils.timeout(500);
            // Animation done.
            expect(
                pattern_el.querySelector(".small").classList.contains("equalised"),
            ).toBe(true);
            // Only the initial update.
            expect(spy_update).toHaveBeenCalledTimes(1);
        });

        it("Does not re-equalise because of its own changes.", async function () {
            document.body.innerHTML = `
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div></div>
                    <div></div>
                </div>
                <div class="pat-equaliser" data-pat-equaliser="transition: none">
                    <div></div>
                    <div></div>
                </div>
            `;
            const spy_update = jest.spyOn(Pattern.prototype, "update");
            const [el1, el2] = document.querySelectorAll(".pat-equaliser");
            const instance1 = new Pattern(el1);
            const instance2 = new Pattern(el2);
            await events.await_pattern_init(instance1);
            await events.await_pattern_init(instance2);

            // Initial update for both.
            expect(spy_update).toHaveBeenCalledTimes(2);

            await utils.timeout(500);
            // No further updates.
            expect(spy_update).toHaveBeenCalledTimes(2);
        });
    });

    describe("destroy", function () {
        it("Stops updating when the element was removed.", async function () {
            document.body.innerHTML = `
                <div id="section">
                    <div class="pat-equaliser" data-pat-equaliser="transition: none">
                        <div><img src="a.png" /></div>
                        <div></div>
                    </div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");
            const img = pattern_el.querySelector("img");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);
            await utils.timeout(150); // wait for the debounced observer.

            const spy_update = jest.spyOn(instance, "update");
            const spy_disconnect = jest.spyOn(instance.observer, "disconnect");

            document.querySelector("#section").remove();
            await utils.timeout(1); // wait a tick for the lifecycle observer.

            expect(instance.destroyed).toBe(true);
            expect(spy_disconnect).toHaveBeenCalled();

            window.dispatchEvent(new Event("resize"));
            img.dispatchEvent(new Event("load"));
            document.body.innerHTML = "<p>other content</p>";
            await utils.timeout(150); // debounce

            expect(spy_update).not.toHaveBeenCalled();
        });

        it("Does not run a pending update after the element was removed.", async function () {
            document.body.innerHTML = `
                <div id="section">
                    <div class="pat-equaliser" data-pat-equaliser="transition: none">
                        <div></div>
                        <div></div>
                    </div>
                </div>
            `;
            const pattern_el = document.querySelector(".pat-equaliser");
            const instance = new Pattern(pattern_el);
            await events.await_pattern_init(instance);
            await utils.timeout(150); // wait for the debounced observer.

            const spy_update = jest.spyOn(instance, "update");

            // Schedule a debounced update, then remove the element.
            window.dispatchEvent(new Event("resize"));
            document.querySelector("#section").remove();
            await utils.timeout(150); // debounce

            expect(instance.destroyed).toBe(true);
            expect(spy_update).not.toHaveBeenCalled();
        });
    });
});
