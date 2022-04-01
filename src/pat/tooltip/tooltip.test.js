import $ from "jquery";
import autosubmit from "../auto-submit/auto-submit";
import pattern from "./tooltip";
import registry from "../../core/registry";
import utils from "../../core/utils";
import { jest } from "@jest/globals";

const mockFetch =
    (text = "") =>
    () =>
        Promise.resolve({
            text: () => Promise.resolve(text),
        });

const testutils = {
    createTooltip(c) {
        var cfg = c || {};
        if (!cfg.content) {
            cfg.content = "testing 1 2 3";
        }
        return $("<a/>", {
            "id": cfg.id || "tooltip",
            "href": cfg.href || "#anchor",
            "title": cfg.title || "tooltip title attribute",
            "data-pat-tooltip": "" || cfg.data,
            "class": "pat-tooltip",
        })
            .text(cfg.content)
            .appendTo($("div#lab"));
    },

    createTooltipSource() {
        return $(
            `<span style='display: none' id='tooltip-source'>` +
                "<strong>Local content</strong></span>"
        ).appendTo($("div#lab"));
    },

    dispatchEvent($target, event_name) {
        $target[0].dispatchEvent(new Event(event_name));
    },

    click($target) {
        testutils.dispatchEvent($target, "click");
    },

    mouseenter($target) {
        testutils.dispatchEvent($target, "mouseenter");
    },

    mouseleave($target) {
        testutils.dispatchEvent($target, "mouseleave");
    },
};

describe("pat-tooltip", () => {
    beforeEach(() => {
        document.body.innerHTML = `<div id="lab"></div>`;
    });

    afterEach(() => {
        jest.restoreAllMocks();
        document.body.innerHTML = "";
    });

    describe("1 - A tooltip", () => {
        it("1.1 - always gets the ``tooltip-container`` class set", async () => {
            const $el = testutils.createTooltip({
                data: "trigger: click",
                title: "tooltip",
            });
            const instance = new pattern($el);
            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1);

            expect(
                instance.tippy.popper.classList.contains("tooltip-container")
            ).toBeTruthy();
        });

        describe('1.2 - if the "class" parameter exists', () => {
            it("1.2.1 - will assign a class to the tooltip container", async () => {
                const $el = testutils.createTooltip({
                    data: "source: title; trigger: hover; class: wasabi",
                });
                const el = $el[0];
                const title = el.title;

                const instance = new pattern($el);
                await utils.timeout(1);

                // NOTE 1:
                // spy on tippy instance's "onShow", which holds the reference
                // to the original implementation of the pattern.
                // mocking instance._onShow itself doesn't replace the tippy
                // instance's implementation.
                // NOTE 2:
                // spu on "onShow" because "onShown" isn't reached due to CSS
                // animations won't work in jsDOM.
                const spy_show = jest.spyOn(instance.tippy.props, "onShow");

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                const container = document.querySelectorAll(".tooltip-container");
                expect(container.length).toEqual(1);
                expect(container[0].classList.contains("wasabi")).toBeTruthy();
                const expected =
                    container[0].querySelector(".tippy-content").textContent;
                expect(expected).toBe(title);

                spy_show.mockRestore();
            });

            it("1.2.2 - and only to the corresponding container", async () => {
                const $el1 = testutils.createTooltip({
                    data: "source: title; trigger: click; class: wasabi",
                    id: "tooltip1",
                    title: "tooltip1",
                });
                const $el2 = testutils.createTooltip({
                    data: "source: title; trigger: click",
                    id: "tooltip2",
                    title: "tooltip2",
                });

                new pattern($el1);
                new pattern($el2);
                await utils.timeout(1);

                let container;

                testutils.click($el1);
                await utils.timeout(1);

                container = document.querySelectorAll(".tooltip-container");
                expect(container.length).toEqual(1);
                expect(container[0].classList.contains("wasabi")).toBeTruthy();

                testutils.click($el2);
                await utils.timeout(1);

                container = document.querySelectorAll(".tooltip-container");
                expect(container.length).toEqual(2);
                expect(container[1].classList.contains("wasabi")).toBeFalsy();
            });

            it("1.2.3 - with multiple values, all will be applied.", async () => {
                const $el = testutils.createTooltip({
                    data: "source: title; trigger: click; class: wasabi kohlrabi",
                });
                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tooltip-container");
                expect(container.classList.contains("wasabi")).toBeTruthy();
                expect(container.classList.contains("kohlrabi")).toBeTruthy();
                expect(container.classList.contains("tooltip-container")).toBeTruthy();
            });
        });

        describe('1.3 - if the "delay" parameter exists', () => {
            it("1.3.1 - will wait accordingly before showing the tooltip", async () => {
                testutils.createTooltip({
                    data: "delay: 500; trigger: hover",
                });
                const el = document.querySelector("a.pat-tooltip");
                const $el = $(el);
                const title = el.title;
                const instance = new pattern($el);
                await utils.timeout(1);

                const timer = {};

                const spy_trigger = jest.spyOn(instance.tippy.props, "onTrigger");
                spy_trigger.mockImplementation(() => (timer["onTrigger"] = Date.now()));
                const spy_show = jest.spyOn(instance.tippy.props, "onShow");
                spy_show.mockImplementation(() => (timer["onShow"] = Date.now()));

                testutils.mouseenter($el);
                await utils.timeout(1000);

                expect(spy_show).toHaveBeenCalled();
                const container = document.querySelectorAll(".tippy-box");
                expect(container.length).toEqual(1);
                const expected =
                    container[0].querySelector(".tippy-content").textContent;
                expect(expected).toBe(title);
                const duration = timer["onShow"] - timer["onTrigger"];
                expect(duration / 500).toBeCloseTo(1, 1);

                spy_show.mockRestore();
                spy_trigger.mockRestore();
            });
        });
    });

    describe("2 - Tooltip closing behavior", () => {
        describe("2.1 - with the default `closing: auto`", () => {
            it("2.1.1 - with `trigger: click` it will only close when clicking outside the tooltip element", async () => {
                const $el = testutils.createTooltip({
                    data: "trigger: click; closing: auto",
                });
                const instance = new pattern($el);
                await utils.timeout(1);

                const tp = instance.tippy.props;
                const spy_show = jest.spyOn(tp, "onShow");
                const spy_hide = jest.spyOn(tp, "onHide");

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).not.toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.click($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.mouseleave($el);
                await utils.timeout(50);
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.click($el);
                await utils.timeout(50);
                expect(spy_hide).toHaveBeenCalled();

                spy_show.mockRestore();
                spy_hide.mockRestore();
            });

            it("2.1.2 - with `trigger: hover` it will close when hovering outside the tooltip element", async () => {
                const $el = testutils.createTooltip({
                    data: "trigger: hover; closing: auto",
                });
                const instance = new pattern($el);
                await utils.timeout(1);

                const tp = instance.tippy.props;
                const spy_show = jest.spyOn(tp, "onShow");
                const spy_hide = jest.spyOn(tp, "onHide");

                // Shortcut any checks for mouse positions and just hide.
                const spy_inter = jest
                    .spyOn(instance.tippy, "hideWithInteractivity")
                    .mockImplementation(instance.tippy.hide);

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.mouseleave($el);
                await utils.timeout(1);
                expect(spy_hide).toHaveBeenCalled();

                spy_show.mockRestore();
                spy_hide.mockRestore();
                spy_inter.mockRestore();
            });
        });

        describe("2.2 - with `closing: sticky`", () => {
            it("2.2.1 - with `trigger: click` there is no change in the closing behavior", async () => {
                const $el = testutils.createTooltip({
                    data: "trigger: click; closing: sticky",
                });
                const instance = new pattern($el);
                await utils.timeout(1);

                const tp = instance.tippy.props;
                const spy_show = jest.spyOn(tp, "onShow");
                const spy_hide = jest.spyOn(tp, "onHide");

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).not.toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.click($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.mouseleave($el);
                await utils.timeout(50);
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.click($el);
                await utils.timeout(50);
                expect(spy_hide).toHaveBeenCalled();

                spy_show.mockRestore();
                spy_hide.mockRestore();
            });

            it("2.2.2 - with `trigger: hover` the tooltip is only closed when clicking outside", async () => {
                const $el = testutils.createTooltip({
                    data: "trigger: hover; closing: sticky",
                });
                const instance = new pattern($el);
                await utils.timeout(1);

                const tp = instance.tippy.props;
                const spy_show = jest.spyOn(tp, "onShow");
                const spy_hide = jest.spyOn(tp, "onHide");

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.mouseleave($el);
                await utils.timeout(50);
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.click($el);
                await utils.timeout(50);
                expect(spy_hide).toHaveBeenCalled();

                spy_show.mockRestore();
                spy_hide.mockRestore();
            });
        });

        describe("2.3 - with `closing: close-button`", () => {
            it("2.3.1 - with `trigger: click` the tooltip is only closed when clicking the close button", async () => {
                const $el = testutils.createTooltip({
                    data: "trigger: click; closing: close-button",
                });
                const instance = new pattern($el);
                await utils.timeout(1);

                const tp = instance.tippy.props;
                const spy_show = jest.spyOn(tp, "onShow");
                const spy_hide = jest.spyOn(tp, "onHide");

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).not.toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.click($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.mouseleave($el);
                await utils.timeout(50);
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.click($el);
                await utils.timeout(50);
                expect(spy_hide).not.toHaveBeenCalled();

                const closebutton = document.querySelector(".close-panel");
                expect(closebutton).toBeTruthy();
                closebutton.click();
                await utils.timeout(50);
                expect(spy_hide).toHaveBeenCalled();

                spy_show.mockRestore();
                spy_hide.mockRestore();
            });

            it("2.3.2 - with `trigger: hover` the tooltip is only closed when clicking outside", async () => {
                const $el = testutils.createTooltip({
                    data: "trigger: hover; closing: close-button",
                });
                const instance = new pattern($el);
                await utils.timeout(1);
                const tp = instance.tippy.props;
                const spy_show = jest.spyOn(tp, "onShow");
                const spy_hide = jest.spyOn(tp, "onHide");

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.mouseleave($el);
                await utils.timeout(50);
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.click($el);
                await utils.timeout(50);
                expect(spy_hide).not.toHaveBeenCalled();

                const closebutton = document.querySelector(".close-panel");
                expect(closebutton).toBeTruthy();
                closebutton.click();
                await utils.timeout(50);
                expect(spy_hide).toHaveBeenCalled();

                spy_show.mockRestore();
                spy_hide.mockRestore();
            });

            it("2.3.3 - a close-panel doesn't prevent a form submit.", async () => {
                document.body.innerHTML = `
                    <a class="pat-tooltip" href="#form" data-pat-tooltip="source: ajax">open form</a>

                    <div hidden id="form">
                        <form action=".">
                          <button class="close-panel" type="submit">send and close</button>
                        </form>
                    </div>
                `;

                const el = document.querySelector(".pat-tooltip");
                new pattern(el);
                await utils.timeout(1);

                el.click();
                await utils.timeout(1);
                await utils.timeout(1); // wait another tick for all asyncs to finish.

                const form = document.querySelector(".tooltip-container form");
                const mock_listener = jest.fn().mockImplementation((e) => {
                    e.preventDefault();
                });

                form.addEventListener("submit", mock_listener);

                const btn_submit = form.querySelector("button.close-panel");

                btn_submit.click();
                await utils.timeout(1);

                expect(mock_listener).toHaveBeenCalledTimes(1);
                expect(document.querySelectorAll(".tooltip-container").length).toBe(0);
            });
        });
    });

    describe("3 - multiple tooltips...", () => {
        it("3.1 - ...no problem", async () => {
            const $el1 = testutils.createTooltip({
                data: "source: title; trigger: click",
                id: "tooltip1",
                title: "tooltip1",
            });
            const $el2 = testutils.createTooltip({
                data: "source: title; trigger: click",
                id: "tooltip2",
                title: "tooltip2",
            });
            const title1 = $el1.attr("title");
            const title2 = $el2.attr("title");

            const instance1 = new pattern($el1);
            const instance2 = new pattern($el2);
            await utils.timeout(1);

            const spy_show1 = jest.spyOn(instance1.tippy.props, "onShow");
            const spy_show2 = jest.spyOn(instance2.tippy.props, "onShow");

            let container;

            testutils.click($el1);
            await utils.timeout(1);

            expect(spy_show1).toHaveBeenCalled();
            expect(spy_show2).not.toHaveBeenCalled();
            container = document.querySelectorAll(".tippy-box");
            expect(container.length).toEqual(1);
            expect(container[0].querySelector(".tippy-content").textContent).toBe(
                title1
            );

            spy_show1.mockClear();
            spy_show2.mockClear();

            testutils.click($el2);
            await utils.timeout(1);

            expect(spy_show1).not.toHaveBeenCalled();
            expect(spy_show2).toHaveBeenCalled();
            container = document.querySelectorAll(".tippy-box");
            expect(container.length).toEqual(2);
            expect(container[1].querySelector(".tippy-content").textContent).toBe(
                title2
            );

            spy_show1.mockRestore();
            spy_show2.mockRestore();
        });
    });

    describe(`4 - if the 'position-list' parameter exists`, () => {
        it(`4.1 - 'lt' will place the tooltip as 'right-start'`, async () => {
            const $el = testutils.createTooltip({
                data: "position-list: lt",
            });
            new pattern($el);
            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("right-start");
        });
        it(`4.2 - 'lb' will place the tooltip as 'right-end'`, async () => {
            const $el = testutils.createTooltip({
                data: "position-list: lb",
            });
            new pattern($el);
            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("right-end");
        });
        it(`4.3 - 'lm' will place the tooltip as 'right'`, async () => {
            const $el = testutils.createTooltip({
                data: "position-list: lm",
            });
            new pattern($el);
            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("right");
        });
        it(`4.4 - 'bl' will place the tooltip as 'top-start'`, async () => {
            const $el = testutils.createTooltip({
                data: "position-list: bl",
            });
            new pattern($el);
            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("top-start");
        });
        it(`4.5 - 'br' will place the tooltip as 'top-end'`, async () => {
            const $el = testutils.createTooltip({
                data: "position-list: br",
            });
            new pattern($el);
            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("top-end");
        });
        it(`4.6 - 'bm' will place the tooltip as 'top'`, async () => {
            const $el = testutils.createTooltip({
                data: "position-list: bm",
            });
            new pattern($el);
            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("top");
        });
        describe(`4.7 - and 'position-policy' is 'force'`, () => {
            it(`4.7.1 - 'tl;force' will place the tooltip as 'bottom-start'`, async () => {
                const $el = testutils.createTooltip({
                    data: "position-list: tl; position-policy: force",
                });
                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe("bottom-start");
            });
            it(`4.7.2 - 'tr;force' will place the tooltip as 'bottom-end'`, async () => {
                const $el = testutils.createTooltip({
                    data: "position-list: tr; position-policy: force",
                });
                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe("bottom-end");
            });
            it(`4.7.3 - 'tm;force' will place the tooltip as 'bottom'`, async () => {
                const $el = testutils.createTooltip({
                    data: "position-list: tm; position-policy: force",
                });
                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe("bottom");
            });
            it(`4.7.4 - 'rt;force' will place the tooltip as 'left-start'`, async () => {
                const $el = testutils.createTooltip({
                    data: "position-list: rt; position-policy: force",
                });
                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe("left-start");
            });
            it(`4.7.5 - 'rb;force' will place the tooltip as 'left-end'`, async () => {
                const $el = testutils.createTooltip({
                    data: "position-list: rb; position-policy: force",
                });
                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe("left-end");
            });
            it(`4.7.6 - 'rm;force' will place the tooltip as 'left'`, async () => {
                const $el = testutils.createTooltip({
                    data: "position-list: rm; position-policy: force",
                });
                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe("left");
            });
        });
    });

    describe(`5 - and ...`, () => {
        describe(`5.1 - the 'mark-inactive' paramater`, () => {
            it("5.1.1 - when true, toggles the active/inactive class on the trigger", async () => {
                const $el = testutils.createTooltip({
                    data: "mark-inactive: true",
                });
                const el = $el[0];
                const instance = new pattern($el);
                await utils.timeout(1);

                const spy_show = jest.spyOn(instance.tippy.props, "onShow");
                const spy_hide = jest.spyOn(instance.tippy.props, "onHide");

                let containers;

                expect(el.classList.contains("tooltip-active-click")).toBeFalsy();
                expect(el.classList.contains("tooltip-inactive")).toBeTruthy();

                testutils.click($el);
                await utils.timeout(1);

                expect(spy_show).toHaveBeenCalled();
                containers = document.querySelectorAll(".tippy-box");
                expect(containers.length).toEqual(1);
                expect(el.classList.contains("tooltip-active-click")).toBeTruthy();
                expect(el.classList.contains("tooltip-inactive")).toBeFalsy();

                testutils.click($el);

                // TODO: inspect, why we have to wait for the tooltip to be closed.
                await utils.timeout(100);

                expect(spy_hide).toHaveBeenCalled();

                // TODO: inspect, why container are not removed.
                //containers = document.querySelectorAll(".tippy-box");
                //expect(containers.length).toEqual(0);
                expect(el.classList.contains("tooltip-active-click")).toBeFalsy();
                expect(el.classList.contains("tooltip-inactive")).toBeTruthy();

                spy_show.mockRestore();
                spy_hide.mockRestore();
            });
            it("5.1.2 - when false, the trigger does not get the active/inactive class", async () => {
                const $el = testutils.createTooltip({
                    data: "mark-inactive: false",
                });
                const el = $el[0];
                const instance = new pattern($el);
                await utils.timeout(1);

                const spy_show = jest.spyOn(instance.tippy.props, "onShow");
                const spy_hide = jest.spyOn(instance.tippy.props, "onHide");

                let containers;

                expect(el.classList.contains("tooltip-active-click")).toBeFalsy();
                expect(el.classList.contains("tooltip-inactive")).toBeFalsy();

                testutils.click($el);
                await utils.timeout(1);

                expect(spy_show).toHaveBeenCalled();
                containers = document.querySelectorAll(".tippy-box");
                expect(containers.length).toEqual(1);
                expect(el.classList.contains("tooltip-active-click")).toBeFalsy();
                expect(el.classList.contains("tooltip-inactive")).toBeFalsy();

                testutils.click($el);

                // TODO: inspect, why we have to wait for the tooltip to be closed.
                await utils.timeout(100);

                expect(spy_hide).toHaveBeenCalled();

                // TODO: inspect, why container are not removed.
                //containers = document.querySelectorAll(".tippy-box");
                //expect(containers.length).toEqual(0);
                expect(el.classList.contains("tooltip-active-click")).toBeFalsy();
                expect(el.classList.contains("tooltip-inactive")).toBeFalsy();

                spy_show.mockRestore();
                spy_hide.mockRestore();
            });
            it("5.1.3 - when true and trigger is hover, toggles a different active class on the trigger", async () => {
                const $el = testutils.createTooltip({
                    data: "mark-inactive: true; trigger: hover",
                });
                const el = $el[0];
                const instance = new pattern($el);
                await utils.timeout(1);

                const spy_show = jest.spyOn(instance.tippy.props, "onShow");

                let containers;

                expect(el.classList.contains("tooltip-active-hover")).toBeFalsy();
                expect(el.classList.contains("tooltip-inactive")).toBeTruthy();

                testutils.mouseenter($el);
                await utils.timeout(1);

                expect(spy_show).toHaveBeenCalled();
                containers = document.querySelectorAll(".tippy-box");
                expect(containers.length).toEqual(1);
                expect(el.classList.contains("tooltip-active-hover")).toBeTruthy();
                expect(el.classList.contains("tooltip-inactive")).toBeFalsy();

                spy_show.mockRestore();
            });
        });
        describe(`5.2 - if the 'trigger' parameter is 'hover'`, () => {
            describe(`5.2.1 - if the 'source' parameter is 'title'`, () => {
                it(`5.2.1.1 - will show the contents of the 'title' attribute`, async () => {
                    const $el = testutils.createTooltip({
                        data: "source: title; trigger: hover",
                    });
                    const el = $el[0];
                    const title = el.title;

                    const instance = new pattern($el);
                    await utils.timeout(1);

                    const spy_show = jest.spyOn(instance.tippy.props, "onShow");

                    // The 'title' attr gets removed, otherwise the browser's
                    // tooltip will appear
                    expect(el.hasAttribute("title")).toBeFalsy();

                    testutils.mouseenter($el);
                    await utils.timeout(1);

                    expect(spy_show).toHaveBeenCalled();

                    const container = document.querySelectorAll(".tippy-box");
                    expect(container.length).toEqual(1);
                    expect(
                        container[0].querySelector(".tippy-content").textContent
                    ).toBe(title);

                    spy_show.mockRestore();
                });
                it("5.2.1.2 - will hide the tooltip on mouseleave", async () => {
                    const $el = testutils.createTooltip({
                        data: "source: title; trigger: hover",
                    });

                    const instance = new pattern($el);
                    await utils.timeout(1);

                    const spy_hide = jest.spyOn(instance.tippy.props, "onHide");

                    // Shortcut any checks for mouse positions and just hide.
                    const spy_inter = jest
                        .spyOn(instance.tippy, "hideWithInteractivity")
                        .mockImplementation(instance.tippy.hide);

                    testutils.mouseenter($el);
                    await utils.timeout(1);
                    expect(spy_hide).not.toHaveBeenCalled();
                    expect(document.querySelectorAll(".tippy-box").length).toEqual(1);

                    testutils.mouseleave($el);
                    await utils.timeout(1);
                    expect(spy_hide).toHaveBeenCalled();
                    expect(document.querySelectorAll(".tippy-box").length).toEqual(0);

                    spy_hide.mockRestore();
                    spy_inter.mockRestore();
                });
            });
            describe(`5.2.2 - if the 'source' parameter is 'content'`, () => {
                it("5.2.2.1 - it will show the content of the link", async () => {
                    const content = "Local content";
                    const $el = testutils.createTooltip({
                        data: "source: content; trigger: hover",
                        href: "#lab",
                        content: content,
                    });
                    const instance = new pattern($el);
                    await utils.timeout(1);

                    const spy_show = jest.spyOn(instance.tippy.props, "onShow");

                    testutils.mouseenter($el);
                    await utils.timeout(1);

                    expect(spy_show).toHaveBeenCalled();
                    expect(document.querySelector(".tippy-box").textContent).toBe(
                        content
                    );

                    spy_show.mockRestore();
                });
            });
        });
        describe("5.3 - if the 'trigger' parameter is 'none'", () => {
            it("5.3.1 - does not open or close via click or mousehover", async () => {
                const el = document.createElement("div");
                el.setAttribute("title", "hello.");

                const instance = new pattern(el, { trigger: "none" });
                await utils.timeout(1);

                // normal trigger shouldn't open
                el.click();
                el.dispatchEvent(
                    new Event("mouseover", { bubbles: true, cancelable: true })
                );
                await utils.timeout(1);

                expect(document.querySelector(".tippy-box .tippy-content")).toBeFalsy();

                instance.tippy.show();
                await utils.timeout(1);

                expect(
                    document.querySelector(".tippy-box .tippy-content").textContent
                ).toBe("hello.");

                // normal trigger shouldn't close
                el.dispatchEvent(
                    new Event("mouseout", { bubbles: true, cancelable: true })
                );
                document.body.click();
                document.body.dispatchEvent(
                    new Event("mouseover", { bubbles: true, cancelable: true })
                );
                await utils.timeout(1);

                expect(
                    document.querySelector(".tippy-box .tippy-content").textContent
                ).toBe("hello.");
            });

            it("5.3.2 - does opens / closes via the API", async () => {
                const el = document.createElement("div");
                el.setAttribute("title", "hello.");

                const instance = new pattern(el, { trigger: "none" });
                await utils.timeout(1);

                expect(document.querySelector(".tippy-box .tippy-content")).toBeFalsy();

                instance.show();
                await utils.timeout(1);

                expect(
                    document.querySelector(".tippy-box .tippy-content").textContent
                ).toBe("hello.");

                instance.hide();
                await utils.timeout(1);

                expect(document.querySelector(".tippy-box .tippy-content")).toBeFalsy();
            });
        });
        describe(`5.4 - if the 'target' parameter is 'body'`, () => {
            it("5.4.1 - will append the .tippy-box to the document.body", async () => {
                const $el = testutils.createTooltip({
                    data: "target: body",
                    href: "#",
                });
                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                expect(
                    document.querySelectorAll("body > [data-tippy-root]").length
                ).toEqual(1);
            });
        });
        describe(`5.5 - if the 'target' parameter is 'parent'`, () => {
            it(`5.5.1 - will append the .tippy-box to the reference element's parent node`, async () => {
                const $el = testutils.createTooltip({
                    data: "target: parent",
                    href: "#",
                });
                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                expect(
                    document.querySelectorAll("#lab > [data-tippy-root]").length
                ).toEqual(1);
            });
        });
        describe(`5.6 - if the 'target' parameter is a selector`, () => {
            it("5.6.1 - will append the .tippy-box to the selected element", async () => {
                const $el = testutils.createTooltip({
                    data: "target: #child3",
                    href: "#",
                });

                const container = document.createElement("div");
                container.setAttribute("id", "child1");
                container.innerHTML = `
                    <div id="child2">
                        <div id="child3">
                        </div>
                    </div>
                `;
                document.body.appendChild(container);

                new pattern($el);
                await utils.timeout(1);

                testutils.click($el);
                await utils.timeout(1);

                expect(
                    document.querySelectorAll("#child3 > [data-tippy-root]").length
                ).toEqual(1);
            });
        });
    });

    describe("6 - test the different `source` parameters", () => {
        it("6.1 - source: title will use the title attribute", async () => {
            const $el = testutils.createTooltip({
                data: "source: title; trigger: click",
            });
            const title = $el[0].title;
            new pattern($el);
            await utils.timeout(1);

            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1);

            const expected = document.querySelector(
                ".tooltip-container .tippy-content"
            ).textContent;
            expect(expected).toBe(title);
        });

        it("6.2 - source: content use the content of the link", async () => {
            const content = "Local content";
            const $el = testutils.createTooltip({
                data: "source: content; trigger: click",
                content: content,
            });
            new pattern($el);
            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1);

            expect(document.querySelector(".tippy-box").textContent).toBe(content);
        });

        it("6.3 - source: ajax and an external url will fetch its contents via ajax", async () => {
            global.fetch = jest
                .fn()
                .mockImplementation(
                    mockFetch("External content fetched via an HTTP request.")
                );

            const $el = testutils.createTooltip({
                data: "source: ajax",
                href: "http://test.com",
            });
            const instance = new pattern($el);
            await utils.timeout(1);

            const spy_content = jest.spyOn(instance, "_getContent");
            const spy_show = jest.spyOn(instance.tippy.props, "onShow");

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            expect(global.fetch).toHaveBeenCalled();
            expect(spy_content).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            expect(document.querySelector(".tippy-box .tippy-content").textContent).toBe(
                "External content fetched via an HTTP request."
            );

            spy_content.mockRestore();
            spy_show.mockRestore();
            global.fetch.mockRestore();
            delete global.fetch;
        });

        it("6.4 - source: ajax with a local selector will not use ajax but get the contents from the current DOM", async () => {
            global.fetch = jest
                .fn()
                .mockImplementation(
                    mockFetch("External content fetched via an HTTP request.")
                );

            const $el = testutils.createTooltip({
                data: "source: ajax",
                href: "#lab",
            });
            const instance = new pattern($el);
            await utils.timeout(1);

            const spy_content = jest.spyOn(instance, "_getContent");
            const spy_show = jest.spyOn(instance.tippy.props, "onShow");

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            expect(global.fetch).not.toHaveBeenCalled();
            expect(spy_content).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            expect(
                document.querySelector(".tippy-box .tippy-content .pat-tooltip")
            ).toBeTruthy();

            spy_content.mockRestore();
            spy_show.mockRestore();
            global.fetch.mockRestore();
            delete global.fetch;
        });

        it("6.5 - source: ajax loading via the url parameter.", async () => {
            global.fetch = jest
                .fn()
                .mockImplementation(
                    mockFetch("External content fetched via an HTTP request.")
                );

            document.body.innerHTML = `
                <button
                    class="pat-tooltip"
                    type="button"
                    data-pat-tooltip="
                      source: ajax;
                      url: https://the-internets.url;
                      trigger: click">
                  click me
                </button>
            `;

            const el = document.body.querySelector(".pat-tooltip");

            const instance = new pattern(el);
            await utils.timeout(1);

            const spy_content = jest.spyOn(instance, "_getContent");
            const spy_show = jest.spyOn(instance.tippy.props, "onShow");

            el.click();
            await utils.timeout(1); // wait a tick

            expect(global.fetch).toHaveBeenCalled();
            expect(spy_content).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            expect(document.querySelector(".tippy-box .tippy-content").textContent).toBe(
                "External content fetched via an HTTP request."
            );

            spy_content.mockRestore();
            spy_show.mockRestore();
            global.fetch.mockRestore();
            delete global.fetch;
        });

        it("6.6 - source: ajax loading from current DOM via the url parameter and a fragment specifier.", async () => {
            global.fetch = jest
                .fn()
                .mockImplementation(
                    mockFetch("External content fetched via an HTTP request.")
                );

            document.body.innerHTML = `
                <button
                    class="pat-tooltip"
                    type="button"
                    data-pat-tooltip="
                      source: ajax;
                      url: #fragment;
                      trigger: click">
                  click me
                </button>
                <div id="fragment">hello.</div>
            `;

            const el = document.body.querySelector(".pat-tooltip");

            const instance = new pattern(el);
            await utils.timeout(1);

            const spy_content = jest.spyOn(instance, "_getContent");
            const spy_show = jest.spyOn(instance.tippy.props, "onShow");

            el.click();
            await utils.timeout(1); // wait a tick

            expect(global.fetch).not.toHaveBeenCalled();
            expect(spy_content).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            expect(document.querySelector(".tippy-box .tippy-content").textContent).toBe(
                "hello."
            );

            spy_content.mockRestore();
            spy_show.mockRestore();
            global.fetch.mockRestore();
            delete global.fetch;
        });
    });

    describe(`7 - if the 'source' parameter is 'ajax'`, () => {
        it("7.1 - multiple clicks only fetches once AND the default click action is prevented", async () => {
            global.fetch = jest.fn().mockImplementation(mockFetch());

            const $el = testutils.createTooltip({
                data: "source: ajax",
                href: "tests/content.html#content",
            });
            const instance = new pattern($el);
            await utils.timeout(1);

            const click = new Event("click");

            const call_order = [];

            const spy_prevent = jest
                .spyOn(click, "preventDefault")
                .mockImplementation(() => call_order.push("preventDefault"));
            const spy_get_content = jest
                .spyOn(instance, "_getContent")
                .mockImplementation(() => call_order.push("_getContent"));

            $el[0].dispatchEvent(click);
            await utils.timeout(1); // wait a tick for async fetch
            $el[0].dispatchEvent(click);
            await utils.timeout(1); // wait a tick for async fetch
            $el[0].dispatchEvent(click);
            await utils.timeout(1); // wait a tick for async fetch

            expect(call_order.filter(it => it === "_getContent").length).toEqual(1); // prettier-ignore
            expect(call_order.filter(it => it === "preventDefault").length).toEqual(3); // prettier-ignore

            spy_prevent.mockRestore();
            spy_get_content.mockRestore();
            global.fetch.mockRestore();
            delete global.fetch;
        });

        it("7.2 - will fetch a section via ajax", async () => {
            global.fetch = jest.fn().mockImplementation(
                mockFetch(`
<h1>test fetching a secton</h1>
<section id="content">this will be extracted</section>
                    `)
            );

            const $el = testutils.createTooltip({
                data: "source: ajax",
                href: "http://test.com#content",
            });
            const instance = new pattern($el);
            await utils.timeout(1);

            const spy_ajax = jest.spyOn(instance, "_getContent");
            const spy_show = jest.spyOn(instance.tippy.props, "onShow");

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            expect(spy_ajax).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            expect(document.querySelector(".tippy-box .tippy-content").textContent).toBe(
                "this will be extracted"
            );

            spy_ajax.mockRestore();
            spy_show.mockRestore();
            global.fetch.mockRestore();
            delete global.fetch;
        });

        it("7.3 - will handle markdown content", async () => {
            global.fetch = jest.fn().mockImplementation(mockFetch("## hello."));

            const $el = testutils.createTooltip({
                data: "source: ajax; ajax-data-type: markdown",
                href: "http://test.com",
            });
            const instance = await new pattern($el);
            await utils.timeout(1);

            const spy_ajax = jest.spyOn(instance, "_getContent");
            const spy_show = jest.spyOn(instance.tippy.props, "onShow");

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            expect(spy_ajax).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            const content = document.querySelector(".tippy-box .tippy-content h2");
            expect(content).toBeTruthy();
            expect(content.textContent).toBe("hello.");

            spy_ajax.mockRestore();
            spy_show.mockRestore();
            global.fetch.mockRestore();
            delete global.fetch;
        });

        it("7.4 - will extract a section from markdown", async () => {
            global.fetch = jest.fn().mockImplementation(
                mockFetch(`
# note a limitation

to extract a section, it cannot be the very first one...

## hello

this will be extracted.
                `)
            );

            const $el = testutils.createTooltip({
                data: "source: ajax; ajax-data-type: markdown",
                href: "http://test.com/#hello",
            });
            const instance = new pattern($el);
            await utils.timeout(1);

            const spy_ajax = jest.spyOn(instance, "_getContent");
            const spy_show = jest.spyOn(instance.tippy.props, "onShow");

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            expect(spy_ajax).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            const content = document.querySelector(".tippy-box .tippy-content");
            expect(content.querySelector("h2")).toBeTruthy();
            expect(content.querySelector("h2").textContent).toBe("hello");
            expect(content.querySelector("p")).toBeTruthy();
            expect(content.querySelector("p").textContent).toBe(
                "this will be extracted."
            );

            spy_ajax.mockRestore();
            spy_show.mockRestore();
            global.fetch.mockRestore();
            delete global.fetch;
        });

        describe("7.5 - will not fetch again until tooltip is hidden", () => {
            it("7.5.1 - with click", async () => {
                global.fetch = jest
                    .fn()
                    .mockImplementation(
                        mockFetch("External content fetched via an HTTP request.")
                    );

                const $el = testutils.createTooltip({
                    data: "source: ajax; trigger: click",
                    href: "http://test.com",
                });
                const instance = new pattern($el);
                await utils.timeout(1);

                const spy_ajax = jest.spyOn(instance, "_getContent");
                const spy_fetch = jest.spyOn(window, "fetch");
                const spy_show = jest.spyOn(instance.tippy.props, "onShow");

                // 1
                testutils.click($el);
                await utils.timeout(1); // wait a tick for async fetch

                // 2
                testutils.click($el);
                await utils.timeout(1); // wait a tick for async fetch

                // 3
                testutils.click($el);
                await utils.timeout(1); // wait a tick for async fetch

                expect(spy_show).toHaveBeenCalledTimes(1);
                expect(spy_ajax).toHaveBeenCalledTimes(1);
                expect(spy_fetch).toHaveBeenCalledTimes(1);

                expect(
                    document.querySelector(".tippy-box .tippy-content").textContent
                ).toBe("External content fetched via an HTTP request.");

                spy_show.mockRestore();
                spy_ajax.mockRestore();
                spy_fetch.mockRestore();
                global.fetch.mockRestore();
                delete global.fetch;
            });

            it("7.5.2 - with hover", async () => {
                global.fetch = jest
                    .fn()
                    .mockImplementation(
                        mockFetch("External content fetched via an HTTP request.")
                    );

                const $el = testutils.createTooltip({
                    data: "source: ajax; trigger: hover",
                    href: "http://test.com",
                });
                const instance = new pattern($el);
                await utils.timeout(1);

                const spy_ajax = jest.spyOn(instance, "_getContent");
                const spy_fetch = jest.spyOn(window, "fetch");
                const spy_show = jest.spyOn(instance.tippy.props, "onShow");

                // 1
                testutils.mouseenter($el);
                await utils.timeout(1); // wait a tick for async fetch

                // 2
                testutils.mouseleave($el);
                await utils.timeout(1); // wait a tick for async fetch

                // 3
                testutils.mouseenter($el);
                await utils.timeout(1); // wait a tick for async fetch

                expect(spy_show).toHaveBeenCalledTimes(1);
                expect(spy_ajax).toHaveBeenCalledTimes(1);
                expect(spy_fetch).toHaveBeenCalledTimes(1);

                expect(
                    document.querySelector(".tippy-box .tippy-content").textContent
                ).toBe("External content fetched via an HTTP request.");

                spy_show.mockRestore();
                spy_ajax.mockRestore();
                spy_fetch.mockRestore();
                global.fetch.mockRestore();
                delete global.fetch;
            });
        });
    });

    describe("8 - patterns-injected events", () => {
        it("8.1 - it throws the ``patterns-injected`` event", async () => {
            global.fetch = jest.fn().mockImplementation(mockFetch("External content"));

            let called = false;
            $(document.body).on("patterns-injected", () => {
                called = true;
            });

            const $el = testutils.createTooltip({
                data: "source: ajax; trigger: click",
                href: "http://test.com",
            });
            new pattern($el);
            await utils.timeout(1);

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch
            await utils.timeout(1); // wait another tick for all asyncs to finish.

            expect(called).toBeTruthy();

            global.fetch.mockRestore();
            delete global.fetch;
        });

        it.skip("8.2 - triggers event handlers in other patterns", async () => {
            // TODO: fix tests
            global.fetch = jest
                .fn()
                .mockImplementation(mockFetch(`<input type="checkbox" name="test"/>`));

            const form = document.createElement("form");
            form.setAttribute("action", "test.html");
            form.setAttribute("class", "pat-autosubmit");
            document.body.appendChild(form);

            const $el = testutils.createTooltip({
                data: "source: ajax; trigger: click; target: form",
                href: "http://test.com",
            });
            new pattern($el);
            await utils.timeout(1);

            const instance2 = new autosubmit($(form));
            const spy_handler1 = jest.spyOn(instance2, "refreshListeners");
            const spy_handler2 = jest.spyOn(instance2, "onInputChange");

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            document.body.querySelector("input[name=test]").click();
            await utils.timeout(1); // wait a tick for async fetch

            // TODO: check why this isn't called
            // manual tests show expected behavior.
            expect(spy_handler1).toHaveBeenCalled();
            expect(spy_handler2).toHaveBeenCalled();

            spy_handler1.mockRestore();
            spy_handler2.mockRestore();
            global.fetch.mockRestore();
            delete global.fetch;
        });

        it("8.3 - only scans the tooltip content once", async () => {
            const $el = testutils.createTooltip({
                data: "source: content; trigger: click",
            });
            new pattern($el);
            await utils.timeout(1);

            const spy_scan = jest.spyOn(registry, "scan");

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            // Test, if registry.scan isn't invoked twice - another time by
            // pat-inject.
            expect(spy_scan).toHaveBeenCalledTimes(1);

            spy_scan.mockRestore();
        });
    });

    describe("9 - URL splitting", () => {
        it("9.1 - it extracts the correct parts from any url", async () => {
            const $el = testutils.createTooltip({});
            const instance = new pattern($el);
            await utils.timeout(1);

            let parts = instance.get_url_parts("https://text.com/#selector");
            expect(parts.url === "https://text.com/").toBeTruthy();
            expect(parts.selector === "#selector").toBeTruthy();

            parts = instance.get_url_parts("#selector");
            expect(typeof parts.url === "undefined").toBeTruthy();
            expect(parts.selector === "#selector").toBeTruthy();

            parts = instance.get_url_parts("https://text.com/");
            expect(parts.url === "https://text.com/").toBeTruthy();
            expect(typeof parts.selector === "undefined").toBeTruthy();
        });
    });
});
