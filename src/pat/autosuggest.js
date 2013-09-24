/**
 * Patterns autosuggest - suggestion/completion support
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012 JC Brand
 * Copyright 2013 Marko Durkovic
 */
define([
    "jquery",
    "pat-parser",
    "pat-registry",
    "select2"
], function($, Parser, registry) {
    var parser = new Parser("autosuggest");
    parser.add_argument("words", "");
    parser.add_argument("ajax-url", "");
    parser.add_argument("ajax-data-type", "");
    parser.add_argument("ajax-search-index", "");
    parser.add_argument("pre-fill", function($el) { return $el.val(); });
    parser.add_argument("placeholder", function($el) {
        return $el.attr("placeholder") || "Enter text";
    });

    var _ = {
        name: "autosuggest",
        trigger: "input.pat-autosuggest",
        init: function($el, opts) {
            if ($el.length > 1) {
                return $el.each(function() { _.init($(this), opts); });
            }
            var cfg = parser.parse($el, opts);
            $el.val(cfg.preFill.split(','));

            var config = {
                placeholder: $el.attr("readonly") ? "" : cfg.placeholder,
                tags: cfg.words.split(/\s*,\s*/),
                tokenSeparators: [","],
                openOnEnter: false
            };

            if ((cfg.ajax) && (cfg.ajax.url)) {
                config = $.extend(true, {
                    minimumInputLength: 1,
                    ajax: {
                        url: cfg.ajax.url,
                        dataType: cfg.ajax['data-type'],
                        type: 'POST',
                        quietMillis: 400,
                        data: function (term, page) {
                            return {
                                index: cfg.ajax['search-index'],
                                q: term, // search term
                                page_limit: 10,
                                page: page
                            };
                        },
                        results: function (data, page) {
                            // parse the results into the format expected by Select2.
                            // data must be a list of objects with keys 'id' and 'text'
                            return {results: data, page: page};
                        }
                    }
                }, config);
            }

            $el.select2(config);

            // suppress propagation for second input field
            $el.prev().on("input-change input-defocus input-change-delayed",
                function(e) { e.stopPropagation(); }
            );

            // Clear the values when a reset button is pressed
            $el.closest('form').find('button[type=reset]').on('click', function () {
                $el.select2('val', '');
            });
            return $el;
        },
        destroy: function($el) {
            $el.off(".pat-autosuggest");
            $el.select2("destroy");
        },
        transform: function($content) {
            $content.findInclusive('input[type=text].pat-autosuggest').each(function() {
                var $src = $(this),
                    $dest = $('<input type="hidden"/>').insertAfter($src);

                $src.detach();
                $.each($src.prop('attributes'), function() {
                    if (this.name !== 'type') {
                        $dest.attr(this.name, this.value);
                    }
                });
                $src.remove();
            });
        }
    };
    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
