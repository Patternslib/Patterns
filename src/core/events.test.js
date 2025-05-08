import Base from "./base";
import { BasePattern } from "./basepattern";
import events, { event_listener_map } from "./events";
import utils from "./utils";

describe("core.events tests", () => {
    describe("1 - add / remove event listener", () => {
        afterEach(() => {
            // Clear event_listener_map after each test.
            event_listener_map.clear();
        });

        it("Registers events only once and unregisters events.", (done) => {
            // Mock a DOM element.
            const _el = {
                event_list: [],
                addEventListener(event_type, cb) {
                    this.event_list.push([event_type, cb]);
                },
                removeEventListener(event_type, cb) {
                    const idx = this.event_list.indexOf([event_type, cb]);
                    this.event_list.splice(idx, 1);
                },
            };

            const cb1 = () => {};
            const cb2 = () => {};

            // register one event handler
            events.add_event_listener(_el, "click", "test_click", cb1);
            expect(_el.event_list.length).toBe(1);
            expect(_el.event_list[0][1]).toBe(cb1);

            // register another event hander under the same id
            events.add_event_listener(_el, "click", "test_click", cb2);
            expect(_el.event_list.length).toBe(1);
            expect(_el.event_list[0][1]).toBe(cb2);

            // register two more event handlers with unique ids
            events.add_event_listener(_el, "click", "test_click_2", () => {});
            events.add_event_listener(_el, "click", "test_click_3", () => {});
            expect(_el.event_list.length).toBe(3);

            // remove one specific event handler
            events.remove_event_listener(_el, "test_click_2");
            expect(_el.event_list.length).toBe(2);

            // try to remove an unregistered event handler
            events.remove_event_listener(_el, "test_click_4");
            expect(_el.event_list.length).toBe(2);

            // remove all registered event handlers on that element
            events.remove_event_listener(_el);
            expect(_el.event_list.length).toBe(0);

            done();
        });

        it("Supports once-events and unregisters them from the event_listener_map", () => {
            const el = document.createElement("div");

            // register the once-event handler
            events.add_event_listener(el, "test", "test_once_event", () => {}, {
                once: true,
            });

            expect(event_listener_map.get(el).get("test_once_event")).toBeDefined();
            el.dispatchEvent(new Event("test"));

            expect(event_listener_map.get(el).get("test_once_event")).not.toBeDefined();
        });

        it("Removes a specific event listener.", () => {
            const el = document.createElement("div");

            let cnt = 0;

            // register the once-event handler
            events.add_event_listener(el, "test", "test_event", () => cnt++);
            expect(event_listener_map.get(el).get("test_event")).toBeDefined();

            el.dispatchEvent(new Event("test"));
            expect(cnt).toBe(1);

            el.dispatchEvent(new Event("test"));
            expect(cnt).toBe(2);

            events.remove_event_listener(el, "test_event");

            // Now the event listener should be removed.
            expect(event_listener_map.get(el)?.get("test_once_event")).not.toBeDefined();
            // Even the element itself should be removed, if there are no more event listeners on it.
            expect(event_listener_map.get("el")).not.toBeDefined();

            // counter should not increase anymore
            el.dispatchEvent(new Event("test"));
            expect(cnt).toBe(2);
        });

        it("Remove single and all event listeners from an element, not touching others.", () => {
            const el1 = document.createElement("div");
            const el2 = document.createElement("div");

            let cnt1 = 0;
            let cnt2 = 0;
            let cnt3 = 0;

            const shared_cb = () => {
                cnt1++;
            };

            // register the event handlers
            events.add_event_listener(el1, "test1", "test_event_1", shared_cb);
            events.add_event_listener(el1, "test2", "test_event_2", shared_cb);
            events.add_event_listener(el1, "test3", "test_event_3", () => cnt2++);
            events.add_event_listener(el2, "test4", "test_event_4", () => cnt3++);

            expect(event_listener_map.get(el1).get("test_event_1")).toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_2")).toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_3")).toBeDefined();
            expect(event_listener_map.get(el2).get("test_event_4")).toBeDefined();

            expect(event_listener_map.size).toBe(2);

            el1.dispatchEvent(new Event("test1"));
            expect(cnt1).toBe(1);
            expect(cnt2).toBe(0);
            expect(cnt3).toBe(0);

            el1.dispatchEvent(new Event("test1"));
            expect(cnt1).toBe(2);
            expect(cnt2).toBe(0);
            expect(cnt3).toBe(0);

            el1.dispatchEvent(new Event("test2"));
            expect(cnt1).toBe(3);
            expect(cnt2).toBe(0);
            expect(cnt3).toBe(0);

            el1.dispatchEvent(new Event("test3"));
            expect(cnt1).toBe(3);
            expect(cnt2).toBe(1);
            expect(cnt3).toBe(0);

            el2.dispatchEvent(new Event("test4"));
            expect(cnt1).toBe(3);
            expect(cnt2).toBe(1);
            expect(cnt3).toBe(1);

            // Remove only test_event_1
            events.remove_event_listener(el1, "test_event_1");
            expect(event_listener_map.get(el1).get("test_event_1")).not.toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_2")).toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_3")).toBeDefined();
            expect(event_listener_map.get(el2).get("test_event_4")).toBeDefined();
            expect(event_listener_map.size).toBe(2);

            // Counter should not increase anymore on event "test1"
            el1.dispatchEvent(new Event("test1"));
            expect(cnt1).toBe(3);
            expect(cnt2).toBe(1);
            expect(cnt3).toBe(1);

            // Rest should not be affected.
            el1.dispatchEvent(new Event("test2"));
            el1.dispatchEvent(new Event("test3"));
            el2.dispatchEvent(new Event("test4"));
            expect(cnt1).toBe(4);
            expect(cnt2).toBe(2);
            expect(cnt3).toBe(2);

            // Remove all event handlers on el1
            events.remove_event_listener(el1);
            expect(event_listener_map.get(el1)).not.toBeDefined();
            expect(event_listener_map.size).toBe(1);

            // Counter should not increase anymore on el1
            el1.dispatchEvent(new Event("test1"));
            el1.dispatchEvent(new Event("test2"));
            el1.dispatchEvent(new Event("test3"));
            expect(cnt1).toBe(4);
            expect(cnt2).toBe(2);
            expect(cnt3).toBe(2);

            // But el2 should still work.
            el2.dispatchEvent(new Event("test4"));
            expect(cnt1).toBe(4);
            expect(cnt2).toBe(2);
            expect(cnt3).toBe(3);
        });

        it("Remove all events matching exactly an id from any element.", () => {
            const el1 = document.createElement("div");
            const el2 = document.createElement("div");

            let cnt1 = 0;
            let cnt2 = 0;
            let cnt3 = 0;

            const shared_cb = () => {
                cnt1++;
            };

            // register the event handlers
            events.add_event_listener(el1, "test1", "test_event_1", shared_cb);
            events.add_event_listener(el1, "test2", "test_event_2", shared_cb);
            events.add_event_listener(el1, "test3", "test_event_3", () => cnt2++);
            events.add_event_listener(el2, "test4", "test_event_4", () => cnt3++);

            expect(event_listener_map.get(el1).get("test_event_1")).toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_2")).toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_3")).toBeDefined();
            expect(event_listener_map.get(el2).get("test_event_4")).toBeDefined();

            expect(event_listener_map.size).toBe(2);

            el1.dispatchEvent(new Event("test1"));
            expect(cnt1).toBe(1);
            expect(cnt2).toBe(0);
            expect(cnt3).toBe(0);

            el1.dispatchEvent(new Event("test1"));
            expect(cnt1).toBe(2);
            expect(cnt2).toBe(0);
            expect(cnt3).toBe(0);

            el1.dispatchEvent(new Event("test2"));
            expect(cnt1).toBe(3);
            expect(cnt2).toBe(0);
            expect(cnt3).toBe(0);

            el1.dispatchEvent(new Event("test3"));
            expect(cnt1).toBe(3);
            expect(cnt2).toBe(1);
            expect(cnt3).toBe(0);

            el2.dispatchEvent(new Event("test4"));
            expect(cnt1).toBe(3);
            expect(cnt2).toBe(1);
            expect(cnt3).toBe(1);

            // Remove only test_event_1
            events.remove_event_listener(undefined, "test_event_1");
            expect(event_listener_map.get(el1).get("test_event_1")).not.toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_2")).toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_3")).toBeDefined();
            expect(event_listener_map.get(el2).get("test_event_4")).toBeDefined();
            expect(event_listener_map.size).toBe(2);

            // Counter should not increase anymore on event "test1"
            el1.dispatchEvent(new Event("test1"));
            expect(cnt1).toBe(3);
            expect(cnt2).toBe(1);
            expect(cnt3).toBe(1);

            // Rest should not be affected.
            el1.dispatchEvent(new Event("test2"));
            el1.dispatchEvent(new Event("test3"));
            el2.dispatchEvent(new Event("test4"));
            expect(cnt1).toBe(4);
            expect(cnt2).toBe(2);
            expect(cnt3).toBe(2);

            // Remove rest of event handlers on el1
            events.remove_event_listener(undefined, "test_event_2");
            events.remove_event_listener(undefined, "test_event_3");
            expect(event_listener_map.get(el1)).not.toBeDefined();
            expect(event_listener_map.size).toBe(1);

            // Counter should not increase anymore on el1
            el1.dispatchEvent(new Event("test1"));
            el1.dispatchEvent(new Event("test2"));
            el1.dispatchEvent(new Event("test3"));
            expect(cnt1).toBe(4);
            expect(cnt2).toBe(2);
            expect(cnt3).toBe(2);

            // But el2 should still work.
            el2.dispatchEvent(new Event("test4"));
            expect(cnt1).toBe(4);
            expect(cnt2).toBe(2);
            expect(cnt3).toBe(3);
        });

        it("Remove all event listeners at once.", () => {
            const el1 = document.createElement("div");
            const el2 = document.createElement("div");

            // register the event handlers
            events.add_event_listener(el1, "test1", "test_event_1", () => {});
            events.add_event_listener(el1, "test2", "test_event_2", () => {});
            events.add_event_listener(el1, "test3", "test_event_3", () => {});
            events.add_event_listener(el2, "test4", "test_event_4", () => {});

            expect(event_listener_map.get(el1).get("test_event_1")).toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_2")).toBeDefined();
            expect(event_listener_map.get(el1).get("test_event_3")).toBeDefined();
            expect(event_listener_map.get(el2).get("test_event_4")).toBeDefined();

            expect(event_listener_map.size).toBe(2);

            // Remove all event listeners
            events.remove_event_listener();
            expect(event_listener_map.size).toBe(0);
        });

        it("Remove wildcard matching event listeners.", () => {
            const el = document.createElement("div");

            // register the event handlers
            events.add_event_listener(el, "test", "test_event_1", () => {});
            events.add_event_listener(el, "test", "test_event_2", () => {});
            events.add_event_listener(el, "test", "test_event_3", () => {});

            events.add_event_listener(el, "test", "a_aha", () => {});
            events.add_event_listener(el, "test", "b_aha", () => {});
            events.add_event_listener(el, "test", "c_aha", () => {});

            events.add_event_listener(el, "test", "ok_aha_ok", () => {});
            events.add_event_listener(el, "test", "ok_bhb_ok", () => {});
            events.add_event_listener(el, "test", "ok_chc_ok", () => {});

            events.add_event_listener(el, "test", "oh_aha_ok", () => {});
            events.add_event_listener(el, "test", "ah_bhb_ok", () => {});
            events.add_event_listener(el, "test", "uh_chc_ok", () => {});

            expect(event_listener_map.get(el).size).toBe(12);

            events.remove_event_listener(el, "test_event_*");
            expect(event_listener_map.get(el).size).toBe(9);

            events.remove_event_listener(el, "*_aha");
            expect(event_listener_map.get(el).size).toBe(6);

            events.remove_event_listener(el, "ok_*_ok");
            expect(event_listener_map.get(el).size).toBe(3);

            events.remove_event_listener(el, "*h_*_ok");
            expect(event_listener_map.get(el)).not.toBeDefined();
        });
    });

    describe("2 - await pattern initialization", () => {
        it("Awaits an event to happen.", async () => {
            const el = document.createElement("div");

            window.setTimeout(() => {
                el.dispatchEvent(new Event("init"));
            }, 1);

            await events.await_event(el, "init");

            // If test reaches this expect statement, all is fine.
            expect(true).toBe(true);
        });

        it("Awaits a pattern to be initialized.", async () => {
            const pat = Base.extend({
                name: "tmp",
                trigger: ".pat-tmp",
                init: function () {},
            });

            const el = document.createElement("div");
            const instance = new pat(el);

            await events.await_pattern_init(instance);

            // If test reaches this expect statement, all is fine.
            expect(true).toBe(true);
        });

        it("Awaits a class based pattern to be initialized.", async () => {
            class Pat extends BasePattern {
                static name = "tmp";
                static trigger = ".pat-tmp";
                init() {}
            }

            const el = document.createElement("div");
            const instance = new Pat(el);

            await events.await_pattern_init(instance);

            // If test reaches this expect statement, all is fine.
            expect(true).toBe(true);

            // The same pattern cannot be registered twice without destroying
            // the first one. If the same pattern is initialized twice on the
            // same element, a event is thrown.
            const pat2 = new Pat(el);
            try {
                await events.await_pattern_init(pat2);
            } catch (e) {
                expect(e instanceof Error).toBe(true);
                expect(e.message).toBe(`Pattern "tmp" not initialized.`);
            }

            // We can also use the catch method of the promise to handle that
            // case.
            const pat3 = new Pat(el);
            await events.await_pattern_init(pat3).catch((e) => {
                expect(e instanceof Error).toBe(true);
                expect(e.message).toBe(`Pattern "tmp" not initialized.`);
                return; // We need to return here.
            });

            // If test reaches this expect statement, the not-init event was
            // catched.
            expect(true).toBe(true);
        });

        it("Allows to initialize the same pattern in a nested structure.", async () => {
            class Pat extends BasePattern {
                static name = "tmp";
                static trigger = ".pat-tmp";
                init() {}
            }

            const div = document.createElement("div");
            const span = document.createElement("span");
            div.append(span);

            new Pat(span);
            // need to wait a tick as basepattern initializes also with a
            // tick delay.
            await utils.timeout(1);

            // Next one isn't initialized and throws an bubbling not-init error.
            new Pat(span);
            const instance_div = new Pat(div);

            // The bubbling not-init error would be catched if there wasn't a
            // check for the origin of the error which has to be the same as
            // the Pattern element.
            await events.await_pattern_init(instance_div);

            // If test reaches this expect statement, all is fine.
            expect(true).toBe(true);
        });
    });

    describe("3 - event factories", () => {
        let catched;
        let outer;
        let inner;

        beforeEach(() => {
            catched = null;
            const el = document.createElement("div");
            el.innerHTML = `
              <div id="outer">
                <div id="inner"></div>
              </div>
            `;
            outer = el.querySelector("#outer");
            inner = el.querySelector("#inner");
        });

        it("generic event", async () => {
            const name = "fantasy_event";
            outer.addEventListener(name, () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.generic_event(name));
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("update event", async () => {
            outer.addEventListener("pat-update", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.update_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("update event with data", async () => {
            let event;
            outer.addEventListener("pat-update", (e) => {
                event = e;
            });
            const data = {"foo": "bar"};
            inner.dispatchEvent(events.update_event(data));
            await utils.timeout(1);
            expect(event.detail).toBe(data);
        });

        it("blur event", async () => {
            outer.addEventListener("blur", () => {
                catched = "outer";
            });
            inner.addEventListener("blur", () => {
                catched = "inner";
            });
            inner.dispatchEvent(events.blur_event());
            await utils.timeout(1);
            expect(catched).toBe("inner");
        });

        it("click event", async () => {
            outer.addEventListener("click", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.click_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("change event", async () => {
            outer.addEventListener("change", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.change_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("focus event", async () => {
            outer.addEventListener("focus", () => {
                catched = "outer";
            });
            inner.addEventListener("focus", () => {
                catched = "inner";
            });
            inner.dispatchEvent(events.focus_event());
            await utils.timeout(1);
            expect(catched).toBe("inner");
        });

        it("input event", async () => {
            outer.addEventListener("input", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.input_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("mousedown event", async () => {
            outer.addEventListener("mousedown", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.mousedown_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("mouseup event", async () => {
            outer.addEventListener("mouseup", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.mouseup_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("scroll event", async () => {
            outer.addEventListener("scroll", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.scroll_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("submit event", async () => {
            let submitter = "not defined";
            outer.addEventListener("submit", (e) => {
                catched = "outer";
                submitter = e.submitter;
            });
            inner.dispatchEvent(events.submit_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
            expect(submitter).toBe(undefined);
        });

        it("submit event with defined submitter", async () => {
            let submitter = "not defined";
            outer.addEventListener("submit", (e) => {
                catched = "outer";
                submitter = e.submitter;
            });
            inner.dispatchEvent(events.submit_event({ submitter: inner }));
            await utils.timeout(1);
            expect(catched).toBe("outer");
            expect(submitter).toBe(inner);
        });

        it("dragstart event", async () => {
            outer.addEventListener("dragstart", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.dragstart_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("dragend event", async () => {
            outer.addEventListener("dragend", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.dragend_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });
    });

    describe("4 - jQuery vs native", () => {
        // These tests show an annoying difference between jQuery and native
        // JavaScript events. jQuery catches native JavaScript events, which is
        // good. But events triggered by jQuery are not compatibel with native
        // JavaScript events and are not catched by native JavaScript event
        // handlers.
        // We want to get rid of jQuery events in the mid-term.

        it("jQuery catches native", async () => {
            let catched = false;
            const $ = (await import("jquery")).default;
            const el = document.createElement("input");
            el.setAttribute("type", "text");
            el.setAttribute("name", "inp");
            $(el).on("input", () => {
                catched = true;
            });
            el.dispatchEvent(events.input_event());
            await utils.timeout(1);
            expect(catched).toBe(true);
        });

        it("native does not catch jQuery", async () => {
            let catched = false;
            const $ = (await import("jquery")).default;
            const el = document.createElement("input");
            el.setAttribute("type", "text");
            el.setAttribute("name", "inp");
            el.addEventListener("input", () => {
                catched = true;
            });
            $(el).trigger("input");
            await utils.timeout(1);
            expect(catched).toBe(false);
        });
    });

    describe("5 - Special DOM behavior", () => {
        afterEach(() => {
            document.body.innerHTML = "";
        });

        it("4.1 - Two click events when clicking on a label wrapping a checkbox.", async () => {
            // Clicking on the label emits a click on the checkbox, which bubbles up.
            // This results in two clicks.
            // This behavior was seen in Chrome 98, but not in jsDOM.

            document.body.innerHTML = `
              <label>
                <input type="checkbox" name="ok" />
              </label>
            `;

            let counter = 0;
            const label = document.querySelector("label");

            label.addEventListener("click", () => counter++);

            label.dispatchEvent(events.click_event());
            // Actually jsDOM does not emit a second click. But Chrome does.
            // Let's fake this behavior to make the point.
            document.querySelector("input").dispatchEvent(events.click_event());
            await utils.timeout(1);
            await utils.timeout(1);

            expect(counter).toBe(2);
        });
    });
});
