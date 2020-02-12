import Base from "../../core/base";
import utils from "../../core/utils";
import prettify from "google-code-prettify";

export default Base.extend({
    name: "syntax-highlight",
    trigger: ".pat-syntax-highlight",

    init: function() {
        this.$el.addClass("prettyprint");
        utils.debounce(prettify.prettyPrint, 50)();
    }
});
