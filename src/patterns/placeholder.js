define([
    "../registry",
    '../3rdparty/modernizr-2.0.6',
    '../3rdparty/jquery.placeholder'
], function(patterns) {
    var pattern_spec = {
        name: "placeholder",
        trigger: ":input[placeholder]",

        init: function($el) {
            return $el.placeholder();
        }
    };

    if (!Modernizr.input.placeholder)
        patterns.register(pattern_spec);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
