/**
 * Patterns slides - Automatic and customised slideshows.
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../registry",
    "../utils",
    "../core/url",
    "../core/remove",
    "shower"
], function($, patterns, utils, url) {
    var slides = {
        name: "slides",
        trigger: ".pat-slides:has(.slide)",

        setup: function() {
            $(document).on("patterns-injected", utils.debounce(slides._reset, 100));
            // Re-init shower to get the slide selector in.
            window.shower.init(".pat-slides .slide");
        },

        init: function($el) {
            var parameters = url.parameters();
            if (parameters.slides!==undefined) {
                var requested_ids = slides._collapse_ids(parameters.slides);
                if (requested_ids)
                    slides._disable_slides($el, requested_ids);
            }
            return slides._hook($el);
        },

        _collapse_ids: function(params) {
            var ids = [];
            params.forEach(function(param) {
                if (param)
                    ids=ids.concat(param.split(",").filter(function(id) { return !!id;}));
            });
            return ids;
        },

        _disable_slides: function($shows, ids) {
            var need_reset = false,
               has_bad_id = function(idx, el) { return ids.indexOf(el.id)===-1; };

            for (var i=0; i<$shows.length; i++) {
                var $show = $shows.eq(i),
                    $bad_slides = $show.find(".slide[id]").filter(has_bad_id);
                need_reset=need_reset || $bad_slides.length;
                $bad_slides.remove();
            }
            if (need_reset)
                slides._reset();
        },

        _hook: function($el) {
            return $el
                .off("destroy.pat-slide")
                .on("destroy.pat-slide", utils.debounce(slides._reset, 100));
        },

        _reset: function() {
            slides._hook($(this.trigger));
            window.shower.init(".pat-slides .slide");
        }
    };


    slides.setup();
    patterns.register(slides);
    return slides;
});
