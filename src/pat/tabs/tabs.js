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
            $('body').on("pat-update", this.filterByPatternsUpdate.bind(this));
            this.adjustTabs();
        },

        filterByPatternsUpdate: function(ev, data) {
            // determine when to call adjustTabs depending as to which pattern triggered pat-update
            allowed_patterns: ["switch", "pattern", "pattern2"]; // XXX add other layout modifying patterns
            if ( $.inArray(data.pattern, allowed_patterns) > -1 ) {
                this.adjustTabs.bind(this);
            }
        },

        adjustTabs: function(ev, data) {
            var container_width = this.$el.width(),
                children = this.$el.children(),
                total_width = 0,
                idx = 0,
                tab_width,
                extra_tabs,
                obscured_tabs;

            if ( children.length != 0 ) {
                // assumption!! the tab that contains extra tabs will always exist as the last tab
                // here we want to gather all tabs including those that maybe in a special 'extra-tabs'
                // span and place them all as equal children, before we recalculate which tabs are 
                // visible and which are potentially fully or partially obscured.
                if ( $(children[children.length-1]).hasClass('extra-tabs') ) {
                    extra_tabs = $(children[children.length-1]).children();
                    if (extra_tabs.length != 0 ) {
                        extra_tabs.appendTo(this.$el); // move previously obscured tabs out of 'extra-tabs' span
                    }
                    children.filter(".extra-tabs").remove(); // remove 'extra-tabs' span
                }

                // precalculate the collective size of all the tabs 
                $.each(this.$el.children(), function() {
                    total_width += $(this).outerWidth(true);
                });     

                // only execute if all tabs cannot fit comfortably in the container
                if ( total_width >= container_width ) {
                    total_width = 0;
                    tab_width = $(this.$el.children()[idx]).outerWidth(true);
                    // iterate through all visible tabs until we find the first obscured tab
                    while ( (total_width+tab_width) < container_width ) {
                        total_width += tab_width;
                        idx++;
                        tab_width = $(this.$el.children()[idx]).outerWidth(true);
                    }
                    // find the partially/fully obscured tabs and mark them as such
                    while (idx < $(this.$el.children()).length) {
                        $(this.$el.children()[idx]).addClass("obscured_tab"); // temporary marking mechanism
                        idx++;
                    }
                    obscured_tabs = this.$el.children().filter(".obscured_tab");
                    // move obscured tabs to a special 'extra-tabs' span
                    this.$el.append('<span class="extra-tabs"></span>'); // create extra-tabs span
                    this.$el.children().filter(".extra-tabs").append(obscured_tabs); // move tabs into it
                    obscured_tabs.removeClass("obscured_tab"); // remove marking mechanism
                }
            }
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab