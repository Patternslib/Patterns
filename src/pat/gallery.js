/**
 * Patterns gallery - A simple gallery
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../registry",
    "klass", // Workaround because bungle is ignoring dependencies currently
    "photoswipe"
], function($, patterns) {
    var gallery = {
        name: "gallery",
        trigger: ".pat-gallery:has(a img)",

        init: function($el) {
            return $el.each(function() {
                $("a:has(img)", this).photoSwipe();
            });
        }
    };


    patterns.register(gallery);
    return gallery;
});
