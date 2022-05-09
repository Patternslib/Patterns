import utils from "../../core/utils";
import registry from "../../core/registry";

import "./close-panel";
import "../modal/modal";
import "../tooltip/tooltip";

describe("pat close-panel", function () {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("Closes a modal's panel.", async function () {
        document.body.innerHTML = `
              <div id="pat-modal" class="pat-modal">
                <button id="close-modal" class="close-panel">close</button>
                <a class="pat-tooltip"
                    title="okay-ish"
                    data-pat-tooltip="closing: close-button">
                </a>
              </div>
            `;

        registry.scan(document.body); // Also need to instantiate close-panel
        await utils.timeout(1); // wait a tick async to settle.

        // Open the tooltip
        document.querySelector(".pat-tooltip").click();
        await utils.timeout(1); // wait a tick async to settle.
        expect(document.querySelectorAll(".tooltip-container").length).toBe(1);
        expect(document.querySelectorAll(".tooltip-container.has-close-panel").length).toBe(1); // prettier-ignore
        expect(document.querySelectorAll(".tooltip-container .pat-tooltip--close-button.close-panel").length).toBe(1); // prettier-ignore

        document.querySelector(".pat-tooltip--close-button").click();
        await utils.timeout(1); // wait a tick async to settle.
        expect(document.querySelectorAll(".tooltip-container").length).toBe(0);
        expect(document.querySelectorAll(".tooltip-container .pat-tooltip--close-button").length).toBe(0); // prettier-ignore

        document.querySelector("#close-modal").click();
        await utils.timeout(1); // wait a tick async to settle.
        expect(document.querySelectorAll(".pat-modal").length).toBe(0);
    });
});
