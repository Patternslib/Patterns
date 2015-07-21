/**
 * Copyright 2012-2013 Syslab.com GmbH - JC Brand
 */
define([
    "jquery",
    "pat-registry",
    "pat-base",
    "pat-utils",
    "pat-logger",
    "pat-parser",
    "underscore",
    "jquery.smoothscroll"
], function($, patterns, Base, utils, logging, Parser, _) {
    var log = logging.getLogger("scroll"),
        parser = new Parser("scroll");
    parser.addArgument("trigger", "click", ["click", "auto"]);
    parser.addArgument("direction", "top", ["top", "left"]);

    return Base.extend({
        name: "scroll",
        trigger: ".pat-scroll",
        jquery_plugin: true,

        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts);
            if (this.options.trigger == "auto") {
                this.smoothScroll();
                this.$el.on('patterns-injected', this.smoothScroll.bind(this));
            } else if (this.options.trigger == "click") {
                this.$el.click(this.smoothScroll.bind(this));
            }
        },

        smoothScroll: function() {
            if (this.options.direction == "top") {
                this.$el.animate({scrollTop: 0}, 500);
            } else if (this.options.direction == "left") {
                this.$el.animate({scrollLeft: 0}, 500);
            }
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
