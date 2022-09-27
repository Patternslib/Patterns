import Base from "../../core/base";
import events from "../../core/events";
import utils from "../../core/utils";

export default Base.extend({
    name: "close-panel",
    trigger: ".close-panel",

    init() {
        // Close panel support for dialog panels
        // Other modals are handled in pat-modal.
        const dialog_panel = this.el.closest("dialog");
        if (dialog_panel) {
            events.add_event_listener(
                dialog_panel,
                "close-panel",
                "close-panel--dialog",
                () => {
                    dialog_panel.close();
                }
            );
        }

        this.el.addEventListener("click", async (e) => {
            await utils.timeout(0); // Wait for other patterns, like pat-validation.

            if (
                e.target.matches("[type=submit], button:not([type=button])") &&
                this.el.closest("form")?.checkValidity() === false
            ) {
                // Prevent closing an invalid form when submitting.
                return;
            }

            this.el.dispatchEvent(
                new Event("close-panel", { bubbles: true, cancelable: true })
            );
        });
    },
});
