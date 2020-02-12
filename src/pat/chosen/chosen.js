/**
 * Patterns chosen - Wrapper for chosen
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012-2013 Simplon B.V. - Wichert Akkerman
 */
import registry from "../../core/registry";
import "jquery.chosen";

var _ = {
    name: "chosen",
    trigger: "select.pat-chosen",
    init: function($el) {
        $el.chosen();
        return $el;
    },

    destroy: function() {
        // XXX
    }
};

registry.register(_);
export default _;
