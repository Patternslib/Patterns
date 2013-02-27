/**
 * Patterns autosuggest - suggestion/completion support
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012 JC Brand
 * Copyright 2013 Marko Durkovic
 */
define([
    "jquery",
    "../core/parser",
    "../registry",
    "jquery.select2"
], function($, Parser, registry) {
    var parser = new Parser("autosuggest");
    parser.add_argument("words", "");
    parser.add_argument("pre-fill");
    parser.add_argument("placeholder", function($el) {
        return $el.attr("placeholder") || "Enter text";
    });

    var _ = {
        name: "autosuggest",
        trigger: "input.pat-autosuggest",
        init: function($el, opts) {
            if ($el.length > 1)
                return $el.each(function() { _.init($(this), opts); });

            var cfg = parser.parse($el, opts);
            cfg.startText =  $el.attr("readonly") ? "" : cfg.placeholder;

            if (cfg.preFill) {
                $el.val(cfg.preFill);
            }
            $el.select2({tags: cfg.words.split(/\s*,\s*/)});

            // suppress propagation for second input field
            $el.prev().on("input-change input-defocus input-change-delayed",
                function(e) { e.stopPropagation(); }
            );
            return $el;
        },
        destroy: function($el) {
            $el.off(".pat-autosuggest");
            $el.select2("destroy");
        }
    };
    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
