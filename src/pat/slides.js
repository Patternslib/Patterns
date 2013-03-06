/**
 * Patterns slides - Automatic and customised slideshows.
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../registry",
    "shower"
], function($, patterns) {
    var slides = {
        name: "slides",

        init: function($el) {
            return $el;
        }
    };

    $(document).on("patterns-injected", function() {
        shower.init();
    });

    patterns.register(slides);
    return slides;
});
