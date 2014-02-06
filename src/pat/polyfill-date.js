/**
 * Patterns polyfill-color - Polyfill for input type=date
 *
 * Copyright 2014 Marko Durkovic
 */
define([
    "../registry",
    "modernizr",
    "bootstrap.datepicker"
], function(registry) {
    var _ = {
        name: "polyfill-date",
        trigger: "input[type=date]",
        init: function($el) {
            if (!Modernizr.inputtypes.date) {
                $el.datepicker({format:'yyyy-mm-dd'});
            }
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
