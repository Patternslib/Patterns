import pattern from "./switch";
import $ from "jquery";
import { jest } from "@jest/globals";
import utils from "../../core/utils";

describe("pat-switch", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        document.body.innerHTML = "";
    });

    describe("When the switch is clicked", function () {
        describe("if the switch is a hyperlink", function () {
            it("the default click action is prevented", async function () {
                document.body.innerHTML = `
                    <a
                        href=""
                        class="pat-switch"
                        data-pat-switch="#lab on off">test</a>
                `;
                const el = document.querySelector("a");

                const instance = new pattern(el);
                await utils.timeout(1);
                const spy_go = jest.spyOn(instance, "_go");

                const ev = new Event("click");
                ev.tagName = "A";
                const spy_preventDefault = jest.spyOn(ev, "preventDefault");

                el.dispatchEvent(ev);

                expect(spy_go).toHaveBeenCalled();
                expect(spy_preventDefault).toHaveBeenCalled();
            });
        });

        describe("if the switch is not a hyperlink", function () {
            it("the default click action is not prevented", async function () {
                document.body.innerHTML = `
                    <button
                        class="pat-switch"
                        data-pat-switch="#lab on off">test</button>
                `;
                const el = document.querySelector("button");

                const instance = new pattern(el);
                await utils.timeout(1);
                const spy_go = jest.spyOn(instance, "_go");

                const ev = new Event("click");
                ev.tagName = "BUTTON";
                const spy_preventDefault = jest.spyOn(ev, "preventDefault");

                el.dispatchEvent(ev);

                expect(spy_go).toHaveBeenCalled();
                expect(spy_preventDefault).not.toHaveBeenCalled();
            });
        });
    });

    describe("_validateOptions", function () {
        it("Bad options", function () {
            const instance = new pattern(document.createElement("div"));
            const options = instance._validateOptions([{}]);
            expect(options).toEqual([]);
        });

        it("Mix valid and invalid options", function () {
            const instance = new pattern(document.createElement("div"));
            const options = instance._validateOptions([
                { selector: "#valid", add: "purple" },
                {},
            ]);
            expect(options.length).toBe(1);
            expect(options[0]).toEqual({
                selector: "#valid",
                add: "purple",
            });
        });
    });

    describe("_update", function () {
        it("Remove basic class", function () {
            document.body.innerHTML = `
                <div class="on"></div>
            `;
            const instance = new pattern(document.createElement("div"));
            instance._update("body div", "on");
            expect(document.querySelector("body div").classList.contains("on")).toBe(
                false
            );
        });

        it("Remove wildcard postfix class", function () {
            document.body.innerHTML = `
                <div class="icon-small"></div>
            `;
            const instance = new pattern(document.createElement("div"));
            instance._update("body div", "icon-*");
            expect(document.querySelector("body div").getAttribute("class")).toBeFalsy();
        });

        it("Add class", function () {
            document.body.innerHTML = "<div></div>";
            const instance = new pattern(document.createElement("div"));
            instance._update("body div", null, "icon-alert");
            expect(
                document.querySelector("body div").classList.contains("icon-alert")
            ).toBe(true);
        });

        it("Send pat-update event", function () {
            document.body.innerHTML = "<div></div>";
            const target = document.querySelector("body div");
            const instance = new pattern(document.createElement("div"));
            const spy_trigger = jest.spyOn($.fn, "trigger");
            instance._update("body div", null, "icon-alert");
            expect(target.classList.contains("icon-alert")).toBe(true);
            expect(spy_trigger).toHaveBeenCalledWith("pat-update", {
                pattern: "switch",
                action: "attribute-changed",
                dom: target,
            });
        });
    });

    describe("jQuery plugin usage", function () {
        describe("Initialise via jQuery", function () {
            it("Specify defaults via API", async function () {
                document.body.innerHTML = `
                    <button>Click me</button>
                `;
                $("body button").patternSwitch({
                    selector: "#target",
                    add: "pink",
                });
                await utils.timeout(1);
                const $trigger = $("body button");
                const instance = $trigger.data("pattern-switch");
                expect(instance.options).toEqual([
                    { store: "none", selector: "#target", add: "pink" },
                ]);
            });

            it("Invalid defaults via API", async function () {
                document.body.innerHTML = `
                    <button>Click me</button>
                `;
                $("body button").patternSwitch({ selector: "#target" });
                await utils.timeout(1);
                const $trigger = $("body button");
                const instance = $trigger.data("pattern-switch");
                expect(instance.options).toEqual([]);
            });

            it("Parse defaults from DOM", async function () {
                document.body.innerHTML = `
                    <button data-pat-switch="#target foo bar">Click me</button>
                `;
                $("body button").patternSwitch();
                await utils.timeout(1);
                const $trigger = $("body button");
                const instance = $trigger.data("pattern-switch");
                expect(instance.options).toEqual([
                    {
                        store: "none",
                        selector: "#target",
                        remove: "foo",
                        add: "bar",
                    },
                ]);
            });

            it("Setup click event handler", async function () {
                document.body.innerHTML = `
                    <button data-pat-switch="#target foo">Click me</button>
                `;
                $("body button").patternSwitch();
                await utils.timeout(1);
                const $trigger = $("body button");
                const instance = $trigger.data("pattern-switch");
                const spy_go = jest.spyOn(instance, "_go").mockImplementation(() => {});
                $trigger.click();
                expect(spy_go).toHaveBeenCalled();
            });
        });

        it("Execute changes via 'execute' API", async function () {
            document.body.innerHTML = `
                <button data-pat-switch="#target foo">Click me</button>
                <div id="target" class="foo bar">ok</div>
            `;
            $("body button").patternSwitch();
            await utils.timeout(1);
            const $trigger = $("body button");
            $trigger.patternSwitch("execute");
            expect($("#target").hasClass("foo")).toBe(false);
            expect($("#target").hasClass("bar")).toBe(true);
        });

        it("Destroy all hooks", async function () {
            document.body.innerHTML = `
                <button data-pat-switch="#target foo">Click me</button>
                <div id="target" class="foo bar">ok</div>
            `;
            $("body button").patternSwitch();
            await utils.timeout(1);
            const $trigger = $("body button");
            $trigger.patternSwitch("destroy");
            $trigger.click();
            expect($("#target").hasClass("foo")).toBe(true);
            expect($("#target").hasClass("bar")).toBe(true);
        });
    });
});
