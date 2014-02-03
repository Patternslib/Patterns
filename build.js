({
    baseUrl: "src",
    out: 'bundle.js',
    name: 'patterns',

    paths: {

        // Externals
        jquery: 'bower_components/jquery/jquery',
        logging: 'bower_components/logging/src/logging',
        'jquery.form': 'bower_components/jquery-form/jquery.form',
        'jquery.anythingslider': 'bower_components/AnythingSlider/js/jquery.anythingslider',
        // klass: "bower_components/klass/src/klass",
        // photoswipe: "bower_components/photoswipe/src/photoswipe",
        // 'photoswipe.Util': "bower_components/photoswipe/src/lib/code.util-1.0.6/code.util.jquery-1.0.6",
        'parsley': 'bower_components/parsleyjs/parsley',

        // Core
        utils: 'core/utils',
        compat: 'core/compat',
        'jquery-ext': 'core/jquery-ext',
        logger: 'core/logger',
        parser: 'core/parser',
        remove: 'core/remove',
        url: 'core/url',
        store: 'core/store',
        registry: 'core/registry',
        htmlparser: 'lib/htmlparser',
        depends_parse: 'lib/depends_parse',
        dependshandler: 'lib/dependshandler',
        "input-change-events": "lib/input-change-events",

        // Patterns
        patterns: 'patterns',
        ajax: 'pat/ajax',
        inject: 'pat/inject',
        autoscale: 'pat/autoscale',
        autosubmit: "pat/autosubmit",
        bumper: "pat/bumper",
        carousel: "pat/carousel",
        checkedflag: "pat/checkedflag",
        checklist: "pat/checklist",
        collapsible: "pat/collapsible",
        depends: "pat/depends",
        equaliser: "pat/equaliser",
        focus: "pat/focus",
        legend: "pat/legend",
        modal: "pat/modal",
        "slideshow-builder": "pat/slideshow-builder",
        stacks: "pat/stacks",
        "switch": "pat/switch",
        toggle: "pat/toggle",
        validate: "pat/validate",
        zoom: "pat/zoom"

        // gallery: "pat/gallery",
    },

    shim: {

    },

    optimize: 'none'
})



