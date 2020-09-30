/**
 * Patterns pat-polyfill-colour - Polyfill for colour inputs.
 *
 * Copyright 2014 Marko Durkovic
 * Copyright 2014 Simplon B.V. - Wichert Akkerman
 */
import "regenerator-runtime/runtime"; // needed for ``await`` support
import registry from "../../core/registry";

var _ = {
    name: "polyfill-color",
    trigger: "input.pat-colour-picker,input.pat-color-picker",
    async init($el) {
        await import("spectrum-colorpicker");
        return $el.spectrum({ preferredFormat: "hex" });
    },
};

registry.register(_);
export default _;
