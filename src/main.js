requirejs.config({
    paths: {
        URIjs: "./3rdparty/URIjs/src",
        jquery: "./3rdparty/jquery-1.8.2",
        jquery_anythingslider: "./3rdparty/jquery.anythingslider",
        jquery_autosuggest: "./3rdparty/jquery.autoSuggest",
        jquery_chosen: "./3rdparty/chosen.jquery",
        jquery_ext: "./jquery-ext",
        jquery_form: "./lib/jquery.form/jquery.form",
        jquery_fullcalendar: "./3rdparty/fullcalendar/fullcalendar",
        jquery_placeholder: "./3rdparty/jquery.placeholder",
        jquery_validate: "./3rdparty/jquery-validation/jquery.validate",
        jquery_validate_additional_methods: "./3rdparty/jquery-validation/additional-methods",
        modernizr: "./3rdparty/modernizr-2.0.6",
        prefixfree: "./3rdparty/prefixfree",
        tinymce: "./3rdparty/tiny_mce/tiny_mce_src"
    },
    shim: {
        jquery_anythingslider: {
            deps: ["jquery"]
        },
        jquery_autosuggest: {
            deps: ["jquery"]
        },
        jquery_chosen: {
            deps: ["jquery"]
        },
        jquery_ext: {
            deps: ["jquery"]
        },
        jquery_form: {
            deps: ["jquery"]
        },
        jquery_fullcalendar: {
            deps: ["jquery"]
        },
        jquery_placeholder: {
            deps: ["jquery"]
        },
        jquery_validate: {
            deps: ["jquery"]
        },
        jquery_validate_additional_methods: {
            deps: ["jquery_validate"]
        }
    }
});

define([
    'jquery',
    './registry',
    // below here modules that are only loaded
    "jquery_validate_additional_methods",
    'modernizr',
    'prefixfree',
    './patterns/autofocus',
    './patterns/autosubmit',
    './patterns/autosubmit2',
    './patterns/autosuggest',
    './patterns/breadcrumbs',
    './patterns/bumper',
    './patterns/carousel',
    './patterns/checkedflag',
    './patterns/checklist',
    './patterns/chosen',
    './patterns/collapsible',
    './patterns/depends',
    './patterns/edit-tinymce',
    './patterns/expandable',
    './patterns/focus',
    './patterns/fullcalendar',
    './patterns/inject',
    './patterns/menu',
    './patterns/modal',
    './patterns/navigation',
    './patterns/placeholder',
    './patterns/setclass',
    './patterns/sorting',
    './patterns/switch',
    './patterns/toggle',
    './patterns/tooltip',
    './patterns/validate',
    './patterns/zoom'
], function($, registry) {
    // wait for the DOM to be ready and initialize
    $(document).ready(function(){
        registry.scan(document.body);
    });
    return registry;
});
