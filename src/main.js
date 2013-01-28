define('main', [
    "jquery",
    "./registry",

    "modernizer",
    "less",
    "prefixfree",
    "./patterns/autofocus",
    "./patterns/autoscale",
    "./patterns/autosubmit",
    "./patterns/autosuggest",
    "./patterns/breadcrumbs",
    "./patterns/bumper",
    "./patterns/carousel",
    "./patterns/checkedflag",
    "./patterns/checklist",
    "./patterns/chosen",
    "./patterns/collapsible",
    "./patterns/depends",
    "./patterns/edit-tinymce",
    "./patterns/expandable",
    "./patterns/focus",
    "./patterns/form-state",
    "./patterns/fullcalendar",
    "./patterns/image-crop",
    "./patterns/inject",
    "./patterns/markdown",
    "./patterns/menu",
    "./patterns/modal",
    "./patterns/navigation",
    "./patterns/placeholder",
    "./patterns/setclass",
    "./patterns/sortable",
    "./patterns/switch",
    "./patterns/transforms",
    "./patterns/toggle",
    "./patterns/tooltip",
    // has racing problems, might be replaced anyway
    //"./patterns/validate",
    "./patterns/zoom"
], function($, registry) {
    registry.init();
});
require(['main']);
