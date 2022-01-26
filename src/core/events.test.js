import events from "./events";
import utils from "./utils";

describe("core.events tests", () => {
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

    it("submit event", async () => {
        outer.addEventListener("submit", () => {
            catched = "outer";
        });
        inner.dispatchEvent(events.submit_event());
        await utils.timeout(1);
        expect(catched).toBe("outer");
    });
});
