/* pat-date-picker  - Polyfill for input type=date */
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";
import utils from "../../core/utils";

// Lazy loading modules.
let Pikaday;
let Moment;

const parser = new Parser("date-picker");
parser.addArgument("behavior", "styled", ["native", "styled"]);
parser.addArgument("format", "YYYY-MM-DD");
parser.addArgument("week-numbers", [], ["show", "hide"]);
parser.addArgument("i18n"); // URL pointing to JSON resource with i18n values
parser.addArgument("first-day", 0);
parser.addArgument("after");
parser.addArgument("offset-days", 0);

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

    async init() {
        const el = this.el;
        //TODO: make parser with options extend missing options.
        //this.options = parser.parse(el, opts);
        this.options = $.extend(parser.parse(el), this.options);

        if (
            this.options.behavior === "native" &&
            utils.checkInputSupport("date", "invalid date")
        ) {
            return;
        }

        Pikaday = await import("pikaday");
        Pikaday = Pikaday.default;
        Moment = await import("moment");
        Moment = Moment.default;

        if (el.getAttribute("type") === "date") {
            el.setAttribute("type", "text");
        }

        const config = {
            field: el,
            format: this.options.format,
            firstDay: this.options.firstDay,
            showWeekNumber: this.options.weekNumbers === "show",
            toString(date, format) {
                return Moment(date).format(format);
            },
            onSelect() {
                $(this._o.field).closest("form").trigger("input-change");
                /* Also trigger input change on date field to support pat-autosubmit. */
                $(this._o.field).trigger("input-change");
            },
        };

        if (el.getAttribute("min")) {
            config.minDate = Moment(el.getAttribute("min")).toDate();
        }
        if (el.getAttribute("max")) {
            config.maxDate = Moment(el.getAttribute("max")).toDate();
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

    isodate() {
        const now = new Date();
        return now.toISOString().substr(0, 10);
    },
});
