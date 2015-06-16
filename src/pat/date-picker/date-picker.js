/* pat-date-picker  - Polyfill for input type=date */
define([
    "underscore",
    "pat-parser",
    "pat-registry",
    "pat-base",
    "pikaday",
    "moment",
    "moment-timezone",
    "modernizr"
], function(_, Parser, registry, Base, Pikaday, moment, momenttimezone) {
    "use strict";
    var parser = new Parser("date-picker");
    parser.addArgument("behavior", "styled", ["native", "styled"]);
    parser.addArgument("show", [], ["week-number", "month-after-year"], true);
    /* JSON format for i18n
     * { "previousMonth": "Previous Month",
     *   "nextMonth"    : "Next Month",
     *   "months"       : ["January","February","March","April","May","June","July","August","September","October","November","December"],
     *   "weekdays"     : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
     *   "weekdaysShort": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
     * } */
    parser.addJSONArgument("i18n");

    parser.addAlias("behaviour", "behavior");

    return Base.extend({
        name: "date-picker",
        trigger: ".pat-date-picker",
        init: function() {
            this.options = $.extend(this.options, parser.parse(this.$el));
            this.polyfill = this.options.behavior === "native";
            if (this.polyfill && Modernizr.inputtypes.date) {
                return;
            }
            if (this.$el.attr("type") === "date") {
                this.$el.attr("type", "text");
            }
            var config = {
                "field": this.$el[0],
                "minDate": this.$el.attr("min") ? moment(this.$el.attr("min")).toDate() : undefined,
                "maxDate": this.$el.attr("max") ? moment(this.$el.attr("max")).toDate() : undefined,
                "showWeekNumber": this.options.show.indexOf("week-number") !== -1,
                "showMonthAfterYear": this.options.show.indexOf("month-after-year") !== -1,
            };
            if (!$.isEmptyObject(this.options.i18n)) {
                config.i18n = this.options.i18n;
            }
            new Pikaday(config);
            return this.$el;
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
