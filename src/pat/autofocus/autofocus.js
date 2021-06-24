import $ from "jquery";
import Base from "../../core/base";

let scheduled_task = null;
let registered_event_handler = false;

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

        this.setFocus(this.trigger);

        if (!registered_event_handler) {
            // Register the event handler only once.
            $(document).on("patterns-injected pat-update", (e) => {
                this.setFocus($(e.target).find(this.trigger));
            });
            registered_event_handler = true;
        }
    },

    setFocus(target) {
        // Exit if task is scheduled. setFocus operates on whole DOM anyways.
        if (scheduled_task) {
            return;
        }
        const $all = $(target);
        const visible = [...$all].filter((it) => $(it).is(":visible"));
        const empty = visible.filter((it) => it.value === "");
        const el = empty[0] || visible[0];
        if (el) {
            scheduled_task = setTimeout(() => {
                el.focus();
                scheduled_task = null;
            }, 10);
        }
    },
});
