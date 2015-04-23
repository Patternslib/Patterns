/**
 * Patterns gallery - A simple gallery
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "pat-registry",
    "pat-parser",
    "photoswipe"
], function($, patterns, Parser) {
    var parser = new Parser("gallery");

    parser.add_argument("slideshow", "manual", ["auto", "manual", "none"]);
    parser.add_argument("loop", true);
    parser.add_argument("scale-method", "fit", ["fit", "fitNoUpscale", "zoom"]);
    parser.add_argument("delay", 30000);
    parser.add_argument("effect-duration", 250);
    parser.add_argument("effect-easing", "ease-out");
    parser.add_argument("hide-overlay", 5000);

    var gallery = {
        name: "gallery",
        trigger: ".pat-gallery:has(a img)",

        init: function($el, opts) {
            return $el.each(function() {
                var options = parser.parse($(this), opts);
                $("a:has(img)", this).photoSwipe({
                    autoStartSlideshow: options.slideshow==="auto",
                    imageScaleMethod: options.scaleMethod,
                    loop: options.loop,
                    slideshowDelay: options.delay,
                    slideSpeed: options.effect.duration,
                    slideTimingFunction: options.effect.easing,
                    captionAndToolbarAutoHideDelay: options.hideOverlay,

                    zIndex: 10000,
                    getImageCaption: gallery._getImageCaption
                });
            });
        },

        _getImageCaption: function(el) {
            if (el.nodeName==="IMG")
                return el.title;
            var $children = $("img[title]:first", el);
            if ($children.length)
                return $children.attr("title");
        }
    };


    patterns.register(gallery);
    return gallery;
});
