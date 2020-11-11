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
        const $visible = $all.filter((idx, it) => $(it).is(":visible"));
        if ($visible[0]) {
            setTimeout(() => $visible[0].focus(), 10);
        }
    },
});
