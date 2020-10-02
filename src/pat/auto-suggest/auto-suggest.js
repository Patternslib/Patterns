import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";

const log = logging.getLogger("autosuggest");
const parser = new Parser("autosuggest");
parser.addArgument("ajax-data-type", "JSON");
parser.addArgument("ajax-search-index", "");
parser.addArgument("ajax-url", "");
parser.addArgument("allow-new-words", true); // Should custom tags be allowed?
parser.addArgument("max-selection-size", 0);
parser.addArgument("minimum-input-length"); // Don't restrict by default so that all results show
parser.addArgument("placeholder", function ($el) {
    return $el.attr("placeholder") || undefined;
});
parser.addArgument("prefill", function ($el) {
    return $el.val();
});
parser.addArgument("prefill-json", ""); // JSON format for pre-filling
parser.addArgument("words", "");
parser.addArgument("words-json");

// "selection-classes" allows you to add custom CSS classes to currently
// selected elements.
// The value passed in must be an object with each id being the text inside
// a selection and value being a list of classes to be added to the
// selection.
// e.g. {'BMW': ['selected', 'car'], 'BMX': ['selected', 'bicycle']}
parser.addArgument("selection-classes", "");

parser.addAlias("maximum-selection-size", "max-selection-size");
parser.addAlias("data", "prefill-json");
parser.addAlias("pre-fill", "prefill");

export default Base.extend({
    name: "autosuggest",
    trigger: ".pat-autosuggest,.pat-auto-suggest",

    async init($el, opts) {
        await import("select2");

        this.options = parser.parse($el, opts);
        this.select2_options = {
            tokenSeparators: [","],
            openOnEnter: false,
            maximumSelectionSize: this.options.maxSelectionSize,
            minimumInputLength: this.options.minimumInputLength,
            allowClear:
                this.options.maxSelectionSize === 1 && !$el.prop("required"),
        };
        if ($el.attr("readonly")) {
            this.select2_options.placeholder = "";
        } else if (this.options.placeholder) {
            this.select2_options.placeholder = this.options.placeholder;
        }

        if (this.options.selectionClasses) {
            // We need to customize the formatting/markup of the selection
            this.select2_options.formatSelection = (obj, container) => {
                let selectionClasses = null;
                try {
                    selectionClasses = JSON.parse(
                        this.options.selectionClasses
                    )[obj.text];
                } catch (SyntaxError) {
                    log.error(
                        "SyntaxError: non-JSON data given to pat-autosuggest (selection-classes)"
                    );
                }
                if (selectionClasses) {
                    // According to Cornelis the classes need to be applied on
                    // the <li>, which is the container's parent
                    container.parent().addClass(selectionClasses.join(" "));
                }
                return obj.text;
            };
        }

        if ($el[0].tagName === "INPUT") {
            this.select2_options = this.configureInput(
                $el,
                this.select2_options
            );
        }
        $el.select2(this.select2_options);
        $el.on("pat-update", (e, data) => {
            if (data.pattern === "depends") {
                if (data.enabled === true) {
                    $el.select2("enable", true);
                } else if (data.enabled === false) {
                    $el.select2("disable", true);
                }
            }
        });

        // suppress propagation for second input field
        $el.prev().on("input-change input-defocus input-change-delayed", (e) =>
            e.stopPropagation()
        );

        // Clear the values when a reset button is pressed
        $el.closest("form")
            .find("button[type=reset]")
            .on("click", () => $el.select2("val", ""));
        return $el;
    },

    configureInput($el, select2_config) {
        let words = [];

        select2_config.createSearchChoice = (term, data) => {
            if (this.options.allowNewWords) {
                if (
                    $(data).filter(
                        (idx, el) => el.text.localeCompare(term) === 0
                    ).length === 0
                ) {
                    return { id: term, text: term };
                }
            } else {
                return null;
            }
        };

        if (this.options.wordsJson && this.options.wordsJson.length) {
            try {
                words = JSON.parse(this.options.wordsJson);
            } catch (SyntaxError) {
                words = [];
                log.error(
                    "SyntaxError: non-JSON data given to pat-autosuggest"
                );
            }
            if (!Array.isArray(words)) {
                words = $.map(words, (v, k) => {
                    return { id: k, text: v };
                });
            }
        }
        if (this.options.words) {
            words = this.options.words.split(/\s*,\s*/);
            words = $.map(words, (v) => {
                return { id: v, text: v };
            });
        }

        // Per Cornelis, if our max lenght is 1, we want select style. If it is larger, we want tag style
        // Now this is somewhat fishy because so far, we always configured tag style by setting config.tags = words.
        // Even if words was [], we would get a tag stylee select
        // That was then properly working with ajax if configured.

        if (this.options.maxSelectionSize === 1) {
            select2_config.data = words;
            // We allow exactly one value, use dropdown styles. How do we feed in words?
        } else {
            // We allow multiple values, use the pill style - called tags in select 2 speech
            select2_config.tags = words;
        }

        if (this.options.prefill && this.options.prefill.length) {
            $el.val(this.options.prefill.split(","));
            select2_config.initSelection = (element, callback) => {
                let data = [];
                const values = element.val().split(",");
                for (let value of values) {
                    data.push({ id: value, text: value });
                }
                if (this.options.maxSelectionSize === 1) {
                    data = data[0];
                }
                callback(data);
            };
        }

        if (this.options.prefillJson.length) {
            /* We support two types of JSON data for prefill data:
             *   {"john-snow": "John Snow", "tywin-lannister": "Tywin Lannister"}
             * or
             *   [
             *    {"id": "john-snow", "text": "John Snow"},
             *    {"id": "tywin-lannister", "text":"Tywin Lannister"}
             *   ]
             */
            try {
                const data = JSON.parse(this.options.prefillJson);
                let ids = [];
                for (let d in data) {
                    if (typeof d === "object") {
                        ids.push(d.id);
                    } else {
                        ids.push(d);
                    }
                }
                $el.val(ids);
                select2_config.initSelection = (element, callback) => {
                    let _data = [];
                    for (let d in data) {
                        if (typeof d === "object") {
                            _data.push({ id: d.id, text: d.text });
                        } else {
                            _data.push({ id: d, text: data[d] });
                        }
                    }
                    if (this.options.maxSelectionSize === 1) {
                        _data = _data[0];
                    }
                    callback(_data);
                };
            } catch (SyntaxError) {
                log.error(
                    "SyntaxError: non-JSON data given to pat-autosuggest"
                );
            }
        }

        if (this.options.ajax && this.options.ajax.url) {
            select2_config = $.extend(
                true,
                {
                    minimumInputLength: this.options.minimumInputLength,
                    ajax: {
                        url: this.options.ajax.url,
                        dataType: this.options.ajax["data-type"],
                        type: "GET",
                        quietMillis: 400,
                        data: (term, page) => {
                            return {
                                index: this.options.ajax["search-index"],
                                q: term, // search term
                                page_limit: 10,
                                page: page,
                            };
                        },
                        results: (data, page) => {
                            // parse the results into the format expected by Select2.
                            // data must be a list of objects with keys "id" and "text"
                            return { results: data, page: page };
                        },
                    },
                },
                select2_config
            );
        }
        return select2_config;
    },

    destroy($el) {
        $el.off(".pat-autosuggest");
        $el.select2("destroy");
    },

    transform($content) {
        $content
            .findInclusive("input[type=text].pat-autosuggest")
            .each((idx, el) => {
                let $src = $(el);
                let $dest = $("<input type='hidden'/>").insertAfter($src);

                // measure in IE8, otherwise hidden will have width 0
                if (document.all && !document.addEventListener) {
                    $dest.css("width", $src.outerWidth(false) + "px");
                }
                $src.detach();
                $.each($src.prop("attributes"), (el_) => {
                    if (el_.name !== "type") {
                        $dest.attr(el_.name, el_.value);
                    }
                });
                $src.remove();
            });
    },
});
