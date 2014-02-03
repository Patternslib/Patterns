/* Patterns bundle configuration.
 *
 * This file is used to tell r.js which Patterns to load when it generates a
 * bundle. This is only used when generating a full Patterns bundle, or when
 * you want a simple way to include all patterns in your own project. If you
 * only want to use selected patterns you will need to pull in the patterns
 * directly in your RequireJS configuration.
 */
define([
    "registry",
    "parser",
    "htmlparser",
    "depends_parse",
    "dependshandler",
    "input-change-events",
    "url",
    "store",
    "ajax",
    "inject",
    "autoscale",
    "autosubmit",
    "bumper",
    "carousel",
    "checkedflag",
    "checklist",
    "collapsible",
    "depends",
    "equaliser",
    "focus",
    "legend",
    "modal",
    "slideshow-builder",
    "stacks",
    "switch",
    "toggle",
    "validate"
    // "gallery"
], function(registry) {
    return registry;
});
