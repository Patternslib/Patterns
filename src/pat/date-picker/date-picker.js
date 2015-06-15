/* pat-date-picker  - Polyfill for input type=date */
define([
    "pat-parser",
    "pat-registry",
    "pat-base",
    "pikaday",
    "moment",
    "moment-timezone",
    "modernizr"
], function(Parser, registry, Base, Pikaday, moment, momenttimezone) {
    "use strict";
    var parser = new Parser("date-picker");
    parser.addArgument("behavior", "styled", ["native", "styled"]);
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
            new Pikaday({ field: this.$el[0] });
            return this.$el;
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
