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
        equaliser: "pat/equaliser"
    },

    optimize: 'none'
})



