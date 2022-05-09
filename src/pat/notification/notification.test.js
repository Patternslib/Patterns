import Pattern from "./notification";

describe("pat notification", function () {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("Gets initialized and will disappear as per default settings.", function () {
        document.body.innerHTML = `
          <p class="pat-notification">
              okay
          </p>
        `;

        const el = document.querySelector(".pat-notification");
        expect(el.parentNode).toBe(document.body);

        new Pattern(el);

        expect(el.parentNode).not.toBe(document.body);
        expect(el.parentNode.classList.contains("pat-notification-panel")).toBe(true);
        expect(el.parentNode.classList.contains("has-close-panel")).toBe(true);

        // With jQuery animation, we cannot easily test closing the panel yet.
        // TODO: Fix when jQuery animation was removed.
    });
});
