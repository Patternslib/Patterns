/* Patterns bundle configuration.
 * All imports here will go into the compiled bundle.
 */

// Import base
import registry from "./core/registry";

//// Import all used patterns for the bundle to be generated
import "./core/push_kit";
import "./pat/focus/focus";

// Importing pattern styles in JavaScript
// Set to ``true`` to include core styles via JavaScript
//window.__patternslib_import_styles = false;

const lazy_patterns = {
    "inject": {
        trigger: ".pat-inject",
        importer: async () => (await import("./pat/inject/inject")).default,
    },
    "validation": {
        trigger: "form.pat-validation",
        importer: async () => (await import("./pat/validation/validation")).default,
    },

    "ajax": {
        trigger: ".pat-ajax",
        importer: async () => (await import("./pat/ajax/ajax")).default,
    },
    "autoscale": {
        trigger: ".pat-auto-scale",
        importer: async () => (await import("./pat/auto-scale/auto-scale")).default,
    },
    "autosubmit": {
        trigger: ".pat-autosubmit, .pat-auto-submit",
        importer: async () => (await import("./pat/auto-submit/auto-submit")).default,
    },
    "autosuggest": {
        trigger: ".pat-autosuggest,.pat-auto-suggest",
        importer: async () => (await import("./pat/auto-suggest/auto-suggest")).default,
    },
    "autofocus": {
        trigger: `
        input.pat-autofocus,
        input[autofocus],
        select.pat-autofocus,
        select[autofocus],
        textarea.pat-autofocus,
        textarea[autofocus],
        button.pat-autofocus,
        button[autofocus]
    `,
        importer: async () => (await import("./pat/autofocus/autofocus")).default,
    },
    "breadcrumbs": {
        trigger: "nav.pat-breadcrumbs",
        importer: async () => (await import("./pat/breadcrumbs/breadcrumbs")).default,
    },
    "bumper": {
        trigger: ".pat-bumper",
        importer: async () => (await import("./pat/bumper/bumper")).default,
    },
    "calendar": {
        trigger: ".pat-calendar",
        importer: async () => (await import("./pat/calendar/calendar")).default,
    },
    "carousel": {
        trigger: ".pat-carousel",
        importer: async () => (await import("./pat/carousel/carousel")).default,
    },
    "checklist": {
        trigger: ".pat-checklist",
        importer: async () => (await import("./pat/checklist/checklist")).default,
    },
    "clone": {
        trigger: ".pat-clone",
        importer: async () => (await import("./pat/clone/clone")).default,
    },
    "clone-code": {
        trigger: ".pat-clone-code",
        importer: async () => (await import("./pat/clone-code/clone-code")).default,
    },
    "collapsible": {
        trigger: ".pat-collapsible",
        importer: async () => (await import("./pat/collapsible/collapsible")).default,
    },
    "polyfill-color": {
        trigger: "input.pat-colour-picker,input.pat-color-picker",
        importer: async () =>
            (await import("./pat/colour-picker/colour-picker")).default,
    },
    "date-picker": {
        trigger: ".pat-date-picker",
        importer: async () => (await import("./pat/date-picker/date-picker")).default,
    },
    "datetime-picker": {
        trigger: ".pat-datetime-picker",
        importer: async () =>
            (await import("./pat/datetime-picker/datetime-picker")).default,
    },
    "depends": {
        trigger: ".pat-depends",
        importer: async () => (await import("./pat/depends/depends")).default,
    },
    "display-time": {
        trigger: ".pat-display-time",
        importer: async () => (await import("./pat/display-time/display-time")).default,
    },
    "equaliser": {
        trigger: ".pat-equaliser, .pat-equalizer",
        importer: async () => (await import("./pat/equaliser/equaliser")).default,
    },
    "expandable": {
        trigger: "ul.pat-expandable",
        importer: async () =>
            (await import("./pat/expandable-tree/expandable-tree")).default,
    },
    "form-state": {
        trigger: "form.pat-form-state",
        importer: async () => (await import("./pat/form-state/form-state")).default,
    },
    "forward": {
        trigger: ".pat-forward",
        importer: async () => (await import("./pat/forward/forward")).default,
    },
    "fullscreen-close": {
        trigger: ".close-fullscreen",
        importer: async () =>
            (await import("./pat/fullscreen/fullscreen-close")).default,
    },
    "fullscreen": {
        trigger: ".pat-fullscreen",
        importer: async () => (await import("./pat/fullscreen/fullscreen")).default,
    },
    "gallery": {
        trigger: ".pat-gallery",
        importer: async () => (await import("./pat/gallery/gallery")).default,
    },
    "image-crop": {
        trigger: "img.pat-image-crop",
        importer: async () => (await import("./pat/image-crop/image-crop")).default,
    },
    "legend": {
        trigger: "legend",
        importer: async () => (await import("./pat/legend/legend")).default,
    },
    "markdown": {
        trigger: ".pat-markdown",
        importer: async () => (await import("./pat/markdown/markdown")).default,
    },
    "masonry": {
        trigger: ".pat-masonry",
        importer: async () => (await import("./pat/masonry/masonry")).default,
    },
    "menu": {
        trigger: ".pat-menu",
        importer: async () => (await import("./pat/menu/menu")).default,
    },
    "modal": {
        trigger: "div.pat-modal, a.pat-modal, form.pat-modal, .pat-modal.pat-subform",
        importer: async () => (await import("./pat/modal/modal")).default,
    },
    "navigation": {
        trigger: ".pat-navigation",
        importer: async () => (await import("./pat/navigation/navigation")).default,
    },
    "notification": {
        trigger: ".pat-notification",
        importer: async () => (await import("./pat/notification/notification")).default,
    },
    "push": {
        trigger: ".pat-push",
        importer: async () => (await import("./pat/push/push")).default,
    },
    "scroll": {
        trigger: ".pat-scroll",
        importer: async () => (await import("./pat/scroll/scroll")).default,
    },
    "scroll-box": {
        trigger: ".pat-scroll-box",
        importer: async () => (await import("./pat/scroll-box/scroll-box")).default,
    },
    "scroll-marker": {
        trigger: ".pat-scroll-marker",
        importer: async () =>
            (await import("./pat/scroll-marker/scroll-marker")).default,
    },
    "selectbox": {
        trigger: ".pat-selectbox",
        importer: async () => (await import("./pat/selectbox/selectbox")).default,
    },
    "slides": {
        trigger: ".pat-slides",
        importer: async () => (await import("./pat/slides/slides")).default,
    },
    "sortable": {
        trigger: ".pat-sortable",
        importer: async () => (await import("./pat/sortable/sortable")).default,
    },
    "stacks": {
        trigger: ".pat-stacks",
        importer: async () => (await import("./pat/stacks/stacks")).default,
    },
    "subform": {
        trigger: ".pat-subform",
        importer: async () => (await import("./pat/subform/subform")).default,
    },
    "switch": {
        trigger: ".pat-switch",
        importer: async () => (await import("./pat/switch/switch")).default,
    },
    "syntax-highlight": {
        trigger: ".pat-syntax-highlight",
        importer: async () =>
            (await import("./pat/syntax-highlight/syntax-highlight")).default,
    },
    "tabs": {
        trigger: ".pat-tabs",
        importer: async () => (await import("./pat/tabs/tabs")).default,
    },
    "toggle": {
        trigger: ".pat-toggle",
        importer: async () => (await import("./pat/toggle/toggle")).default,
    },
    "tooltip": {
        trigger: ".pat-tooltip, .pat-tooltip-ng",
        importer: async () => (await import("./pat/tooltip/tooltip")).default,
    },
    "zoom": {
        trigger: ".pat-zoom",
        importer: async () => (await import("./pat/zoom/zoom")).default,
    },
    // External patterns
    "content-mirror": {
        trigger: ".pat-content-mirror",
        importer: async () => (await import("@patternslib/pat-content-mirror")).default,
    },
    "doclock": {
        trigger: ".pat-doclock",
        importer: async () => (await import("@patternslib/pat-doclock")).default,
    },
    "shopping-cart": {
        trigger: ".pat-shopping-cart",
        importer: async () => (await import("@patternslib/pat-shopping-cart")).default,
    },
    "sortable-table": {
        trigger: ".pat-sortable-table",
        importer: async () => (await import("@patternslib/pat-sortable-table")).default,
    },
    "tiptap": {
        trigger: ".pat-tiptap",
        importer: async () => (await import("@patternslib/pat-tiptap")).default,
    },
    "upload": {
        trigger: ".pat-upload",
        importer: async () => (await import("@patternslib/pat-upload")).default,
    },
};

registry.init(lazy_patterns);
