/**
 * Patterns polyfill-color - Polyfill for input type=color
 *
 * Copyright 2014 Marko Durkovic
 */
define([
    "../registry",
    "spectrum"
], function(registry) {
    var _ = {
        name: "polyfill-color",
        trigger: "input[type=color]",
        init: function($el) {
            return $el;
        },

        destroy: function() {
            // XXX
        }
    };

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
