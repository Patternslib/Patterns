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
    "less",
    "modernizr",
    "prefixfree",
    "pat-ajax",
    "pat-autofocus",
    "pat-autoscale",
    "pat-autosubmit",
    "pat-autosuggest",
    "pat-breadcrumbs",
    "pat-bumper",
    "pat-calendar",
    "pat-carousel",
    "pat-checkedflag",
    "pat-checklist",
    "pat-chosen",
    "pat-collapsible",
    "pat-colour-picket",
    "pat-depends",
    "pat-edit-tinymce",
    "pat-equaliser",
    "pat-expandable",
    "pat-focus",
    "pat-formstate",
    "pat-forward",
    "pat-fullcalendar",
    "pat-gallery",
    "pat-image-crop",
    "pat-inject",
    "pat-input-change-events",
    "pat-legend",
    "pat-markdown",
    "pat-menu",
    "pat-modal",
    "pat-navigation",
    "pat-notification",
    "pat-masonry",
    "pat-placeholder",
    "pat-selectbox",
    "pat-slides",
    "pat-slideshow-builder",
    "pat-sortable",
    "pat-stacks",
    "pat-subform",
    "pat-switch",
    "pat-toggle",
    "pat-tooltip",
    "pat-url",
    "pat-validate",
    "pat-zoom"
], function($, registry) {
    // Since we are in a non-AMD env, register a few useful utilites
    $(function () {
        registry.init();
    });
    return registry;
});
