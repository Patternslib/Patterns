({
    baseUrl: "src",
    out: "bundle.js",
    name: "almond",
    include: "patterns",
    insertRequire: ["patterns"],

    paths: {

        // Externals
        almond: "bower_components/almond/almond",
        jquery: "bower_components/jquery/jquery",
        logging: "bower_components/logging/src/logging",
        "jquery.form": "bower_components/jquery-form/jquery.form",
        "jquery.anythingslider": "bower_components/AnythingSlider/js/jquery.anythingslider",
        "jcrop": "bower_components/jcrop/js/jquery.Jcrop",
        klass: "bower_components/klass/src/klass",
        photoswipe: "legacy/photoswipe",
        "parsley": "bower_components/parsleyjs/parsley",
        "patternslib.slides": "bower_components/slides/src/slides",
        "modernizr": "bower_components/modernizr/modernizr",
        "less": "bower_components/less.js/dist/less-1.6.2",
        "prefixfree": "bower_components/prefixfree/prefixfree.min",
        "Markdown.Converter": "legacy/Markdown.Converter",
        "Markdown.Extra": "legacy/Markdown.Extra",
        "Markdown.Sanitizer": "legacy/Markdown.Sanitizer",
        "select2": "bower_components/select2/select2.min",
        "jquery.chosen": "bower_components/chosen/chosen/chosen.jquery",
        "jquery.fullcalendar": "bower_components/fullcalendar/fullcalendar.min",
        "jquery.placeholder": "bower_components/jquery-placeholder/jquery.placeholder.min",
        "jquery.textchange": "bower_components/jquery-textchange/jquery.textchange",
        tinymce: "bower_components/tinymce/jscripts/tiny_mce/jquery.tinymce",

        // Core
        "pat-utils": "core/utils",
        compat: "core/compat",
        "jquery-ext": "core/jquery-ext",
        logger: "core/logger",
        parser: "core/parser",
        remove: "core/remove",
        url: "core/url",
        store: "core/store",
        registry: "core/registry",
        htmlparser: "lib/htmlparser",
        depends_parse: "lib/depends_parse",
        dependshandler: "lib/dependshandler",
        "input-change-events": "lib/input-change-events",

        // Patterns
        patterns: "patterns",
        ajax: "pat/ajax",
        autofocus: "pat/autofocus",
        autoscale: "pat/autoscale",
        autosubmit: "pat/autosubmit",
        autosuggest: "pat/autosuggest",
        breadcrumbs: "pat/breadcrumbs",
        bumper: "pat/bumper",
        carousel: "pat/carousel",
        checkedflag: "pat/checkedflag",
        checklist: "pat/checklist",
        chosen: "pat/chosen",
        collapsible: "pat/collapsible",
        depends: "pat/depends",
        "edit-tinymce": "pat/edit-tinymce",
        equaliser: "pat/equaliser",
        expandable: "pat/expandable",
        focus: "pat/focus",
        formstate: "pat/form-state",
        forward: "pat/forward",
        fullcalendar: "pat/fullcalendar",
        gallery: "pat/gallery",
        "image-crop": "pat/image-crop",
        inject: "pat/inject",
        legend: "pat/legend",
        markdown: "pat/markdown",
        menu: "pat/menu",
        modal: "pat/modal",
        navigation: "pat/navigation",
        placeholder: "pat/placeholder",
        skeleton: "pat/skeleton",
        slides: "pat/slides",
        "slideshow-builder": "pat/slideshow-builder",
        sortable: "pat/sortable",
        stacks: "pat/stacks",
        subform: "pat/subform",
        "switch": "pat/switch",
        toggle: "pat/toggle",
        tooltip: "pat/tooltip",
        validate: "pat/validate",
        zoom: "pat/zoom"
    },

    shim: {

        jquery: {
            exports: "jQuery"
        },

        tinymce: {
            depends: "jquery"
        },

        photoswipe: {
            depends: "klass",
        }
    },

    optimize: "none"
})



