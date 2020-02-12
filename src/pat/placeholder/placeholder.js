import registry from "../../core/registry";
import "jquery.placeholder";

var pattern_spec = {
    name: "placeholder",
    trigger: ":input[placeholder]",

    init: function($el) {
        return $el.placeholder();
    }
};

// This is slightly more accurate test than Modernizr uses.
if (
    !(
        "placeholder" in document.createElement("input") &&
        "placeholder" in document.createElement("textarea")
    )
) {
    registry.register(pattern_spec);
}

export default pattern_spec;
