// Patterns forward - Forward click events
import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";

const parser = new Parser("forward");

parser.addArgument("selector");
parser.addArgument("trigger", "click", ["click", "auto"]);

export default Base.extend({
    name: "forward",
    trigger: ".pat-forward",

    init() {
        this.options = parser.parse(this.el, this.options);
        if (!this.options.selector) {
            return;
        }

        this.$el.on("click", this._onClick.bind(this));
        if (this.options.trigger === "auto") {
            this.$el.trigger("click");
        }
    },

    _onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this.options.selector).click();
    },
});
