/**
 * Patterns autofocus - enhanced autofocus form elements
 *
 * Copyright 2012-2013 Simplon B.V. - Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../registry"
], function($, registry) {
    var autofocus = {
        name: "autofocus",
        trigger: ":input.pat-autofocus,:input[autofocus]",

        init: function($el) {
            for (var i=0; i<$el.length; i+=1)
                if (!$el.eq(i).val()) {
                    $el.get(i).focus();
                    return;
                }

            $el.eq(0).focus();
        }
    };

    registry.register(autofocus);
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
