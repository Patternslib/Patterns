/**
 * Patterns autosuggest - suggestion/completion support
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012 JC Brand
 * Copyright 2013 Marko Durkovic
 */
define([
    "jquery",
    "pat-logger",
    "pat-parser",
    "pat-registry",
    "select2"
], function($, logger, Parser, registry) {
    var log = logger.getLogger("calendar");
    var parser = new Parser("autosuggest");
    parser.add_argument("words", "");
    parser.add_argument("ajax-url", "");
    parser.add_argument("ajax-data-type", "");
    parser.add_argument("ajax-search-index", "");
    // "selection-classes" allows you to add custom CSS classes to currently
    // selected elements.
    // The value passed in must be an object with each id being the text inside
    // a selection and value being a list of classes to be added to the
    // selection.
    // e.g. {'BMW': ['selected', 'car'], 'BMX': ['selected', 'bicycle']}
    parser.add_argument("selection-classes", "");
    parser.add_argument("pre-fill", function($el) { return $el.val(); });
    parser.add_argument("data", "");
    parser.add_argument("maximum-selection-size", 0);
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
            var config = {
                placeholder: $el.attr("readonly") ? "" : cfg.placeholder,
                tags: cfg.words.split(/\s*,\s*/),
                tokenSeparators: [","],
                openOnEnter: false,
                maximumSelectionSize: cfg.maximumSelectionSize
            };

            if (cfg.selectionClasses) {
                // We need to customize the formatting/markup of the selection
                config.formatSelection = function(obj, container) {
                    var selectionClasses = null;
                    try {
                        selectionClasses = $.parseJSON(cfg.selectionClasses)[obj.text];
                    } catch(SyntaxError) {
                        log.error("SyntaxError: non-JSON data given to pat-autosuggest (selection-classes)");
                    }
                    if (selectionClasses) {
                        // According to Cornelis the classes need to be applied on
                        // the <li>, which is the container's parent
                        container.parent().addClass(selectionClasses.join(" "));
                    }
                    return obj.text;
                };
            }

            if (cfg.preFill.length) {
                var prefill = cfg.preFill.split(",");
                $el.val(prefill);
                config.initSelection = function (element, callback) {
                    var i, data = [],
                        values = element.val().split(",");
                    for (i=0; i<values.length; i++) {
                        data.push({id: values[i], text: values[i]});
                    }
                    callback(data);
                };
            }

            if (cfg.data.length) {
                var data;
                var ids = [];
                var d;
                try {
                   data = $.parseJSON(cfg.data);
                    for (d in data) {
                        ids.push(data[d].id);
                    }
                    $el.val(ids);
                    config.initSelection = function (element, callback) {
                        callback(data);
                    };
                } catch(SyntaxError) {
                    log.error("SyntaxError: non-JSON data given to pat-autosuggest");
                }
            }

            if ((cfg.ajax) && (cfg.ajax.url)) {
                config = $.extend(true, {
                    minimumInputLength: 2,
                    ajax: {
                        url: cfg.ajax.url,
                        dataType: cfg.ajax["data-type"],
                        type: "POST",
                        quietMillis: 400,
                        data: function (term, page) {
                            return {
                                index: cfg.ajax["search-index"],
                                q: term, // search term
                                page_limit: 10,
                                page: page
                            };
                        },
                        results: function (data, page) {
                            // parse the results into the format expected by Select2.
                            // data must be a list of objects with keys "id" and "text"
                            return {results: data, page: page};
                        }
                    }
                }, config);
            }

            $el.select2(config);

            $el.on("pat-update", function (e, data) {
                if (data.pattern === "depends") {
                    if (data.enabled === true) {
                        $el.select2("enable", true);
                    } else if (data.enabled === false) {
                        $el.select2("disable", true);
                    }

                }
            });

            // suppress propagation for second input field
            $el.prev().on("input-change input-defocus input-change-delayed",
                function(e) { e.stopPropagation(); }
            );

            // Clear the values when a reset button is pressed
            $el.closest("form").find("button[type=reset]").on("click", function () {
                $el.select2("val", "");
            });
            return $el;
        },
        destroy: function($el) {
            $el.off(".pat-autosuggest");
            $el.select2("destroy");
        },
        transform: function($content) {
            $content.findInclusive("input[type=text].pat-autosuggest").each(function() {
                var $src = $(this),
                    $dest = $("<input type='hidden'/>").insertAfter($src);

                // measure in IE8, otherwise hidden will have width 0
                if (document.all && !document.addEventListener) {
                    $dest.css("width", $src.outerWidth(false)+"px");
                }
                $src.detach();
                $.each($src.prop("attributes"), function() {
                    if (this.name !== "type") {
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
