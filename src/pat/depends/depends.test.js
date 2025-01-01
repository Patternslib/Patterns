import $ from "jquery";
import pattern from "./depends";
import utils from "../../core/utils";

describe("pat-depends", function () {
    describe("1 - init", function () {
        beforeEach(function () {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function () {
            $("#lab").remove();
        });

        it("Hide if condition is not met initially", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes"/>',
                    '<div id="dependent" class="pat-depends"/>',
                ].join("\n")
            );

            const el = document.querySelector(".pat-depends");
            new pattern(el, { condition: "control" });
            await utils.timeout(1); // wait a tick for async to settle.

            expect($(el).css("display")).toBe("none");
        });

        it("Show if condition is not met initially", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<div id="dependent" class="pat-depends" style="display: none"/>',
                ].join("\n")
            );

            const el = document.querySelector(".pat-depends");
            new pattern(el, { condition: "control" });
            await utils.timeout(1); // wait a tick for async to settle.

            expect($(el).css("display")).not.toBe("none");
        });
    });

    describe("2 - disable", function () {
        beforeEach(function () {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function () {
            $("#lab").remove();
        });

        it("Input element", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<button id="dependent" class="pat-depends" type="button">Click me</button>',
                ].join("\n")
            );

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el, { condition: "control" });
            await utils.timeout(1); // wait a tick for async to settle.

            instance.disable();
            expect(el.disabled).toBeTruthy();
            expect(el.classList.contains("disabled")).toBe(true);
        });

        it("Anchor", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<a class="pat-depends" href="#target">Click me</a>',
                ].join("\n")
            );

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el, { condition: "control" });
            await utils.timeout(1); // wait a tick for async to settle.

            instance.disable();
            expect(el.classList.contains("disabled")).toBe(true);
        });
    });

    describe("3 - enable", function () {
        beforeEach(function () {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function () {
            $("#lab").remove();
        });

        it("Input element", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<button disabled="disabled" class="pat-depends disabled" type="button">Click me</button>',
                ].join("\n")
            );

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el, { condition: "control" });
            await utils.timeout(1); // wait a tick for async to settle.

            instance.enable();
            expect(el.disabled).toBeFalsy();
            expect(el.classList.contains("disabled")).toBe(false);
        });

        it("Anchor", async function () {
            $("#lab").html(
                [
                    '<input type="checkbox" id="control" value="yes" checked="checked"/>',
                    '<a href="#target" class="pat-depends disabled">Click me</a>',
                ].join("\n")
            );

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el, { condition: "control" });
            await utils.timeout(1); // wait a tick for async to settle.

            instance.enable();
            expect(el.classList.contains("disabled")).toBe(false);
        });
    });

    describe("4 - pat-update", function () {
        it("4.1 - Throw pat-update on enabling", async function () {
            document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                    checked="checked"/>
                <button
                    id="dependent"
                    type="button"
                    class="pat-depends"
                    data-pat-depends="condition: control"
                    >Click me</button>
            `;
            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let data;
            $(el).on("pat-update", (e, d) => {
                data = d;
            });
            instance.enable();
            expect(data.pattern).toBe("depends");
            expect(data.action).toBe("attribute-changed");
            expect(data.dom).toBe(el);
            expect(data.enabled).toBe(true);
        });
        it("4.2 - Throw pat-update on disabling", async function () {
            document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                    checked="checked"/>
                <button
                    id="dependent"
                    type="button"
                    class="pat-depends"
                    data-pat-depends="condition: control"
                    >Click me</button>
            `;
            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let data;
            $(el).on("pat-update", (e, d) => {
                data = d;
            });
            instance.disable();
            expect(data.pattern).toBe("depends");
            expect(data.action).toBe("attribute-changed");
            expect(data.dom).toBe(el);
            expect(data.enabled).toBe(false);
        });
    });
});
