import $ from "jquery";
import { BasePattern } from "../../core/base";
import registry from "../../core/registry";
import Parser from "../../core/parser";

export const parser = new Parser("zoom");
parser.addArgument("min", 0);
parser.addArgument("max", 2);

class zoom extends BasePattern {
    name = "zoom";
    static trigger = ".pat-zoom";

    init() {
        this.options = parser.parse(this.el, this.options);

        const slider = (this.slider = document.createElement("input"));
        slider.setAttribute("type", "range");
        slider.setAttribute("step", "any");
        slider.setAttribute("value", 1);
        slider.setAttribute("min", this.options.min);
        slider.setAttribute("max", this.options.max);
        slider.addEventListener("input", this.do_zoom.bind(this));

        this.el.parentNode.insertBefore(slider, this.el);
    }

    do_zoom() {
        this.el.css("zoom", this.slider.value);
    }
}

registry.register(zoom);
export default zoom;
