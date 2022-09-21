import Pattern from "./notification";
import utils from "../../core/utils";

describe("pat notification", function () {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("Gets initialized and will disappear as per default settings.", async function () {
        document.body.innerHTML = `
          <p class="pat-notification">
              okay
          </p>
        `;

        const el = document.querySelector(".pat-notification");
        expect(el.parentNode).toBe(document.body);

        new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(el.parentNode).not.toBe(document.body);
        expect(el.parentNode.classList.contains("pat-notification-panel")).toBe(true);
        expect(el.parentNode.classList.contains("has-close-panel")).toBe(true);

        // With jQuery animation, we cannot easily test closing the panel yet.
        // TODO: Fix when jQuery animation was removed.
    });
});
