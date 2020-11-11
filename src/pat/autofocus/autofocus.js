import $ from "jquery";
import Base from "../../core/base";

export default Base.extend({
    name: "autofocus",
    trigger: ":input.pat-autofocus,:input[autofocus]",

    init() {
        this.setFocus(this.trigger);
        $(document).on("patterns-injected pat-update", (e) => {
            this.setFocus($(e.target).find(this.trigger));
        });
    },

    setFocus(target) {
        const $all = $(target);
        const visible = [...$all].filter((it) => $(it).is(":visible"));
        const empty = visible.filter((it) => it.value === "");
        const el = empty[0] || visible[0];
        if (el) {
            setTimeout(() => el.focus(), 10);
        }
    },
});
