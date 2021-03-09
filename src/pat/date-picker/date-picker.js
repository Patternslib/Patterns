/* pat-date-picker  - Polyfill for input type=date */
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";
import PatDisplayTime from "../display-time/display-time";
import utils from "../../core/utils";

// Lazy loading modules.
let Pikaday;

const parser = new Parser("date-picker");
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
        //TODO: make parser with options extend missing options.
        //this.options = parser.parse(el, opts);
        this.options = $.extend(parser.parse(el), this.options);

        if (this.options.after) {
            // Set the date depending on another date which must be ``offset-days``
            // BEFORE this date. Only set it, if the other date is AFTER this
            // date.
            const befores = document.querySelectorAll(this.options.after);
            for (const b_el of befores) {
                b_el.addEventListener("input", (e) => {
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
                        this.el.dispatchEvent(
                            new Event("input", {
                                bubbles: true,
                                cancelable: true,
                            })
                        );
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

            const display_time_config = { format: this.format };
            if (this.options.outputFormat) {
                display_time_config[
                    "output-format"
                ] = this.options.outputFormat;
            }
            if (this.options.locale) {
                display_time_config.locale = this.options.locale;
            }
            el.insertAdjacentElement("afterend", display_el);
            const display_el_pat = new PatDisplayTime(
                display_el,
                display_time_config
            );

            this.el.addEventListener("input", () => {
                display_el.setAttribute("datetime", this.el.value);
                display_el_pat.format();
            });
        } else if (utils.checkInputSupport("date", "invalid date")) {
            // behavior native with native support.
            return;
        } else if (el.getAttribute("type") === "date") {
            // behavior native but no native support.
            // Fallback JS date picker with a text input field.
            el.setAttribute("type", "text");
        }

        Pikaday = await import("pikaday");
        Pikaday = Pikaday.default;

        const config = {
            field: el,
            trigger: display_el || el,
            format: this.format,
            firstDay: this.options.firstDay,
            showWeekNumber: this.options.weekNumbers === "show",
            onSelect() {
                $(this._o.field).closest("form").trigger("input-change");
                /* Also trigger input change on date field to support pat-autosubmit. */
                $(this._o.field).trigger("input-change");
                this._o.field.dispatchEvent(
                    new Event("input", { bubbles: true, cancelable: true })
                );
            },
        };

        if (el.getAttribute("min")) {
            config.minDate = new Date(el.getAttribute("min"));
        }
        if (el.getAttribute("max")) {
            config.maxDate = new Date(el.getAttribute("max"));
        }

        if (this.options.i18n) {
            $.getJSON(this.options.i18n)
                .done((data) => {
                    config.i18n = data;
                })
                .fail(
                    $.proxy(() => {
                        console.error(
                            "date-picker could not load i18n: " +
                                this.options.i18n
                        );
                    }, this)
                )
                .always(() => {
                    new Pikaday(config);
                });
        } else {
            new Pikaday(config);
        }
    },
});
