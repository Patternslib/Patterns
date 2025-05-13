import Base from "./base";
import { BasePattern } from "./basepattern";
import events, { event_listener_map, ListenerScope } from "./events";
import logging from "./logging";
import utils from "./utils";

describe("core.events tests", () => {
    describe("1 - add / remove event listener", () => {
        afterEach(() => {
            // Remove listeners on the long living elements after each test.
            events.remove_event_listener(document);
            events.remove_event_listener(window);
        });

        it("Uses a WeakMap, which does not keep the elements alive.", () => {
            expect(event_listener_map).toBeInstanceOf(WeakMap);
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

            expect(event_listener_map.get(el)?.get("test_once_event")).not.toBeDefined();
        });

        it("Removes the element from the event_listener_map after a once-event fired.", () => {
            const el = document.createElement("div");
            const cb = jest.fn();

            events.add_event_listener(el, "test", "test_once_event", cb, {
                once: true,
            });
            el.dispatchEvent(new Event("test"));

            expect(cb).toHaveBeenCalledTimes(1);
            expect(event_listener_map.has(el)).toBe(false);
        });

        it("Removes the entry from the event_listener_map when the signal is aborted.", () => {
            const el = document.createElement("div");
            const cb = jest.fn();
            const controller = new AbortController();

            events.add_event_listener(el, "test", "test_signal", cb, {
                signal: controller.signal,
            });
            expect(event_listener_map.get(el).has("test_signal")).toBe(true);

            controller.abort();
            el.dispatchEvent(new Event("test"));

            expect(cb).not.toHaveBeenCalled();
            expect(event_listener_map.has(el)).toBe(false);
        });

        it("Does not register anything for an already aborted signal.", () => {
            const el = document.createElement("div");
            const cb = jest.fn();
            const controller = new AbortController();
            controller.abort();

            events.add_event_listener(el, "test", "test_signal", cb, {
                signal: controller.signal,
            });
            el.dispatchEvent(new Event("test"));

            expect(cb).not.toHaveBeenCalled();
            expect(event_listener_map.has(el)).toBe(false);
        });

        it("Keeps a re-registered entry when the old signal is aborted.", () => {
            const el = document.createElement("div");
            const cb_old = jest.fn();
            const cb_new = jest.fn();
            const controller_old = new AbortController();
            const controller_new = new AbortController();

            events.add_event_listener(el, "test", "test_signal", cb_old, {
                signal: controller_old.signal,
            });
            events.add_event_listener(el, "test", "test_signal", cb_new, {
                signal: controller_new.signal,
            });

            controller_old.abort();
            expect(event_listener_map.get(el)?.has("test_signal")).toBe(true);

            el.dispatchEvent(new Event("test"));
            expect(cb_old).not.toHaveBeenCalled();
            expect(cb_new).toHaveBeenCalledTimes(1);
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
            expect(event_listener_map.has(el1)).toBe(false);
            expect(event_listener_map.has(el2)).toBe(true);

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

        it("Does not remove anything without an element.", () => {
            const el = document.createElement("div");
            const cb = jest.fn();
            const log = logging.getLogger("events");
            const spy_warn = jest.spyOn(log, "warn").mockImplementation(() => {});

            events.add_event_listener(el, "test", "test_event", cb);

            events.remove_event_listener(null, "test_event");
            events.remove_event_listener(undefined, "test_event");
            events.remove_event_listener();

            el.dispatchEvent(new Event("test"));
            expect(cb).toHaveBeenCalledTimes(1);
            expect(event_listener_map.get(el).has("test_event")).toBe(true);
            expect(spy_warn).toHaveBeenCalledTimes(3);

            spy_warn.mockRestore();
        });

        it("Supports namespacing by id prefix.", () => {
            const cb_a1 = jest.fn();
            const cb_a2 = jest.fn();
            const cb_b1 = jest.fn();

            events.add_event_listener(document, "keydown", "a--1", cb_a1);
            events.add_event_listener(document, "keydown", "a--2", cb_a2);
            events.add_event_listener(document, "keydown", "b--1", cb_b1);

            events.remove_event_listener(document, "a--*");

            expect([...event_listener_map.get(document).keys()]).toEqual(["b--1"]);

            document.dispatchEvent(new KeyboardEvent("keydown"));
            expect(cb_a1).not.toHaveBeenCalled();
            expect(cb_a2).not.toHaveBeenCalled();
            expect(cb_b1).toHaveBeenCalledTimes(1);

            events.remove_event_listener(document);
        });

        it("Ignores elements which do not support event listeners.", () => {
            expect(() => events.add_event_listener({}, "test", "id", () => {})).not.toThrow();
            expect(() => events.remove_event_listener({}, "id")).not.toThrow();
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

        it("focusin event", async () => {
            outer.addEventListener("focusin", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.focusin_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });

        it("focusout event", async () => {
            outer.addEventListener("focusout", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.focusout_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
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

    describe("6 - Listener scopes", () => {
        afterEach(() => {
            events.remove_event_listener(document);
            events.remove_event_listener(window);
        });

        it("6.1 - Creates a scope with the given or a generated namespace.", () => {
            const scope = events.listener_scope("ns");
            expect(scope).toBeInstanceOf(ListenerScope);
            expect(scope.namespace).toBe("ns");

            const scope_a = events.listener_scope();
            const scope_b = events.listener_scope();
            expect(scope_a.namespace).toBeTruthy();
            expect(scope_a.namespace).not.toBe(scope_b.namespace);
        });

        it("6.2 - Registers listeners under namespaced ids.", () => {
            const scope = events.listener_scope("ns");
            const cb = jest.fn();

            scope.add(document, "keydown", "key", cb);

            expect([...event_listener_map.get(document).keys()]).toEqual(["ns--key"]);
            expect([...scope.elements]).toEqual([document]);

            document.dispatchEvent(new KeyboardEvent("keydown"));
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it("6.3 - Passes options on to addEventListener.", () => {
            const scope = events.listener_scope("ns");
            const el = document.createElement("div");
            const cb = jest.fn();

            scope.add(el, "test", "once", cb, { once: true });
            el.dispatchEvent(new Event("test"));
            el.dispatchEvent(new Event("test"));

            expect(cb).toHaveBeenCalledTimes(1);
        });

        it("6.4 - remove removes a single listener and forgets the element after the last one.", () => {
            const scope = events.listener_scope("ns");
            const cb_key = jest.fn();
            const cb_up = jest.fn();

            scope.add(document, "keydown", "key", cb_key);
            scope.add(document, "keyup", "up", cb_up);

            scope.remove(document, "key");
            expect(scope.elements.has(document)).toBe(true);

            document.dispatchEvent(new KeyboardEvent("keydown"));
            document.dispatchEvent(new KeyboardEvent("keyup"));
            expect(cb_key).not.toHaveBeenCalled();
            expect(cb_up).toHaveBeenCalledTimes(1);

            scope.remove(document, "up");
            expect(scope.elements.has(document)).toBe(false);
        });

        it("6.5 - remove supports wildcards and removes all listeners of the scope on an element without a name.", () => {
            const scope = events.listener_scope("ns");
            const el1 = document.createElement("div");
            const el2 = document.createElement("div");

            scope.add(el1, "test", "a-1", () => {});
            scope.add(el1, "test", "a-2", () => {});
            scope.add(el1, "test", "b-1", () => {});
            scope.add(el2, "test", "a-1", () => {});

            scope.remove(el1, "a-*");
            expect([...event_listener_map.get(el1).keys()]).toEqual(["ns--b-1"]);
            expect(event_listener_map.get(el2).has("ns--a-1")).toBe(true);

            scope.remove(el1);
            expect(event_listener_map.has(el1)).toBe(false);
            expect([...scope.elements]).toEqual([el2]);
        });

        it("6.6 - remove_all removes all listeners of the scope on all elements.", () => {
            const scope = events.listener_scope("ns");
            const el = document.createElement("div");
            const cb_doc = jest.fn();
            const cb_win = jest.fn();
            const cb_el = jest.fn();

            scope.add(document, "keydown", "key", cb_doc);
            scope.add(window, "resize", "resize", cb_win);
            scope.add(el, "test", "test", cb_el);

            scope.remove_all();

            document.dispatchEvent(new KeyboardEvent("keydown"));
            window.dispatchEvent(new Event("resize"));
            el.dispatchEvent(new Event("test"));
            expect(cb_doc).not.toHaveBeenCalled();
            expect(cb_win).not.toHaveBeenCalled();
            expect(cb_el).not.toHaveBeenCalled();
            expect(scope.elements.size).toBe(0);
            expect(event_listener_map.has(el)).toBe(false);
        });

        it("6.7 - Scopes do not touch each other's or other listeners.", () => {
            const scope_a = events.listener_scope("a");
            const scope_ab = events.listener_scope("a--b");
            const cb_a = jest.fn();
            const cb_ab = jest.fn();
            const cb_other = jest.fn();

            scope_a.add(document, "keydown", "key", cb_a);
            scope_ab.add(document, "keydown", "key", cb_ab);
            events.add_event_listener(document, "keydown", "other", cb_other);

            scope_a.remove(document, "key");
            scope_a.remove_all();

            document.dispatchEvent(new KeyboardEvent("keydown"));
            expect(cb_a).not.toHaveBeenCalled();
            expect(cb_ab).toHaveBeenCalledTimes(1);
            expect(cb_other).toHaveBeenCalledTimes(1);
        });

        it("6.8 - Ignores missing elements and elements without event listener support.", () => {
            const scope = events.listener_scope("ns");

            scope.add(null, "test", "test", () => {});
            scope.add({}, "test", "test", () => {});
            expect(scope.elements.size).toBe(0);

            expect(() => scope.remove(null, "test")).not.toThrow();
            expect(() => scope.remove({}, "test")).not.toThrow();
        });

        it("6.9 - elements returns a copy.", () => {
            const scope = events.listener_scope("ns");
            scope.add(document, "keydown", "key", () => {});

            scope.elements.clear();
            expect(scope.elements.has(document)).toBe(true);
        });
    });
});
