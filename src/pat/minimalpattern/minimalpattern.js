import Base from "../../core/base";
import Parser from "../../core/parser";
import logging from "../../core/logging";

const log = logging.getLogger("minimalpattern");
const parser = new Parser("minimalpattern");

parser.addArgument("background-color", "green");

export default Base.extend({
    name: "minimalpattern",
    trigger: ".pat-minimalpattern",

    init(el, opts) {
        if (el.jquery) {
            el = el[0];
        }
        this.el = el;
        this.options = parser.parse(el, opts);
        this.el.addEventListener("click", this.change_color.bind(this));
        log.info("pattern initialized");
    },

    change_color(e) {
        e.preventDefault();
        this.el.style["background-color"] = this.options.backgroundColor;
        log.info("element clicked");
    },
});
