import registry from "../../core/registry";
import pattern from "./collapsible";
import utils from "../../core/utils";
import $ from "jquery";

describe("pat-collapsible", function () {
    afterEach(function () {
        document.body.innerHTML = "";
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
});
