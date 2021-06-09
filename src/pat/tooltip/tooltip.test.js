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

    cleanup() {
        document.body.innerHTML = "";
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
        testutils.cleanup();
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("A tooltip", () => {
        it("always gets the ``tooltip-container`` class set", async () => {
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

        describe(`if the 'class' parameter exists`, () => {
            it("will assign a class to the tooltip container", async () => {
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
            });

            it("and only to the corresponding container", async () => {
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

            it("with multiple values, all will be applied.", async () => {
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

        describe(`if the 'delay' parameter exists`, () => {
            it("will wait accordingly before showing the tooltip", async () => {
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
            });
        });
    });

    describe("Tooltip closing behavior", () => {
        describe("with the default `closing: auto`", () => {
            it("with `trigger: click` it will only close when clicking outside the tooltip element", async () => {
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
            });

            it("with `trigger: hover` it will close when hovering outside the tooltip element", async () => {
                const $el = testutils.createTooltip({
                    data: "trigger: hover; closing: auto",
                });
                const instance = new pattern($el);
                await utils.timeout(1);

                const tp = instance.tippy.props;
                const spy_show = jest.spyOn(tp, "onShow");
                const spy_hide = jest.spyOn(tp, "onHide");

                // Shortcut any checks for mouse positions and just hide.
                jest.spyOn(instance.tippy, "hideWithInteractivity").mockImplementation(
                    instance.tippy.hide
                );

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.mouseleave($el);
                await utils.timeout(1);
                expect(spy_hide).toHaveBeenCalled();
            });
        });

        describe("with `closing: sticky`", () => {
            it("with `trigger: click` there is no change in the closing behavior", async () => {
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
            });

            it("with `trigger: hover` the tooltip is only closed when clicking outside", async () => {
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
            });
        });

        describe("with `closing: close-button`", () => {
            it("with `trigger: click` the tooltip is only closed when clicking the close button", async () => {
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
            });

            it("with `trigger: hover` the tooltip is only closed when clicking outside", async () => {
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
            });
        });
    });

    describe(`multiple tooltips...`, () => {
        it("...no problem", async () => {
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
        });
    });

    describe(`if the 'position-list' parameter exists`, () => {
        it(`'lt' will place the tooltip as 'right-start'`, async () => {
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
        it(`'lb' will place the tooltip as 'right-end'`, async () => {
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
        it(`'lm' will place the tooltip as 'right'`, async () => {
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
        it(`'bl' will place the tooltip as 'top-start'`, async () => {
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
        it(`'br' will place the tooltip as 'top-end'`, async () => {
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
        it(`'bm' will place the tooltip as 'top'`, async () => {
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
        describe(`and 'position-policy' is 'force'`, () => {
            it(`'tl;force' will place the tooltip as 'bottom-start'`, async () => {
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
            it(`'tr;force' will place the tooltip as 'bottom-end'`, async () => {
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
            it(`'tm;force' will place the tooltip as 'bottom'`, async () => {
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
            it(`'rt;force' will place the tooltip as 'left-start'`, async () => {
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
            it(`'rb;force' will place the tooltip as 'left-end'`, async () => {
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
            it(`'rm;force' will place the tooltip as 'left'`, async () => {
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

    describe(`and ...`, () => {
        describe(`the 'mark-inactive' paramater`, () => {
            it("when true, toggles the active/inactive class on the trigger", async () => {
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
            });
            it("when false, the trigger does not get the active/inactive class", async () => {
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
            });
            it("when true and trigger is hover, toggles a different active class on the trigger", async () => {
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
            });
        });
        describe(`if the 'trigger' parameter is 'hover'`, () => {
            describe(`if the 'source' parameter is 'title'`, () => {
                it(`will show the contents of the 'title' attribute`, async () => {
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
                });
                it("will hide the tooltip on mouseleave", async () => {
                    const $el = testutils.createTooltip({
                        data: "source: title; trigger: hover",
                    });

                    const instance = new pattern($el);
                    await utils.timeout(1);

                    const spy_hide = jest.spyOn(instance.tippy.props, "onHide");

                    // Shortcut any checks for mouse positions and just hide.
                    jest.spyOn(
                        instance.tippy,
                        "hideWithInteractivity"
                    ).mockImplementation(instance.tippy.hide);

                    testutils.mouseenter($el);
                    await utils.timeout(1);
                    expect(spy_hide).not.toHaveBeenCalled();
                    expect(document.querySelectorAll(".tippy-box").length).toEqual(1);

                    testutils.mouseleave($el);
                    await utils.timeout(1);
                    expect(spy_hide).toHaveBeenCalled();
                    expect(document.querySelectorAll(".tippy-box").length).toEqual(0);
                });
            });
            describe(`if the 'source' parameter is 'content'`, () => {
                it("it will show the content of the link", async () => {
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
                });
            });
        });
        describe(`if the 'target' parameter is 'body'`, () => {
            it("will append the .tippy-box to the document.body", async () => {
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
        describe(`if the 'target' parameter is 'parent'`, () => {
            it(`will append the .tippy-box to the reference element's parent node`, async () => {
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
        describe(`if the 'target' parameter is a selector`, () => {
            it("will append the .tippy-box to the selected element", async () => {
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

    describe("test the different `source` parameters", () => {
        it("source: title will use the title attribute", async () => {
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

        it("source: content use the content of the link", async () => {
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

        it("source: ajax and an external url will fetch its contents via ajax", async () => {
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

            global.fetch.mockClear();
            delete global.fetch;
        });

        it("source: ajax with a local selector will not use ajax but get the contents from the current DOM", async () => {
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

            global.fetch.mockClear();
            delete global.fetch;
        });
    });

    describe(`if the 'source' parameter is 'ajax'`, () => {
        it("multiple clicks only fetches once AND the default click action is prevented", async () => {
            global.fetch = jest.fn().mockImplementation(mockFetch());

            const $el = testutils.createTooltip({
                data: "source: ajax",
                href: "tests/content.html#content",
            });
            const instance = new pattern($el);
            await utils.timeout(1);

            const click = new Event("click");

            const call_order = [];

            jest.spyOn(click, "preventDefault").mockImplementation(() =>
                call_order.push("preventDefault")
            );
            jest.spyOn(instance, "_getContent").mockImplementation(() =>
                call_order.push("_getContent")
            );

            $el[0].dispatchEvent(click);
            await utils.timeout(1); // wait a tick for async fetch
            $el[0].dispatchEvent(click);
            await utils.timeout(1); // wait a tick for async fetch
            $el[0].dispatchEvent(click);
            await utils.timeout(1); // wait a tick for async fetch

            expect(call_order.filter(it => it === "_getContent").length).toEqual(1); // prettier-ignore
            expect(call_order.filter(it => it === "preventDefault").length).toEqual(3); // prettier-ignore

            global.fetch.mockClear();
            delete global.fetch;
        });

        it("will fetch a section via ajax", async () => {
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

            global.fetch.mockClear();
            delete global.fetch;
        });

        it("will handle markdown content", async () => {
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

            global.fetch.mockClear();
            delete global.fetch;
        });

        it("will extract a section from markdown", async () => {
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

            global.fetch.mockClear();
            delete global.fetch;
        });

        describe("will not fetch again until tooltip is hidden", () => {
            it("with click", async () => {
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

                global.fetch.mockClear();
                delete global.fetch;
            });

            it("with hover", async () => {
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

                global.fetch.mockClear();
                delete global.fetch;
            });
        });
    });

    describe("patterns-injected events", () => {
        it("it throws the ``patterns-injected`` event", async () => {
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

            expect(called).toBeTruthy();

            global.fetch.mockClear();
            delete global.fetch;
        });

        it.skip("triggers event handlers in other patterns", async () => {
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

            global.fetch.mockClear();
            delete global.fetch;
        });

        it("only scans the tooltip content once", async () => {
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
        });
    });

    describe("URL splitting", () => {
        it("it extracts the correct parts from any url", async () => {
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
