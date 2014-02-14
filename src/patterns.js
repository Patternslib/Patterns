/* Patterns bundle configuration.
 *
 * This file is used to tell r.js which Patterns to load when it generates a
 * bundle. This is only used when generating a full Patterns bundle, or when
 * you want a simple way to include all patterns in your own project. If you
 * only want to use selected patterns you will need to pull in the patterns
 * directly in your RequireJS configuration.
 */
define([
    "jquery",
    "pat-registry",
    "pat-parser",
    "pat-htmlparser",
    "pat-depends_parse",
    "pat-dependshandler",

    "pat-ajax",
    "pat-autofocus",
    "pat-autoscale",
    "pat-autosubmit",
    "pat-autosuggest",
    "pat-breadcrumbs",
    "pat-bumper",
    "pat-carousel",
    "pat-checkedflag",
    "pat-checklist",
    "pat-chosen",
    "pat-collapsible",
    "pat-depends",
    "pat-edit-tinymce",
    "pat-equaliser",
    "pat-expandable",
    "pat-focus",
    "pat-formstate",
    "pat-forward",
    "pat-fullcalendar",
    "inject",
    "pat-input-change-events",
    "image-crop",
    "legend",
    "less",
    "menu",
    "modal",
    "modernizr",
    "navigation",
    "placeholder",
    "prefixfree",
    "skeleton",
    "slides",
    "slideshow-builder",
    "sortable",
    "stacks",
    "pat-store",
    "subform",
    "switch",
    "toggle",
    "tooltip",
    "validate",
    "zoom",
    "image-crop",
    "gallery",
    "markdown",
    "pat-url"
], function($, registry) {
    window.patterns = registry;
    $(function () {
        registry.init();
    });
    return registry;
});
