import "../../core/jquery-ext";
import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import dom from "../../core/dom";
import events from "../../core/events";

const log = logging.getLogger("autosuggest");

export const parser = new Parser("autosuggest");
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

    async init() {
        if (window.__patternslib_import_styles) {
            import("select2/select2.css");
        }
        await import("select2");

        this.options = parser.parse(this.el, this.options);

        let config = {
            tokenSeparators: [","],
            openOnEnter: false,
            maximumSelectionSize: this.options.maxSelectionSize,
            minimumInputLength: this.options.minimumInputLength,
            allowClear:
                this.options.maxSelectionSize === 1 && !this.el.hasAttribute("required"),
        };
        if (this.el.hasAttribute("readonly")) {
            config.placeholder = "";
        } else if (this.options.placeholder) {
            config.placeholder = this.options.placeholder;
        }

        if (this.options.selectionClasses) {
            // We need to customize the formatting/markup of the selection
            config.formatSelection = (obj, container) => {
                let selectionClasses = null;
                try {
                    selectionClasses = JSON.parse(this.options.selectionClasses)[
                        obj.text
                    ];
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

        if (this.el.tagName === "INPUT") {
            config = this.create_input_config(config);
        }
        const $sel2 = this.$el.select2(config);

        dom.hide(this.el); // hide input, but keep active (e.g. for validation)

        this.$el.on("pat-update", (e, data) => {
            if (data?.pattern === "depends") {
                if (data?.enabled === true) {
                    this.$el.select2("enable", true);
                } else if (data?.enabled === false) {
                    this.$el.select2("disable", true);
                }
            }
        });

        // Allow pat-validate to check for validity when select2 was interacted
        // with but no value selected.
        const initiate_empty_check = () => {
            const val = $sel2.select2("val");
            if (val?.length === 0) {
                // catches "" and []
                // blur the input field so that pat-validate can kick in when
                // nothing was selected.
                this.el.dispatchEvent(events.blur_event());
            }
        };
        this.$el.on("select2-close", initiate_empty_check.bind(this));
        this.$el.on("select2-blur", initiate_empty_check.bind(this));

        this.$el.on("change", () => {
            // The jQuery "change" event isn't caught by normal JavaScript
            // event listeners, e.g. in pat-validation.
            // Let's re-trigger as input-event, so that pat-validation but also
            // ``input-change-events`` can pick it up.
            this.el.dispatchEvent(events.input_event());
        });

        // Clear values on reset.
        events.add_event_listener(
            this.el.closest("form"),
            "reset",
            "pat-auto-suggest--reset",
            () => this.$el.select2("val", "")
        );
    },

    create_input_config(config) {
        let words = [];

        config.createSearchChoice = (term, data) => {
            if (this.options.allowNewWords) {
                if (
                    data.filter((el) => el.text.localeCompare(term) === 0).length === 0
                ) {
                    return { id: term, text: term };
                }
            } else {
                return null;
            }
        };

        if (this.options.wordsJson?.length) {
            try {
                words = JSON.parse(this.options.wordsJson);
            } catch (SyntaxError) {
                words = [];
                log.error("SyntaxError: non-JSON data given to pat-autosuggest");
            }
            if (!Array.isArray(words)) {
                words = words.map((v, k) => {
                    return { id: k, text: v };
                });
            }
        }
        if (this.options.words) {
            words = this.options.words.split(/\s*,\s*/);
            words = words.map((v) => {
                return { id: v, text: v };
            });
        }

        // Per Cornelis, if our max lenght is 1, we want select style. If it is larger, we want tag style
        // Now this is somewhat fishy because so far, we always configured tag style by setting config.tags = words.
        // Even if words was [], we would get a tag stylee select
        // That was then properly working with ajax if configured.

        if (this.options.maxSelectionSize === 1) {
            config.data = words;
            // We allow exactly one value, use dropdown styles. How do we feed in words?
        } else {
            // We allow multiple values, use the pill style - called tags in select 2 speech
            config.tags = words;
        }

        if (this.options.prefill?.length) {
            this.el.value = this.options.prefill.split(",");
            config.initSelection = (element, callback) => {
                let data = [];
                const values = element.val().split(",");
                for (const value of values) {
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
                for (const d in data) {
                    if (typeof d === "object") {
                        ids.push(d.id);
                    } else {
                        ids.push(d);
                    }
                }
                this.el.value = ids;
                config.initSelection = (element, callback) => {
                    let _data = [];
                    for (const d in data) {
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
                log.error("SyntaxError: non-JSON data given to pat-autosuggest");
            }
        }

        if (this.options.ajax?.url) {
            config = $.extend(
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
                config
            );
        }
        return config;
    },

    destroy($el) {
        $el.off(".pat-autosuggest");
        $el.select2("destroy");
    },
});
