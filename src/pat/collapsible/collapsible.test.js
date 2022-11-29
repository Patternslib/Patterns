import registry from "../../core/registry";
import pattern from "./collapsible";
import utils from "../../core/utils";
import $ from "jquery";
import { jest } from "@jest/globals";

describe("pat-collapsible", function () {
    afterEach(function () {
        document.body.innerHTML = "";
        jest.restoreAllMocks();
    });

    it("1- wraps the collapsible within a div.panel-content", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>
        `;

        const $collapsible = $(".pat-collapsible");
        pattern.init($collapsible);
        expect($collapsible.find(".panel-content").length).toBe(1);
    });

    it("2 - is open by default", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>
        `;

        const $collapsible = $(".pat-collapsible");
        pattern.init($collapsible);
        expect($collapsible.hasClass("open")).toBeTruthy();
    });

    it("3 - can be explicitly closed by adding the class 'closed'", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible closed">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>"
        `;

        const $collapsible = $(".pat-collapsible");
        pattern.init($collapsible);
        expect($collapsible.hasClass("open")).toBeFalsy();
    });

    it("4 - can be toggled closed if it's open", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>
        `;

        const $collapsible = $(".pat-collapsible");
        const pat = pattern.init($collapsible, { transition: "none" });
        pat.toggle($collapsible);
        expect($collapsible.hasClass("open")).toBe(false);
        expect($collapsible.hasClass("closed")).toBe(true);
        const $trigger = $("h3");
        expect($trigger.hasClass("collapsible-open")).toBe(false);
        expect($trigger.hasClass("collapsible-closed")).toBe(true);
    });

    it("5 - can be toggled open if it's closed", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible closed">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>
        `;
        const $collapsible = $(".pat-collapsible");
        const pat = pattern.init($collapsible, { transition: "none" });
        pat.toggle($collapsible);
        expect($collapsible.hasClass("open")).toBe(true);
        expect($collapsible.hasClass("closed")).toBe(false);
        const $trigger = $("h3");
        expect($trigger.hasClass("collapsible-open")).toBe(true);
        expect($trigger.hasClass("collapsible-closed")).toBe(false);
    });

    it("6 - can be configured to have trigger which only opens it", async function () {
        document.body.innerHTML = `
            <div class="closed pat-collapsible" data-pat-collapsible="open-trigger: #open">
                <button>toggle</button>
                <p>Collapsible content</p>
                <button id="open">open</button>
            </div>
        `;
        const $collapsible = $(".pat-collapsible");
        registry.scan($collapsible);
        expect($collapsible.hasClass("open")).toBe(false);
        expect($collapsible.hasClass("closed")).toBe(true);
        $("#open").click();
        await utils.timeout(500);
        expect($collapsible.hasClass("open")).toBe(true);
        expect($collapsible.hasClass("closed")).toBe(false);
    });

    it("7 - can be configured to have trigger which only closes it", async function () {
        document.body.innerHTML = `
            <div class="pat-collapsible" data-pat-collapsible="close-trigger: #close">
                <button>toggle</button>
                <p>Collapsible content</p>
                <button id="close">close</button>
            </div>
        `;
        const $collapsible = $(".pat-collapsible");
        registry.scan($collapsible);
        expect($collapsible.hasClass("closed")).toBe(false);
        expect($collapsible.hasClass("open")).toBe(true);
        $("#close").click();
        await utils.timeout(500);
        expect($collapsible.hasClass("closed")).toBe(true);
        expect($collapsible.hasClass("open")).toBe(false);
    });

    describe("8 - scrolling", function () {
        it("8.1 - can scroll to itself when opened.", async function () {
            document.body.innerHTML = `
            <div class="pat-collapsible closed" data-pat-collapsible="scroll-selector: self">
                <p>Collapsible content</p>
            </div>
        `;
            const collapsible = document.querySelector(".pat-collapsible");
            const pat = pattern.init(collapsible);
            const spy_scroll = jest.spyOn(pat, "_scroll");

            pat.toggle();
            await utils.timeout(10);

            expect(spy_scroll).toHaveBeenCalledTimes(1);
        });

        it("8.2 - does not scroll when being closed.", async function () {
            document.body.innerHTML = `
            <div class="pat-collapsible opened" data-pat-collapsible="scroll-selector: self">
                <p>Collapsible content</p>
            </div>
        `;
            const collapsible = document.querySelector(".pat-collapsible");
            const pat = pattern.init(collapsible);
            const spy_scroll = jest.spyOn(pat, "_scroll");

            pat.toggle();
            await utils.timeout(10);

            expect(spy_scroll).not.toHaveBeenCalled();
        });

        it("8.3 - only scrolls once even if multiple collapsible are opened at once.", async function () {
            document.body.innerHTML = `
                <button class="pat-button" id="open">Open All</button>
                <div class="pat-collapsible closed c1" data-pat-collapsible="scroll-selector: self; open-trigger: #open; transition: none">
                    <p>Collapsible content</p>
                </div>
                <div class="pat-collapsible closed c2" data-pat-collapsible="scroll-selector: self; open-trigger: #open; transition: none">
                    <p>Collapsible content</p>
                </div>
                <div class="pat-collapsible closed c3" data-pat-collapsible="scroll-selector: self; open-trigger: #open; transition: none">
                    <p>Collapsible content</p>
                </div>
            `;

            registry.scan(document.body);
            const spy_animate = jest.spyOn($.fn, "animate");

            document.querySelector("#open").click();
            await utils.timeout(30);

            expect(document.querySelector(".c1").classList.contains("open")).toBeTruthy(); // prettier-ignore
            expect(document.querySelector(".c2").classList.contains("open")).toBeTruthy(); // prettier-ignore
            expect(document.querySelector(".c3").classList.contains("open")).toBeTruthy(); // prettier-ignore

            // Other calls to _scroll resp. jQuery.animate should have been canceled.
            expect(spy_animate).toHaveBeenCalledTimes(1);
        });

        it("8.4 - can scroll to itself when opened with an offset.", async function () {
            document.body.innerHTML = `
                <div class="pat-collapsible closed" data-pat-collapsible="scroll-selector: self; scroll-offset: 40; transition: none">
                    <p>Collapsible content</p>
                </div>
            `;
            const collapsible = document.querySelector(".pat-collapsible");
            const pat = pattern.init(collapsible);
            const spy_animate = jest.spyOn($.fn, "animate");

            pat.toggle();
            await utils.timeout(10);

            const arg_1 = spy_animate.mock.calls[0][0];
            expect(arg_1.scrollTop).toBe(-40); // the offset is substracted from the scroll position to stop BEFORE the target position.
        });

        it("8.5 - can scroll to itself when opened with a negative offset.", async function () {
            document.body.innerHTML = `
                <div class="pat-collapsible closed" data-pat-collapsible="scroll-selector: self; scroll-offset: -40; transition: none">
                    <p>Collapsible content</p>
                </div>
            `;
            const collapsible = document.querySelector(".pat-collapsible");
            const pat = pattern.init(collapsible);
            const spy_animate = jest.spyOn($.fn, "animate");

            pat.toggle();
            await utils.timeout(10);

            const arg_1 = spy_animate.mock.calls[0][0];
            expect(arg_1.scrollTop).toBe(40); // the offset is substracted from the scroll position, so a negative offset is added to the scroll position and stops AFTER the target position.
        });
    });
});
