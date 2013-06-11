/**
 * equaliser - Equalise height of elements in a row
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../registry",
    "../utils"
], function($, patterns, utils) {
    var equaliser = {
        name: "equaliser",
        trigger: ".pat-equaliser",

        init: function($el, opts) {
            return $el.each(function() {
                var $container = $(this);
                $container.on("pat-update.pat-equaliser", null, this, equaliser._onEvent);
                $(window).on("resize.pat-equaliser", null, this, utils.debounce(equaliser._onEvent, 100));
                equaliser._update(this);
            });
        },

        _update: function(container) {
            var $container = $(container),
                $children = $container.children(),
                heights, max_height;

            $children.css("height", "");
            heights=$children.map(function() { return $(this).height(); }).get();
            max_height=Math.max.apply(null, heights);
            $children.css("height", max_height+"px");
        },

        _onEvent: function(event) {
            equaliser._update(event.data);
        }
    };

    patterns.register(equaliser);
    return equaliser;
});


