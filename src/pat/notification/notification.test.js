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

        const instance = new Pattern(el);
        const spy_remove = jest.spyOn(instance, "remove");

        expect(el.parentNode).not.toBe(document.body);
        expect(el.parentNode.classList.contains("pat-notification-panel")).toBe(true);

        const btn_close = el.parentNode.querySelector(".close-panel");
        expect(btn_close).not.toBe(null);
        btn_close.click();

        await utils.timeout(1); // close-button is async - wait for it.

        expect(spy_remove).toHaveBeenCalled();
    });
});
