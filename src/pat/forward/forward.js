/**
* Patterns forward - Forward click events
*
* Copyright 2013 Simplon B.V. - Wichert Akkerman
*/

import $ from "jquery";
import { parser as Parser } from "patternslib-core";
import { registry } from "patternslib-core";

var parser = new Parser("forward");

parser.addArgument("selector");
parser.addArgument("trigger", "click", ["click", "auto"]);

var _ = {
    name: "forward",
    trigger: ".pat-forward",

    init: function($el, opts) {
        return $el.each(function() {
            var $el = $(this),
                options = parser.parse($el, opts);

            if (!options.selector) return;

            $el.on("click", null, options.selector, _._onClick);
            if (options.trigger === "auto") {
                $el.trigger("click");
            }
        });
    },

    _onClick: function(event) {
        $(event.data).click();
        event.preventDefault();
        event.stopPropagation();
    }
};
registry.register(_);
export default _;
