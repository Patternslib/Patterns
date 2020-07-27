/**
* Patterns pat-polyfill-colour - Polyfill for colour inputs.
*
* Copyright 2014 Marko Durkovic
* Copyright 2014 Simplon B.V. - Wichert Akkerman
*/

import registry from "../../core/registry";
import $ from "jquery";
import "spectrum-colorpicker";

var _ = {
    name: "polyfill-color",
    trigger: "input.pat-colour-picker,input.pat-color-picker",
    init: function($el) {
        return $el.spectrum({ preferredFormat: "hex" });
    }
};

registry.register(_);
export default _;
