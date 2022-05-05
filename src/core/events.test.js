import Base from "./base";
import events from "./events";
import utils from "./utils";

describe("core.events tests", () => {
    describe("1 - add / remove event listener", () => {
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

        it("Registers events only once and unregisters events.", (done) => {
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

        it("Awaits an event to happen", async () => {
            const el = document.createElement("div");

            window.setTimeout(() => {
                el.dispatchEvent(new Event("init"));
            }, 1);

            await events.await_event(el, "init");

            // If test reaches this expect statement, all is fine.
            expect(true).toBe(true);
        });

        it("Awaits a pattern to be initialized", async () => {
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
    });

    describe("2 - event factories", () => {
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
            outer.addEventListener("submit", () => {
                catched = "outer";
            });
            inner.dispatchEvent(events.submit_event());
            await utils.timeout(1);
            expect(catched).toBe("outer");
        });
    });

    describe("3 - jQuery vs native", () => {
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

    describe("4 - Special DOM behavior", () => {
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
