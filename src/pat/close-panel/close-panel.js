import Base from "../../core/base";
import dom from "../../core/dom";

export default Base.extend({
    name: "close-panel",
    trigger: ".close-panel",

    init() {
        this.el.addEventListener("click", async (e) => {
            // Find the first element which has a close-panel.
            // This should the panel-root itself.
            const panel = this.el.closest(".has-close-panel");

            // Get the close panel method.
            const close_method = dom.get_data(panel, "close_panel");

            // Now execute the method and close the panel.
            close_method && close_method(e);
        });
    },
});
