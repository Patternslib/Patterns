/**
 * Copyright 2015 Syslab.com GmbH - witekdev
 */
define([
    "jquery",
    "pat-registry",
    "pat-base",
    "pat-utils",
    "pat-logger",
    "pat-parser",
    "underscore"
], function($, patterns, Base, utils, logging, Parser, _) {
    var log = logging.getLogger("tabs"),
        parser = new Parser("tabs");

    return Base.extend({
        name: "tabs",
        trigger: ".pat-tabs",
        jquery_plugin: true,

        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts); // redundant - at the moment we have no parameter options
            $(window).resize(_.debounce(this.adjustTabs.bind(this), 200));            
            this.adjustTabs();
        },

        adjustTabs: function(ev, data) {
            var window_width = $('body')[0].clientWidth; // width of window excluding scrollbar
            // alternatively one can use window.innerWidth but that does include the scrollbar.
            if ( this.$el.width() >= window_width ) {
                var children = this.$el.children(),
                    total_width = 0,
                    idx = 0,
                    tab_width = $(this.$el.children()[idx]).outerWidth(true);
                this.$el.children().removeClass("TOGGLED"); // temporary marking mechanism
                while ( (total_width+tab_width) < window_width ) {                    
                    total_width += tab_width;
                    idx++;
                    tab_width = $(this.$el.children()[idx]).outerWidth(true);
                }
                // put all invisible or partialy invisible tabs in a special span with class 'extra-tabs'
                while (idx < $(this.$el.children()).length) {
                    $(this.$el.children()[idx]).addClass("TOGGLED"); // temporary marking mechanism
                    idx++;
                }
            }
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab