/* pat-sticky - A pattern for a sticky polyfill */
import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";
import Stickyfill from "stickyfilljs";
import utils from "../../core/utils";

var parser = new Parser("sticky");
parser.addArgument("selector", "");

export default Base.extend({
    name: "sticky",
    trigger: ".pat-sticky",
    init: function () {
        this.options = parser.parse(this.$el);
        this.makeSticky();
        $("body").on(
            "pat-update",
            utils.debounce(this.onPatternUpdate.bind(this), 500)
        );

        /* recalc if the DOM changes. Should fix positioning issues when parts of the page get injected */

        return this.$el;
    },
    onPatternUpdate: function () {
        /* Handler which gets called when pat-update is triggered within
         * the .pat-sticky element.
         */
        Stickyfill.refreshAll();
        return true;
    },
    makeSticky: function () {
        if (this.options.selector === "") {
            this.$stickies = this.$el;
        } else {
            this.$stickies = this.$el.find(this.options.selector);
        }
        this.$stickies.each(function (idx, elem) {
            Stickyfill.add(elem);
        });
    },
});
