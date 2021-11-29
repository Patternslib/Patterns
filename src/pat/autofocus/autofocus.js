import Base from "../../core/base";
import dom from "../../core/dom";

let scheduled_task = null;

export default Base.extend({
    name: "autofocus",
    trigger: `
        input.pat-autofocus,
        input[autofocus],
        select.pat-autofocus,
        select[autofocus],
        textarea.pat-autofocus,
        textarea[autofocus],
        button.pat-autofocus,
        button[autofocus]
    `,

    init() {
        if (window.self !== window.top) {
            // Do not autofocus in iframes.
            return;
        }
        this.set_focus();
    },

    set_focus() {
        if (dom.is_visible(this.el) && this.el.value === "") {
            // Set autofocus only for visible and empty inputs.

            // Clear scheduled tasks if there are any.
            // Note: Patterns scanning initizlizes patterns "inside-out", so
            //       DOM nodes later in the tree are initizlized first.
            //       With multiple pattern instantiations and then module-
            //       globally clearing and re-scheduling tasks we are
            //       initializing in the end the first pattern which matches
            //       the conditions.
            clearTimeout(scheduled_task);
            scheduled_task = setTimeout(() => {
                this.el.focus();
                scheduled_task = null;
            }, 100);
        }
    },
});
