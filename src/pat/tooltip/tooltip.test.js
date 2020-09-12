import $ from "jquery";
import logging from "../../core/logging";
import pattern from "./tooltip";
import utils from "../../core/utils";

const mockFetch = (text = "") => () =>
    Promise.resolve({
        text: () => Promise.resolve(text),
    });

let start;
const log = logging.getLogger("pat-tooltip.tests");
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

    delayed(name, timeout) {
        return (...args) => {
            setTimeout(() => {
                pattern[name].and.callThrough();
                pattern[name].apply(null, args);
                pattern[name].and.callFake(testutils.delayed(name, timeout));
            }, timeout);
        };
    },

    stopwatch(spy, name, timer) {
        return (...args) => {
            timer[name] = Date.now();
            spy.and.callThrough();
            spy.apply(null, args);
            spy.and.callFake(testutils.stopwatch(name, timer));
        };
    },

    log(msg) {
        log.debug(String(Date.now() - start) + " " + msg);
    },
};

log.setLevel(20);

describe("pat-tooltip", () => {
    beforeEach(() => {
        testutils.cleanup();
        $("<div/>", { id: "lab" }).appendTo(document.body);
        start = Date.now();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("A tooltip", () => {
        it("always gets the ``tooltip-container`` class set", async (done) => {
            const $el = testutils.createTooltip({
                data: "trigger: click",
                title: "tooltip",
            });
            const instance = new pattern($el);

            testutils.click($el);
            await utils.timeout(1);

            expect(
                instance.tippy.popper.classList.contains("tooltip-container")
            ).toBeTruthy();

            done();
        });

        describe(`if the 'class' parameter exists`, () => {
            it("will assign a class to the tooltip container", async (done) => {
                const $el = testutils.createTooltip({
                    data: "source: title; trigger: hover; class: wasabi",
                });
                const el = $el[0];
                const title = el.title;

                const instance = new pattern($el);

                // NOTE 1:
                // spy on tippy instance's "onShow", which holds the reference
                // to the original implementation of the pattern.
                // mocking instance._onShow itself doesn't replace the tippy
                // instance's implementation.
                // NOTE 2:
                // spu on "onShow" because "onShown" isn't reached due to CSS
                // animations won't work in jsDOM.
                const spy_show = spyOn(
                    instance.tippy.props,
                    "onShow"
                ).and.callThrough();

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                const container = document.querySelectorAll(".tippy-box");
                expect(container.length).toEqual(1);
                expect(container[0].classList.contains("wasabi")).toBeTruthy();
                const expected = container[0].querySelector(".tippy-content")
                    .textContent;
                expect(expected).toBe(title);

                done();
            });

            it("and only to the corresponding container", async (done) => {
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
                const title1 = $el1.attr("title");
                const title2 = $el2.attr("title");

                const instance1 = new pattern($el1);
                const instance2 = new pattern($el2);

                let container, visible_container;

                testutils.click($el1);
                await utils.timeout(1);

                container = document.querySelectorAll(".tippy-box");
                expect(container.length).toEqual(1);
                expect(container[0].classList.contains("wasabi")).toBeTruthy();

                testutils.click($el2);
                await utils.timeout(1);

                container = document.querySelectorAll(".tippy-box");
                expect(container.length).toEqual(2);
                expect(container[1].classList.contains("wasabi")).toBeFalsy();

                done();
            });
        });

        describe(`if the 'delay' parameter exists`, () => {
            it("will wait accordingly before showing the tooltip", async (done) => {
                testutils.createTooltip({
                    data: "delay: 500; trigger: hover",
                });
                const el = document.querySelector("a.pat-tooltip");
                const $el = $(el);
                const title = el.title;
                const instance = new pattern($el);
                const timer = {};

                const spy_trigger = spyOn(instance.tippy.props, "onTrigger");
                spy_trigger.and.callFake(
                    testutils.stopwatch(spy_trigger, "onTrigger", timer)
                );
                const spy_show = spyOn(instance.tippy.props, "onShow");
                spy_show.and.callFake(
                    testutils.stopwatch(spy_show, "onShow", timer)
                );

                testutils.mouseenter($el);
                await utils.timeout(1000);

                expect(spy_show).toHaveBeenCalled();
                const container = document.querySelectorAll(".tippy-box");
                expect(container.length).toEqual(1);
                const expected = container[0].querySelector(".tippy-content")
                    .textContent;
                expect(expected).toBe(title);
                const duration = timer["onShow"] - timer["onTrigger"];
                expect(duration / 500).toBeCloseTo(1, 1);

                done();
            });
        });
    });

    describe("Tooltip closing behavior", () => {
        describe("with the default `closing: auto`", () => {
            it("with `trigger: click` it will only close when clicking outside the tooltip element", async (done) => {
                const $el = testutils.createTooltip({
                    data: "trigger: click; closing: auto",
                });
                const instance = new pattern($el);
                const tp = instance.tippy.props;
                const spy_show = spyOn(tp, "onShow").and.callThrough();
                const spy_hide = spyOn(tp, "onHide").and.callThrough();

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

                done();
            });

            it("with `trigger: hover` it will close when hovering outside the tooltip element", async (done) => {
                const $el = testutils.createTooltip({
                    data: "trigger: hover; closing: auto",
                });
                const instance = new pattern($el);
                const tp = instance.tippy.props;
                const spy_show = spyOn(tp, "onShow").and.callThrough();
                const spy_hide = spyOn(tp, "onHide").and.callThrough();

                // Shortcut any checks for mouse positions and just hide.
                spyOn(instance.tippy, "hideWithInteractivity").and.callFake(
                    instance.tippy.hide
                );

                testutils.mouseenter($el);
                await utils.timeout(1);
                expect(spy_show).toHaveBeenCalled();
                expect(spy_hide).not.toHaveBeenCalled();

                testutils.mouseleave($el);
                await utils.timeout(1);
                expect(spy_hide).toHaveBeenCalled();

                done();
            });
        });

        describe("with `closing: sticky`", () => {
            it("with `trigger: click` there is no change in the closing behavior", async (done) => {
                const $el = testutils.createTooltip({
                    data: "trigger: click; closing: sticky",
                });
                const instance = new pattern($el);
                const tp = instance.tippy.props;
                const spy_show = spyOn(tp, "onShow").and.callThrough();
                const spy_hide = spyOn(tp, "onHide").and.callThrough();

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

                done();
            });

            it("with `trigger: hover` the tooltip is only closed when clicking outside", async (done) => {
                const $el = testutils.createTooltip({
                    data: "trigger: hover; closing: sticky",
                });
                const instance = new pattern($el);
                const tp = instance.tippy.props;
                const spy_show = spyOn(tp, "onShow").and.callThrough();
                const spy_hide = spyOn(tp, "onHide").and.callThrough();

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

                done();
            });
        });

        describe("with `closing: close-button`", () => {
            it("with `trigger: click` the tooltip is only closed when clicking the close button", async (done) => {
                const $el = testutils.createTooltip({
                    data: "trigger: click; closing: close-button",
                });
                const instance = new pattern($el);
                const tp = instance.tippy.props;
                const spy_show = spyOn(tp, "onShow").and.callThrough();
                const spy_hide = spyOn(tp, "onHide").and.callThrough();

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

                done();
            });

            it("with `trigger: hover` the tooltip is only closed when clicking outside", async (done) => {
                const $el = testutils.createTooltip({
                    data: "trigger: hover; closing: close-button",
                });
                const instance = new pattern($el);
                const tp = instance.tippy.props;
                const spy_show = spyOn(tp, "onShow").and.callThrough();
                const spy_hide = spyOn(tp, "onHide").and.callThrough();

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

                done();
            });
        });
    });

    describe(`multiple tooltips...`, () => {
        it("...no problem", async (done) => {
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
            const spy_show1 = spyOn(
                instance1.tippy.props,
                "onShow"
            ).and.callThrough();
            const spy_show2 = spyOn(
                instance2.tippy.props,
                "onShow"
            ).and.callThrough();

            let container, visible_container;

            testutils.click($el1);
            await utils.timeout(1);

            expect(spy_show1).toHaveBeenCalled();
            expect(spy_show2).not.toHaveBeenCalled();
            container = document.querySelectorAll(".tippy-box");
            expect(container.length).toEqual(1);
            expect(
                container[0].querySelector(".tippy-content").textContent
            ).toBe(title1);

            spy_show1.calls.reset();
            spy_show2.calls.reset();

            testutils.click($el2);
            await utils.timeout(1);

            expect(spy_show1).not.toHaveBeenCalled();
            expect(spy_show2).toHaveBeenCalled();
            container = document.querySelectorAll(".tippy-box");
            expect(container.length).toEqual(2);
            expect(
                container[1].querySelector(".tippy-content").textContent
            ).toBe(title2);

            done();
        });
    });

    describe(`if the 'position-list' parameter exists`, () => {
        it(`'lt' will place the tooltip as 'right-start'`, async (done) => {
            const $el = testutils.createTooltip({
                data: "position-list: lt",
            });
            const instance = new pattern($el);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe(
                "right-start"
            );

            done();
        });
        it(`'lb' will place the tooltip as 'right-end'`, async (done) => {
            const $el = testutils.createTooltip({
                data: "position-list: lb",
            });
            const instance = new pattern($el);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("right-end");

            done();
        });
        it(`'lm' will place the tooltip as 'right'`, async (done) => {
            const $el = testutils.createTooltip({
                data: "position-list: lm",
            });

            const instance = new pattern($el);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("right");

            done();
        });
        it(`'bl' will place the tooltip as 'top-start'`, async (done) => {
            const $el = testutils.createTooltip({
                data: "position-list: bl",
            });

            const instance = new pattern($el);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("top-start");

            done();
        });
        it(`'br' will place the tooltip as 'top-end'`, async (done) => {
            const $el = testutils.createTooltip({
                data: "position-list: br",
            });

            const instance = new pattern($el);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("top-end");

            done();
        });
        it(`'bm' will place the tooltip as 'top'`, async (done) => {
            const $el = testutils.createTooltip({
                data: "position-list: bm",
            });

            const instance = new pattern($el);

            testutils.click($el);
            await utils.timeout(1);

            const container = document.querySelector(".tippy-box");
            expect(container.getAttribute("data-placement")).toBe("top");

            done();
        });
        describe(`and 'position-policy' is 'force'`, () => {
            it(`'tl;force' will place the tooltip as 'bottom-start'`, async (done) => {
                const $el = testutils.createTooltip({
                    data: "position-list: tl; position-policy: force",
                });

                const instance = new pattern($el);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe(
                    "bottom-start"
                );

                done();
            });
            it(`'tr;force' will place the tooltip as 'bottom-end'`, async (done) => {
                const $el = testutils.createTooltip({
                    data: "position-list: tr; position-policy: force",
                });

                const instance = new pattern($el);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe(
                    "bottom-end"
                );

                done();
            });
            it(`'tm;force' will place the tooltip as 'bottom'`, async (done) => {
                const $el = testutils.createTooltip({
                    data: "position-list: tm; position-policy: force",
                });

                const instance = new pattern($el);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe("bottom");

                done();
            });
            it(`'rt;force' will place the tooltip as 'left-start'`, async (done) => {
                const $el = testutils.createTooltip({
                    data: "position-list: rt; position-policy: force",
                });

                const instance = new pattern($el);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe(
                    "left-start"
                );

                done();
            });
            it(`'rb;force' will place the tooltip as 'left-end'`, async (done) => {
                const $el = testutils.createTooltip({
                    data: "position-list: rb; position-policy: force",
                });

                const instance = new pattern($el);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe(
                    "left-end"
                );

                done();
            });
            it(`'rm;force' will place the tooltip as 'left'`, async (done) => {
                const $el = testutils.createTooltip({
                    data: "position-list: rm; position-policy: force",
                });

                const instance = new pattern($el);

                testutils.click($el);
                await utils.timeout(1);

                const container = document.querySelector(".tippy-box");
                expect(container.getAttribute("data-placement")).toBe("left");

                done();
            });
        });
    });

    describe(`and ...`, () => {
        describe(`the 'mark-inactive' paramater`, () => {
            it("when true, toggles the active/inactive class on the trigger", async (done) => {
                const $el = testutils.createTooltip({
                    data: "mark-inactive: true",
                });
                const el = $el[0];
                const instance = new pattern($el);
                const spy_show = spyOn(
                    instance.tippy.props,
                    "onShow"
                ).and.callThrough();
                const spy_hide = spyOn(
                    instance.tippy.props,
                    "onHide"
                ).and.callThrough();

                let containers, expected;

                expect(el.classList.contains("active")).toBeFalsy();
                expect(el.classList.contains("inactive")).toBeTruthy();

                testutils.click($el);
                await utils.timeout(1);

                expect(spy_show).toHaveBeenCalled();
                containers = document.querySelectorAll(".tippy-box");
                expect(containers.length).toEqual(1);
                expected = containers[0].querySelector(".tippy-content")
                    .textContent;
                expect(el.classList.contains("active")).toBeTruthy();
                expect(el.classList.contains("inactive")).toBeFalsy();

                testutils.click($el);

                // TODO: inspect, why we have to wait for the tooltip to be closed.
                await utils.timeout(100);

                expect(spy_hide).toHaveBeenCalled();

                // TODO: inspect, why container are not removed.
                //containers = document.querySelectorAll(".tippy-box");
                //expect(containers.length).toEqual(0);
                expect(el.classList.contains("active")).toBeFalsy();
                expect(el.classList.contains("inactive")).toBeTruthy();

                done();
            });
            it("when false, the trigger does not get the active/inactive class", async (done) => {
                const $el = testutils.createTooltip({
                    data: "mark-inactive: false",
                });
                const el = $el[0];
                const instance = new pattern($el);
                const spy_show = spyOn(
                    instance.tippy.props,
                    "onShow"
                ).and.callThrough();
                const spy_hide = spyOn(
                    instance.tippy.props,
                    "onHide"
                ).and.callThrough();

                let containers;

                expect(el.classList.contains("active")).toBeFalsy();
                expect(el.classList.contains("inactive")).toBeFalsy();

                testutils.click($el);
                await utils.timeout(1);

                expect(spy_show).toHaveBeenCalled();
                containers = document.querySelectorAll(".tippy-box");
                expect(containers.length).toEqual(1);
                expect(el.classList.contains("active")).toBeFalsy();
                expect(el.classList.contains("inactive")).toBeFalsy();

                testutils.click($el);

                // TODO: inspect, why we have to wait for the tooltip to be closed.
                await utils.timeout(100);

                expect(spy_hide).toHaveBeenCalled();

                // TODO: inspect, why container are not removed.
                //containers = document.querySelectorAll(".tippy-box");
                //expect(containers.length).toEqual(0);
                expect(el.classList.contains("active")).toBeFalsy();
                expect(el.classList.contains("inactive")).toBeFalsy();

                done();
            });
        });
        describe(`if the 'trigger' parameter is 'hover'`, () => {
            describe(`if the 'source' parameter is 'title'`, () => {
                it(`will show the contents of the 'title' attribute`, async (done) => {
                    const $el = testutils.createTooltip({
                        data: "source: title; trigger: hover",
                    });
                    const el = $el[0];
                    const title = el.title;

                    const instance = new pattern($el);
                    const spy_show = spyOn(instance.tippy.props, "onShow");

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

                    done();
                });
                it("will hide the tooltip on mouseleave", async (done) => {
                    const $el = testutils.createTooltip({
                        data: "source: title; trigger: hover",
                    });

                    const instance = new pattern($el);
                    const spy_hide = spyOn(instance.tippy.props, "onHide");

                    // Shortcut any checks for mouse positions and just hide.
                    spyOn(instance.tippy, "hideWithInteractivity").and.callFake(
                        instance.tippy.hide
                    );

                    testutils.mouseenter($el);
                    await utils.timeout(1);
                    expect(spy_hide).not.toHaveBeenCalled();
                    expect(
                        document.querySelectorAll(".tippy-box").length
                    ).toEqual(1);

                    testutils.mouseleave($el);
                    await utils.timeout(1);
                    expect(spy_hide).toHaveBeenCalled();
                    expect(
                        document.querySelectorAll(".tippy-box").length
                    ).toEqual(0);

                    done();
                });
            });
            describe(`if the 'source' parameter is 'content'`, () => {
                describe("if the href attribute is hashtag", () => {
                    it("will show the content of the link", async (done) => {
                        const content = "Local content";
                        const $el = testutils.createTooltip({
                            data: "source: content; trigger: hover",
                            href: "#",
                            content: content,
                        });
                        const instance = new pattern($el);
                        const spy_show = spyOn(
                            instance.tippy.props,
                            "onShow"
                        ).and.callThrough();

                        testutils.mouseenter($el);
                        await utils.timeout(1);

                        expect(spy_show).toHaveBeenCalled();
                        expect(
                            document.querySelector(".tippy-box").textContent
                        ).toBe(content);

                        done();
                    });
                });
                describe("if the href attribute is #tooltip-source", () => {
                    it("will clone a DOM element from the page", async (done) => {
                        const content = "Local content";
                        const $el = testutils.createTooltip({
                            data: "source: content; trigger: hover",
                            href: "#tooltip-source",
                        });
                        testutils.createTooltipSource();
                        const instance = new pattern($el);
                        const spy_show = spyOn(
                            instance.tippy.props,
                            "onShow"
                        ).and.callThrough();

                        testutils.mouseenter($el);
                        await utils.timeout(1);

                        expect(spy_show).toHaveBeenCalled();
                        expect(
                            document.querySelector(".tippy-box strong")
                                .textContent
                        ).toBe(content);

                        done();
                    });
                });
            });
        });
        describe(`if the 'target' parameter is 'body'`, () => {
            it("will append the .tippy-box to the document.body", async (done) => {
                const $el = testutils.createTooltip({
                    data: "target: body",
                    href: "#",
                });
                const instance = new pattern($el);
                testutils.click($el);
                await utils.timeout(1);

                expect(
                    document.querySelectorAll("body > [data-tippy-root]").length
                ).toEqual(1);

                done();
            });
        });
        describe(`if the 'target' parameter is 'parent'`, () => {
            it(`will append the .tippy-box to the reference element's parent node`, async (done) => {
                const $el = testutils.createTooltip({
                    data: "target: parent",
                    href: "#",
                });
                const instance = new pattern($el);
                testutils.click($el);
                await utils.timeout(1);

                expect(
                    document.querySelectorAll("#lab > [data-tippy-root]").length
                ).toEqual(1);

                done();
            });
        });
        describe(`if the 'target' parameter is a selector`, () => {
            it("will append the .tippy-box to the selected element", async (done) => {
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

                const instance = new pattern($el);
                testutils.click($el);
                await utils.timeout(1);

                expect(
                    document.querySelectorAll("#child3 > [data-tippy-root]")
                        .length
                ).toEqual(1);

                done();
            });
        });
        describe(`if the "source" parameter is "auto"`, () => {
            describe(`if the "href" points to a document fragment`, () => {
                it(`will revert to "content"`, (done) => {
                    const $el = testutils.createTooltip({
                        data: "source: auto",
                        href: "#tooltip-source",
                    });
                    testutils.createTooltipSource();
                    const instance = new pattern($el);

                    // options.source is changed to "content"
                    expect(instance.options.source).toEqual("content");

                    expect(instance.tippy_options.content.textContent).toEqual(
                        "Local content"
                    );

                    done();
                });
            });
            describe(`if the "href" points to an external URL`, () => {
                it(`will revert to "ajax"`, (done) => {
                    const $el = testutils.createTooltip({
                        data: "source: auto",
                        href: "/tests/content.html#content",
                    });
                    const instance = new pattern($el);

                    // options.source is changed to "ajax"
                    expect(instance.options.source).toEqual("ajax");

                    done();
                });
            });
        });
    });

    describe(`if the 'source' parameter is 'ajax'`, () => {
        it("the default click action is prevented", (done) => {
            global.fetch = jest.fn().mockImplementation(mockFetch());

            const $el = testutils.createTooltip({
                data: "source: ajax",
                href: "tests/content.html#content",
            });
            const instance = new pattern($el);
            const click = new Event("click");

            const call_order = [];

            spyOn(click, "preventDefault").and.callFake(() =>
                call_order.push("preventDefault")
            );
            spyOn(instance, "_onAjax").and.callFake(() =>
                call_order.push("_onAjax")
            );

            $el[0].dispatchEvent(click);
            $el[0].dispatchEvent(click);
            $el[0].dispatchEvent(click);

            //expect(spy_ajax).toHaveBeenCalledBefore(spy_prevented);
            expect(call_order.indexOf("_onAjax")).toEqual(0);
            expect(call_order.includes("preventDefault")).toBeTruthy();

            global.fetch.mockClear();
            delete global.fetch;

            done();
        });

        it("will fetch its contents via ajax", async (done) => {
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

            const spy_ajax = spyOn(instance, "_onAjax").and.callThrough();
            const spy_show = spyOn(
                instance.tippy.props,
                "onShow"
            ).and.callThrough();

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            expect(spy_ajax).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            expect(
                document.querySelector(".tippy-box .tippy-content").textContent
            ).toBe("External content fetched via an HTTP request.");

            global.fetch.mockClear();
            delete global.fetch;

            done();
        });

        it("will fetch a section via ajax", async (done) => {
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

            const spy_ajax = spyOn(instance, "_onAjax").and.callThrough();
            const spy_show = spyOn(
                instance.tippy.props,
                "onShow"
            ).and.callThrough();

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            expect(spy_ajax).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            expect(
                document.querySelector(".tippy-box .tippy-content").textContent
            ).toBe("this will be extracted");

            global.fetch.mockClear();
            delete global.fetch;

            done();
        });

        it("will handle markdown content", async (done) => {
            global.fetch = jest.fn().mockImplementation(mockFetch("## hello."));

            const $el = testutils.createTooltip({
                data: "source: ajax; ajax-data-type: markdown",
                href: "http://test.com",
            });
            const instance = new pattern($el);

            const spy_ajax = spyOn(instance, "_onAjax").and.callThrough();
            const spy_show = spyOn(
                instance.tippy.props,
                "onShow"
            ).and.callThrough();

            testutils.click($el);
            await utils.timeout(1); // wait a tick for async fetch

            expect(spy_ajax).toHaveBeenCalled();
            expect(spy_show).toHaveBeenCalled();
            const content = document.querySelector(
                ".tippy-box .tippy-content h2"
            );
            expect(content).toBeTruthy();
            expect(content.textContent).toBe("hello.");

            global.fetch.mockClear();
            delete global.fetch;

            done();
        });

        it("will extract a section from markdown", async (done) => {
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

            const spy_ajax = spyOn(instance, "_onAjax").and.callThrough();
            const spy_show = spyOn(
                instance.tippy.props,
                "onShow"
            ).and.callThrough();

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

            done();
        });

        describe("will not fetch again until tooltip is hidden", () => {
            it("with click", async (done) => {
                global.fetch = jest
                    .fn()
                    .mockImplementation(
                        mockFetch(
                            "External content fetched via an HTTP request."
                        )
                    );

                const $el = testutils.createTooltip({
                    data: "source: ajax; trigger: click",
                    href: "http://test.com",
                });
                const instance = new pattern($el);

                const spy_ajax = spyOn(instance, "_onAjax").and.callThrough();
                const spy_fetch = spyOn(window, "fetch").and.callThrough();
                const spy_show = spyOn(
                    instance.tippy.props,
                    "onShow"
                ).and.callThrough();

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
                    document.querySelector(".tippy-box .tippy-content")
                        .textContent
                ).toBe("External content fetched via an HTTP request.");

                global.fetch.mockClear();
                delete global.fetch;

                done();
            });

            it("with hover", async (done) => {
                global.fetch = jest
                    .fn()
                    .mockImplementation(
                        mockFetch(
                            "External content fetched via an HTTP request."
                        )
                    );

                const $el = testutils.createTooltip({
                    data: "source: ajax; trigger: hover",
                    href: "http://test.com",
                });
                const instance = new pattern($el);

                const spy_ajax = spyOn(instance, "_onAjax").and.callThrough();
                const spy_fetch = spyOn(window, "fetch").and.callThrough();
                const spy_show = spyOn(
                    instance.tippy.props,
                    "onShow"
                ).and.callThrough();

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
                    document.querySelector(".tippy-box .tippy-content")
                        .textContent
                ).toBe("External content fetched via an HTTP request.");

                global.fetch.mockClear();
                delete global.fetch;

                done();
            });
        });
    });
});
