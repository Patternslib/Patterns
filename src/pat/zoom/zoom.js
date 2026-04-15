import $ from "jquery";
import registry from "../../core/registry";
import Parser from "../../core/parser";

export const parser = new Parser("zoom");
parser.addArgument("min", 0);
parser.addArgument("max", 2);

var zoom = {
    name: "zoom",
    trigger: ".pat-zoom",

    init: function ($el, opts) {
        return $el.each(function () {
            const $block = $(this);
            const options = parser.parse($block, opts);

            const $slider = $("<input/>", {
                type: "range",
                step: "any",
                value: 1,
                min: options.min,
                max: options.max,
            });

            $slider.insertBefore($block).on("change input", null, $block, zoom.onZoom);
        });
    },

    onZoom: function (event) {
        const $block = event.data;
        $block[0].style.zoom = this.value;
    },
};

registry.register(zoom);
export default zoom;
