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
            var $block = $(this),
                options = parser.parse($block, opts);

            let $slider = $("<input/>", {
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
        var $block = event.data;
        $block.css("zoom", this.value);
    },
};

registry.register(zoom);
export default zoom;
