/* pat-date-picker  - Polyfill for input type=date */
import $ from "jquery";
import _ from "underscore";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import Base from "../../core/base";
import Pikaday from "pikaday";
import moment from "moment";

var parser = new Parser("date-picker");
parser.addArgument("behavior", "styled", ["native", "styled"]);
parser.addArgument("format", "YYYY-MM-DD");
parser.addArgument("week-numbers", [], ["show", "hide"]);
parser.addArgument("i18n"); // URL pointing to JSON resource with i18n values
parser.addArgument("first-day", 0);

/* JSON format for i18n
 * { "previousMonth": "Previous Month",
 *   "nextMonth"    : "Next Month",
 *   "months"       : ["January","February","March","April","May","June","July","August","September","October","November","December"],
 *   "weekdays"     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
 *   "weekdaysShort": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
 * } */
parser.addAlias("behaviour", "behavior");

export default Base.extend({
    name: "date-picker",
    trigger: ".pat-date-picker",
    init: function() {
        this.options = $.extend(parser.parse(this.$el), this.options);
        this.polyfill = this.options.behavior === "native";
        if (this.polyfill && utils.checkInputSupport('date', 'invalid date')) {
            return;
        }
        if (this.$el.attr("type") === "date") {
            this.$el.attr("type", "text");
        }

        var config = {
            field: this.$el[0],
            format: this.options.format,
            firstDay: this.options.firstDay,
            showWeekNumber: this.options.weekNumbers === "show",
            toString: function(date, format) {
                var date = moment(date).format(format);
                return date;
            },
            onSelect: function() {
                $(this._o.field)
                    .closest("form")
                    .trigger("input-change");
                /* Also trigger input change on date field to support pat-autosubmit. */
                $(this._o.field).trigger("input-change");
            }
        };

        if (this.$el.attr("min")) {
            config.minDate = moment(this.$el.attr("min")).toDate();
        }
        if (this.$el.attr("max")) {
            config.maxDate = moment(this.$el.attr("max")).toDate();
        }

        if (this.options.i18n) {
            $.getJSON(this.options.i18n)
                .done(function(data) {
                    config.i18n = data;
                })
                .fail(
                    $.proxy(function() {
                        console.error(
                            "date-picker could not load i18n: " +
                                this.options.i18n
                        );
                    }, this)
                )
                .always(function() {
                    new Pikaday(config);
                });
        } else {
            new Pikaday(config);
        }
        return this.$el;
    },

    isodate: function() {
        var now = new Date();
        return now.toISOString().substr(0, 10);
    }
});
