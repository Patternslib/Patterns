// Patterns forward - Forward click events
import Base from "../../core/base";
import Parser from "../../core/parser";
import utils from "../../core/utils";

const parser = new Parser("forward");

parser.addArgument("selector");
parser.addArgument("trigger", "click", ["click", "auto"]);
parser.addArgument("delay");

export default Base.extend({
    name: "forward",
    trigger: ".pat-forward",
    skip: false,

    init() {
        this.options = parser.parse(this.el, this.options);
        if (!this.options.selector) {
            return;
        }

        this.el.addEventListener("click", this.on_click.bind(this));
        if (this.options.trigger === "auto") {
            this.el.click();
        }
    },

    async on_click(event) {
        if (this.skip) {
            this.skip = false;
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (this.options.delay) {
            await utils.timeout(this.options.delay);
        }
        let targets;
        if (this.options.selector === "self") {
            this.skip = true;
            targets = [this.el];
        } else {
            targets = document.querySelectorAll(this.options.selector);
        }
        for (const el of targets) {
            el.click();
        }
    },
});

// Notes:
//
// We're using `ELEMENT.click()` instead of
// `ELEMENT.dispatchEvent(new Event("click"))`.
// The latter doesn't get recognized by jQuery and does not invoke the default
// action on an <a href> element.
//
