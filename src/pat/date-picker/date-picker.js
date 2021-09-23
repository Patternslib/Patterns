/* pat-date-picker  - Polyfill for input type=date */
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";
import utils from "../../core/utils";

export const parser = new Parser("date-picker");
parser.addArgument("behavior", "styled", ["native", "styled"]);
parser.addArgument("week-numbers", [], ["show", "hide"]);
parser.addArgument("i18n"); // URL pointing to JSON resource with i18n values
parser.addArgument("first-day", 0);
parser.addArgument("after");
parser.addArgument("offset-days", 0);

parser.add_argument("output-format", null);
parser.add_argument("locale", null);

parser.addAlias("behaviour", "behavior");

/* JSON format for i18n
 * { "previousMonth": "Previous Month",
 *   "nextMonth"    : "Next Month",
 *   "months"       : ["January","February","March","April","May","June","July","August","September","October","November","December"],
 *   "weekdays"     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
 *   "weekdaysShort": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
 * } */

export default Base.extend({
    name: "date-picker",
    trigger: ".pat-date-picker",
    parser: parser,
    format: "YYYY-MM-DD",

    async init() {
        const el = this.el;
        const disabled = this.el.disabled;

        //TODO: make parser with options extend missing options.
        //this.options = parser.parse(el, opts);
        this.options = $.extend(parser.parse(el), this.options);

        if (!disabled && this.options.after) {
            // Set the date depending on another date which must be ``offset-days``
            // BEFORE this date. Only set it, if the other date is AFTER this
            // date.
            const befores = document.querySelectorAll(this.options.after);
            for (const b_el of befores) {
                b_el.addEventListener("change", (e) => {
                    let b_date = e.target.value; // the "before-date"
                    b_date = b_date ? new Date(b_date) : null;
                    if (!b_date) {
                        return;
                    }
                    let a_date = this.el.value; // the "after-date"
                    a_date = a_date ? new Date(a_date) : null;
                    if (!a_date || a_date < b_date) {
                        const offset = this.options.offsetDays || 0;
                        b_date.setDate(b_date.getDate() + offset);
                        this.el.value = b_date.toISOString().substring(0, 10);
                        this.dispatch_change_event();
                    }
                });
            }
        }

        let display_el;
        if (this.options.behavior === "styled") {
            el.setAttribute("type", "hidden");

            display_el = document.createElement("time");
            display_el.setAttribute("class", "output-field");
            display_el.setAttribute("datetime", el.value);
            if (disabled) {
                display_el.classList.add("disabled");
            }
            el.insertAdjacentElement("beforebegin", display_el);

            let display_el_pat;
            if (this.options.outputFormat) {
                const PatDisplayTime = (await import("../display-time/display-time")).default; // prettier-ignore
                const display_time_config = { format: this.format };
                if (this.options.outputFormat) {
                    display_time_config["output-format"] = this.options.outputFormat;
                }
                if (this.options.locale) {
                    display_time_config.locale = this.options.locale;
                }
                display_el_pat = new PatDisplayTime(display_el, display_time_config);
            } else {
                display_el.textContent = el.value;
            }

            $(display_el).on("init.display-time.patterns", () =>
                this.add_clear_button(display_el)
            );

            this.el.addEventListener("change", () => {
                display_el.setAttribute("datetime", this.el.value);
                if (display_el_pat) {
                    display_el_pat.format();
                } else {
                    display_el.textContent = this.el.value;
                }
                this.add_clear_button(display_el);
            });

            if (disabled) {
                // nothing else to do here...
                return;
            }
        } else if (disabled) {
            return;
        } else if (utils.checkInputSupport("date", "invalid date")) {
            // behavior native with native support.
            return;
        } else if (el.getAttribute("type") === "date") {
            // behavior native but no native support.
            // Fallback JS date picker with a text input field.
            el.setAttribute("type", "text");
        }

        if (window.__patternslib_import_styles) {
            import("./_date-picker.scss");
        }
        const Pikaday = (await import("pikaday")).default;

        const config = {
            field: el,
            trigger: display_el || el,
            format: this.format,
            firstDay: this.options.firstDay,
            showWeekNumber: this.options.weekNumbers === "show",
            onSelect: () => this.dispatch_change_event(),
        };

        if (el.getAttribute("min")) {
            config.minDate = new Date(el.getAttribute("min"));
        }
        if (el.getAttribute("max")) {
            config.maxDate = new Date(el.getAttribute("max"));
        }

        if (this.options.i18n) {
            try {
                const response = await fetch(this.options.i18n);
                config.i18n = await response.json();
            } catch {
                console.error(
                    `date-picker could not load i18n for ${this.options.i18n}`
                );
            }
        }
        this.pikaday = new Pikaday(config);
    },

    add_clear_button(el_append_to) {
        if (!this.el.disabled && !this.el.required && this.el.value) {
            // Add clear button
            const clear_button = document.createElement("span");
            clear_button.setAttribute("class", "cancel-button");
            clear_button.addEventListener("click", (e) => {
                e.stopPropagation();
                this.el.value = null;
                this.dispatch_change_event();
            });
            el_append_to.appendChild(clear_button);
        }
    },

    dispatch_change_event() {
        const event = new Event("change", {
            bubbles: true,
            cancelable: true,
        });
        // Set ``firedBy` to prevent pikaday to call it's own handler and land
        // in an infinite loop.
        event.firedBy = this.pikaday;
        this.el.dispatchEvent(event);

        // Also trigger input-change
        $(this.el).trigger("input-change");
        $(this.el.form).trigger("input-change");
    },
});
