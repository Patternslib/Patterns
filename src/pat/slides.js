/**
 * Patterns slides - Automatic and customised slideshows.
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../registry",
    "../utils",
    "../core/remove",
    "shower"
], function($, patterns, utils) {
    var slides = {
        name: ".slide",

        init: function($el) {
            return slides._hook($el);
        },

        _hook: function($el) {
            return $el
                .off("destroy.pat-slide")
                .on("destroy.pat-slide", utils.debounce(slides._reset, 100));
        },

        _reset: function() {
            slides._hook($(".slide"));
            window.shower.init();
        }
    };

    $(document).on("patterns-injected", utils.debounce(slides._reset, 100));

    patterns.register(slides);
    return slides;
});
