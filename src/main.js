define('main', [
    "jquery",
    "./registry",

    "modernizer",
    "less",
    "prefixfree",
    "./pat/autofocus",
    "./pat/autoscale",
    "./pat/autosubmit",
    "./pat/autosuggest",
    "./pat/breadcrumbs",
    "./pat/bumper",
    "./pat/carousel",
    "./pat/checkedflag",
    "./pat/checklist",
    "./pat/chosen",
    "./pat/collapsible",
    "./pat/depends",
    "./pat/edit-tinymce",
    "./pat/expandable",
    "./pat/focus",
    "./pat/form-state",
    "./pat/fullcalendar",
    "./pat/image-crop",
    "./pat/inject",
    "./pat/legend",
    "./pat/markdown",
    "./pat/menu",
    "./pat/modal",
    "./pat/navigation",
    "./pat/placeholder",
    "./pat/setclass",
    "./pat/sortable",
    "./pat/switch",
    "./pat/toggle",
    "./pat/tooltip",
    // has racing problems, might be replaced anyway
    //"./pat/validate",
    "./pat/zoom"
], function($, registry) {
    registry.init();
});
require(['main']);
