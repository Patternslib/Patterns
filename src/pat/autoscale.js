/**
 * Patterns autoscale - scale elements to fit available space
 *
 * Copyright 2012 Humberto Sermeno
 * Copyright 2013 Simplon B.V. - Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../registry",
    "../core/parser"
], function($, registry, Parser) {
    var parser = new Parser("auto-scale");
    parser.add_argument("method", "scale", ["scale", "zoom"]);
    parser.add_argument("min-width", 0);
    parser.add_argument("max-width", 1000000);

    var _ = {
        name: "autoscale",
        trigger: ".pat-auto-scale",
        force_method: null,

        _setup: function() {
            if ($.browser.mozilla)
                _.force_method="scale";
            else if ($.browser.msie && parseInt($.browser.version, 10)<10)
                _.force_method="zoom";
            $(window).on("resize.autoscale", _.onResize);
        },

        init: function($el, opts) {
            return $el.each(function() {
                var $el = $(this),
                    options = parser.parse($el, opts);

                if (_.force_method!==null)
                    options.method=_.force_method;

                $el.data("patterns.auto-scale", options);
                _.scale.apply(this, []);
            });
        },

        scale: function() {
            var $el = $(this),
                options = $el.data("patterns.auto-scale"),
                available_space, scale;

            if ($el[0].tagName.toLowerCase()==="body")
                available_space=$(window).width();
            else
                available_space=$el.parent().outerWidth();

            available_space=Math.min(available_space, options.maxWidth);
            available_space=Math.max(available_space, options.minWidth);
            scale=available_space/$el.outerWidth();

            switch (options.method) {
            case "scale":
                $el.css("transform", "scale(" + scale + ")");
                break;
            case "zoom":
                $el.css("zoom", scale);
                break;
            }
            $el.addClass("scaled");
        },

        onResize: function() {
            $(_.trigger).each(_.scale);
        }
    };

    _._setup();
    registry.register(_);
    return _;
});
