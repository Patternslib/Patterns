/* pat-date-picker  - Polyfill for input type=date */
define([
    "underscore",
    "pat-parser",
    "pat-registry",
    "pat-base",
    "stickyfill",
], function(_, Parser, registry, Base, Stickyfill) {
    "use strict";
    var parser = new Parser("sticky");

    return Base.extend({
        name: "sticky",
        trigger: ".pat-sticky",
        init: function() {
            this.options = $.extend(this.options, parser.parse(this.$el));
            this.$el.Stickyfill();
            return this.$el;
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
