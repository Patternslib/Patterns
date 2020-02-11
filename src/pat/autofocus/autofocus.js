/**
 * Patterns autofocus - enhanced autofocus form elements
 *
 * Copyright 2012-2013 Simplon B.V. - Wichert Akkerman
 */
define(["jquery", "pat-registry"], function($, registry) {
    var autofocus = {
        name: "autofocus",
        trigger: ":input.pat-autofocus,:input[autofocus]",

        init: function init($el) {

            this.setFocus(this.trigger);
            $(document).on("patterns-injected", function (e, data) {
                autofocus.setFocus($(e.target).find(autofocus.trigger));
            });
            $(document).on("pat-update", function (e, data) {
                autofocus.setFocus($(e.target).find(autofocus.trigger));
            });
        },
        setFocus: function (target) {
            var $all = $(target);
            var $visible = $all.filter(function(index) {
                if ($(this).is(":visible")) return true;
            })
            setTimeout(function() {$visible.get(0) && $visible.get(0).focus();}, 10);
        }

    };

    registry.register(autofocus);
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
