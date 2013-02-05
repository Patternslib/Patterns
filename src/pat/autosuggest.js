/**
 * Patterns autosuggest - suggestion/completion support
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012 JC Brand
 * Copyright 2013 Marko Durkovic
 */
// auto-suggest docs:
// http://code.drewwilson.com/entry/autosuggest-jquery-plugin
// Changes to previous
// - prefill and ashtmlid in data-auto-suggest-config
define([
    "jquery",
    "../core/parser",
    "../registry",
    "autoSuggest",
    "patterns-jquery-form"
], function($, Parser, registry) {
    var parser = new Parser("autosuggest");
    parser.add_argument("words", "");
    parser.add_argument("pre-fill");
    parser.add_argument("as-html-id");
    parser.add_argument("selected-value-prop", "name");
    parser.add_argument("search-obj-prop", "name");
    parser.add_argument("placeholder", function($el) {
        var placeholder = $el.attr("placeholder") || "Enter text";
        // jquery_autosuggest does not like the placeholder attr (yet)
        $el.attr("placeholder", "");
        return placeholder;
    });

    var _ = {
        name: "autosuggest",
        trigger: "input.pat-autosuggest",
        init: function($el, opts) {
            if ($el.length > 1)
                return $el.each(function() { _.init($(this), opts); });

            var cfg = _.parser.parse($el, opts);

            if ($el.attr("readonly"))
                cfg.startText = "";
            else
                cfg.startText = cfg.placeholder;

            if (cfg.preFill && (cfg.preFill.slice(0,1) === ","))
                cfg.preFill = cfg.preFill.slice(1);

            $el.on("keydown.pat-autosuggest", _.onKeyDown);

            var data = cfg.words.split(/\s*,\s*/).map(function(word) {
                return {value: word, name: word};
            });

            cfg.selectionAdded = function() {
                $el.next().trigger("change");
            };
            cfg.selectionRemoved = function(elem) {
                elem.remove();
                $el.next().trigger("change");
            };

            $el.on("change.pat-autosuggest", false);

            // XXX: See https://github.com/Patternslib/Patterns/issues/149
            if (cfg.asHtmlId !== undefined) {
                cfg.asHtmlID = cfg.asHtmlId;
            }
            $el.autoSuggest(data, cfg);

            return $el;
        },
        destroy: function($el) {
            $el.off(".pat-autosuggest");

            // XXX: destroy the jqueryPlugin, unfortunately it doesn't
            // support this as of now
        },

        parser: parser,

        onKeyDown: function(ev) {
            var $this = $(this);
            if (ev.which === 13) {
                var $results = $this.parents(".as-selections").next();
                ev.preventDefault();
                // skip ENTER->comma translation, if selection is active
                if (($results.is(":visible")) &&
                    ($results.find(".active").length > 0)) return;
                var newev = $.Event("keydown");
                newev.ctrlKey = false;
                newev.which = 188;
                newev.keyCode = 188;
                $this.trigger(newev);
            }
        }
    };
    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
