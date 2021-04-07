import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "../../core/base";
import utils from "../../core/utils";

export default Base.extend({
    name: "syntax-highlight",
    trigger: ".pat-syntax-highlight",

    async init() {
        const Prettify = (await import("google-code-prettify/src/prettify")).default; // prettier-ignore
        this.$el.addClass("prettyprint");
        utils.debounce(Prettify.prettyPrint, 50)();
    },
});
