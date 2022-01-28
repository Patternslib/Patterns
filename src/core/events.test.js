import events from "./events";
import utils from "./utils";

describe("core.events tests", () => {
    describe("add / remove event listener", () => {
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
    });

    describe("event factories", () => {
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
});
