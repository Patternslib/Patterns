import utils from "../../core/utils";
import pat_modal from "../modal/modal";
import registry from "../../core/registry";

import "./close-panel";
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
        expect(document.querySelectorAll(".tooltip-container .pat-tooltip--close-button.close-panel").length).toBe(1); // prettier-ignore

        document.querySelector(".pat-tooltip--close-button").click();
        await utils.timeout(1); // close-button is async - wait for it.
        await utils.timeout(1); // hide is async - wait for it.
        expect(document.querySelectorAll(".tooltip-container").length).toBe(0);
        expect(document.querySelectorAll(".tooltip-container .pat-tooltip--close-button").length).toBe(0); // prettier-ignore

        document.querySelector("#close-modal").click();
        await utils.timeout(1); // close-button is async - wait for it.
        await utils.timeout(1); // destroy is async - wait for it.
        expect(document.querySelectorAll(".pat-modal").length).toBe(0);
    });

    it("Closes a dialog's panel.", async function () {
        document.body.innerHTML = `
              <dialog open>
                <button class="close-panel">close</button>
              </div>
            `;

        registry.scan(document.body); // Also need to instantiate close-panel

        const dialog = document.querySelector("dialog");

        expect(dialog.open).toBe(true);

        document.querySelector(".close-panel").click();
        await utils.timeout(1); // close-button is async - wait for it.

        expect(dialog.open).toBe(false);
    });

    it("Prevents closing a panel with an invalid form when submitting but allow to cancel and close.", async function () {
        const spy_destroy_modal = jest.spyOn(pat_modal.prototype, "destroy");

        document.body.innerHTML = `
          <div class="pat-modal">
            <form action="." class="pat-validation">
              <input name="ok" required />
              <button class="close-panel submit">submit</button>
              <button class="close-panel cancel" type="button">cancel</button>
            </form>
          </div>
        `;
        const el = document.querySelector("form");

        registry.scan(document.body);
        await utils.timeout(1); // wait a tick for async to settle.

        el.querySelector("button.submit").click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(spy_destroy_modal).not.toHaveBeenCalled();

        // A non-submit close-panel button does not check for validity.
        el.querySelector("button.cancel").click();
        await utils.timeout(1); // wait a tick for async to settle.

        expect(spy_destroy_modal).toHaveBeenCalled();
    });
});
