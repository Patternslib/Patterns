import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "../../core/base";
import utils from "../../core/utils";

// Lazy loading modules.
let Prettify;

export default Base.extend({
    name: "syntax-highlight",
    trigger: ".pat-syntax-highlight",

    async init() {
        Prettify = await import("google-code-prettify/src/prettify");
        Prettify = Prettify.default;

        this.$el.addClass("prettyprint");
        utils.debounce(Prettify.prettyPrint, 50)();
    },
});
