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

    it("wraps the collapsible within a div.panel-content", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>
        `;

        var $collapsible = $(".pat-collapsible");
        pattern.init($collapsible);
        expect($collapsible.find(".panel-content").length).toBe(1);
    });

    it("is open by default", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>
        `;

        var $collapsible = $(".pat-collapsible");
        pattern.init($collapsible);
        expect($collapsible.hasClass("open")).toBeTruthy();
    });

    it("can be explicitly closed by adding the class 'closed'", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible closed">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>"
        `;

        var $collapsible = $(".pat-collapsible");
        pattern.init($collapsible);
        expect($collapsible.hasClass("open")).toBeFalsy();
    });

    it("can be toggled closed if it's open", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>
        `;

        var $collapsible = $(".pat-collapsible");
        var pat = pattern.init($collapsible, { transition: "none" });
        pat.toggle($collapsible);
        expect($collapsible.hasClass("open")).toBe(false);
        expect($collapsible.hasClass("closed")).toBe(true);
        var $trigger = $("h3");
        expect($trigger.hasClass("collapsible-open")).toBe(false);
        expect($trigger.hasClass("collapsible-closed")).toBe(true);
    });

    it("can be toggled open if it's closed", function () {
        document.body.innerHTML = `
            <div class="pat-collapsible closed">
                <h3>Trigger header</h3>
                <p>Collapsible content</p>
            </div>
        `;
        var $collapsible = $(".pat-collapsible");
        var pat = pattern.init($collapsible, { transition: "none" });
        pat.toggle($collapsible);
        expect($collapsible.hasClass("open")).toBe(true);
        expect($collapsible.hasClass("closed")).toBe(false);
        var $trigger = $("h3");
        expect($trigger.hasClass("collapsible-open")).toBe(true);
        expect($trigger.hasClass("collapsible-closed")).toBe(false);
    });

    it("can be configured to have trigger which only opens it", async function () {
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

    it("can be configured to have trigger which only closes it", async function () {
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

    describe("scrolling", function () {
        it("can scroll to itself when opened.", async function () {
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

        it("does not scroll when being closed.", async function () {
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

        it("only scrolls once even if multiple collapsible are opened at once.", async function () {
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
    });
});
