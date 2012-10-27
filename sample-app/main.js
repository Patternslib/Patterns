require.config({
    // XXX: How can we use the config from ../src/main without
    // duplicating it here?
    paths: {
        jquery: "require-jquery",
        patterns: "../src/main"
    },
    // define module dependencies for modules not using define
    shim: {
        'Libraries/backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['Libraries/underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'Libraries/dynatree-init': {
            deps: ['Libraries/backbone']
        },
        'Libraries/Plone/listusers': {
            deps: ['Libraries/Plone/jquery.dataTables.min']
        },
        "Libraries/Plone/jquery-integration": {
            deps: ['jquery']
        },
        "Libraries/Plone/TableTools": {
            deps: ['Libraries/Plone/jquery.dataTables.min']
        }
    }
});

require([
    "jquery",
    "patterns"
], function($, patterns) {
    var myPattern = {
        name: "myPattern",
        trigger: "pat-my-discordia",
        init: function($el) {
            return $el.each(function() {
                var $el = $(this);
                $el.html('Hail Eris! All hail discordia!');
            });
        }
    };
    patterns.register(myPattern);
});