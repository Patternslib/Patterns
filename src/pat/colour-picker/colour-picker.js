/**
 * Patterns pat-polyfill-colour - Polyfill for colour inputs.
 *
 * Copyright 2014 Marko Durkovic
 * Copyright 2014 Simplon B.V. - Wichert Akkerman
 */
import registry from "../../core/registry";

var _ = {
    name: "polyfill-color",
    trigger: "input.pat-colour-picker,input.pat-color-picker",
    async init($el) {
        await import("spectrum-colorpicker");
        if (window.__patternslib_import_styles) {
            import("./_colour-picker.scss");
        }
        return $el.spectrum({ preferredFormat: "hex" });
    },
};

registry.register(_);
export default _;
