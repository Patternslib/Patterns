import Base from "../../core/base";
import dom from "../../core/dom";

export default Base.extend({
    name: "close-panel",
    trigger: ".close-panel",

    init() {
        this.el.addEventListener("click", (e) => {
            // Find the first element which has a close-panel or is a dialog.
            // This should the panel-root itself.
            const panel = this.el.closest(".has-close-panel, dialog");

            if (!panel) {
                // Nothing to do. Exiting.
                return;
            } else if (panel.tagName === "DIALOG") {
                // Close the dialog.
                panel.close();
            } else if (panel.classList.contains("has-close-panel")) {
                // Get the close panel method.
                const close_method = dom.get_data(panel, "close_panel");

                // Now execute the method and close the panel.
                close_method && close_method(e);
            }
        });
    },
});
