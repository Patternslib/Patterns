import $ from "jquery";
import dom from "../../core/dom";
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
            document.body.innerHTML = "";
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

        it("Throw an input event for any contained inputs.", async function () {
             document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                    />
                <fieldset
                    class="pat-depends"
                    data-pat-depends="condition: control; action: both"
                >
                    <input disabled />
                </fieldset>
            `;

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let called = false;
            el.addEventListener("input", () => {
                called = true;
            });

            instance.enable();
            utils.timeout(1); // wait a tick for async to settle.

            expect(called).toBe(true);
        });

        it("Do not throw an input event on the element itself.", async function () {
             document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                    />
                <input
                    class="pat-depends"
                    data-pat-depends="condition: control; action: both"
                    disabled
                    />
            `;

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let called = false;
            el.addEventListener("input", () => {
                called = true;
            });

            instance.enable();
            utils.timeout(1); // wait a tick for async to settle.

            expect(called).toBe(false);
        });
    });

    describe("3 - enable", function () {
        beforeEach(function () {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function () {
            document.body.innerHTML = "";
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

        it("Throw an input event for any contained inputs.", async function () {
             document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                    checked
                    />
                <fieldset
                    class="pat-depends"
                    data-pat-depends="condition: control; action: both"
                >
                    <input />
                </fieldset>
            `;

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let called = false;
            el.addEventListener("input", () => {
                called = true;
            });

            instance.disable();
            utils.timeout(1); // wait a tick for async to settle.

            expect(called).toBe(true);
        });

        it("Do not throw an input event on the element itself.", async function () {
             document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                    checked
                    />
                <input
                    class="pat-depends"
                    data-pat-depends="condition: control; action: both"
                    />
            `;

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let called = false;
            el.addEventListener("input", () => {
                called = true;
            });

            instance.disable();
            utils.timeout(1); // wait a tick for async to settle.

            expect(called).toBe(false);
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

    describe("5 - Support pat-depends within a pat-depends controlled tree.", function () {

        it("Also updates pat-depends within a pat-depends controlled tree", async function () {

            document.body.innerHTML = `
                <div data-pat-depends="action: both">
                    <label>
                        <input
                            name="show-tree"
                            type="checkbox"
                        />
                        show
                    </label>

                    <fieldset
                        class="dep1 pat-depends"
                        data-pat-depends="condition: show-tree"
                    >
                        <label>
                            <input
                                name="extra"
                                type="checkbox"
                            />
                            Extra
                        </label>
                    </fieldset>

                    <!-- This pat-depends node controlled by a checkbox which is
                         within another pat-depends controlled tree.
                    -->
                    <p
                        class="dep2 pat-depends"
                        data-pat-depends="condition: extra"
                    >
                        You shose extra!
                    </p>
                </div>
            `;

            const dep1 = document.querySelector(".dep1");
            new pattern(dep1);
            await utils.timeout(1); // wait a tick for async to settle.
            const dep2 = document.querySelector(".dep2");
            new pattern(dep2);
            await utils.timeout(1); // wait a tick for async to settle.

            const button1 = document.querySelector("[name=show-tree]");
            const button2 = document.querySelector("[name=extra]");

            button1.checked = true;
            button1.dispatchEvent(new Event("input"));
            button2.checked = true;
            button2.dispatchEvent(new Event("input"));

            expect(dom.is_visible(dep1)).toBe(true);
            expect(dom.is_visible(dep2)).toBe(true);


            // Even though button2 is still checked, the visibility of dep2 is
            // hidden.
            button1.checked = false;
            button1.dispatchEvent(new Event("input"));

            expect(dom.is_visible(dep1)).toBe(false);
            expect(dom.is_visible(dep2)).toBe(false);
        });

    });

    describe("6 - Prevent various infinite loop situations", function () {

        it("6.1 - Do not call set_state multiple times.", async function () {
             document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                    checked
                />
                <input
                    class="pat-depends"
                    data-pat-depends="condition: control; action: both"
                    />
            `;

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.
            const spy = jest.spyOn(instance, "set_state");

            const checkbox = document.querySelector("#control");
            checkbox.click();

            utils.timeout(1); // wait a tick for async to settle.
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("6.2 - Do not enable already enabled inputs.", async function () {

             document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                    checked
                />
                <fieldset
                    class="pat-depends"
                    data-pat-depends="condition: control; action: both"
                >
                    <input />
                </fieldset>
            `;

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let called = false;
            el.addEventListener("input", () => {
                called = true;
            });

            instance.enable();
            utils.timeout(1); // wait a tick for async to settle.

            expect(called).toBe(false);
        });

        it("6.3 - Do not disable already disabled inputs.", async function () {

             document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                />
                <fieldset
                    class="pat-depends"
                    data-pat-depends="condition: control; action: both"
                >
                    <input disabled />
                </fieldset>
            `;

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let called = false;
            el.addEventListener("input", () => {
                called = true;
            });

            instance.disable();
            utils.timeout(1); // wait a tick for async to settle.

            expect(called).toBe(false);
        });

        it("6.4 - Do not throw the input event on buttons when enabling.", async function () {

             document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                />
                <fieldset
                    class="pat-depends"
                    data-pat-depends="condition: control; action: both"
                >
                    <button />
                </fieldset>
            `;

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let called = false;
            el.addEventListener("input", () => {
                called = true;
            });

            instance.enable();
            utils.timeout(1); // wait a tick for async to settle.

            expect(called).toBe(false);
        });

        it("6.5 - Do not throw the input event on buttons when disabling.", async function () {

             document.body.innerHTML = `
                <input
                    type="checkbox"
                    id="control"
                    value="yes"
                    checked
                />
                <fieldset
                    class="pat-depends"
                    data-pat-depends="condition: control; action: both"
                >
                    <button />
                </fieldset>
            `;

            const el = document.querySelector(".pat-depends");
            const instance = new pattern(el);
            await utils.timeout(1); // wait a tick for async to settle.

            let called = false;
            el.addEventListener("input", () => {
                called = true;
            });

            instance.disable();
            utils.timeout(1); // wait a tick for async to settle.

            expect(called).toBe(false);
        });


    });
});
