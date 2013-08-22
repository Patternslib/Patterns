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
    "pat-gallery",
    "pat-inject",
    "pat-input-change-events",
    "pat-image-crop",
    "pat-legend",
    "less",
    "pat-markdown",
    "pat-menu",
    "pat-modal",
    "modernizr",
    "pat-navigation",
    "pat-notification",
    "pat-placeholder",
    "prefixfree",
    "pat-skeleton",
    "pat-slides",
    "pat-slideshow-builder",
    "pat-sortable",
    "pat-stacks",
    "pat-subform",
    "pat-switch",
    "pat-toggle",
    "pat-tooltip",
    "pat-validate",
    "pat-zoom",
    "pat-url"
], function($, registry) {
    // Since we are in a non-AMD env, register a few useful utilites
    $(function () {
        registry.init();
    });
    return registry;
});
