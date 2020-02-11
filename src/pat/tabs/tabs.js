/**
 * Copyright 2015 Syslab.com GmbH - witekdev
 */
define([
    "jquery",
    "underscore",
    "pat-registry",
    "pat-base",
    "pat-utils",
    "pat-logger",
    "pat-parser"
], function($, _, patterns, Base, utils, logging, Parser) {
    var log = logging.getLogger("tabs"),
        parser = new Parser("tabs");

    return Base.extend({
        name: "tabs",
        trigger: ".pat-tabs",
        jquery_plugin: true,

        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts); // redundant - at the moment we have no parameter options
            $(window).resize(_.debounce(this.adjustTabs.bind(this), 100));
            $("body").on("pat-update", this.filterByPatternsUpdate.bind(this));
            this.adjustTabs();
        },

        filterByPatternsUpdate: function(ev, data) {
            // determine when to call adjustTabs depending as to which pattern triggered pat-update
            var allowed_patterns = [
                "stacks",
                "switch",
                "auto-scale",
                "grid",
                "equaliser",
                "masonry",
                "zoom"
            ];
            // XXX TODO add other (or remove redundant) layout modifying patterns
            if ($.inArray(data.pattern, allowed_patterns) > -1) {
                this.adjustTabs();
            }
        },

        adjustTabs: function(ev, data) {
            var container_width = this.$el.width() * 0.95,
                $children = this.$el.children(),
                total_width = 0,
                idx = 0,
                tab_width,
                $overflowing;

            if ($children.length !== 0) {
                // here we want to gather all tabs including those that may be in a special 'extra-tabs'
                // span and place them all as equal children, before we recalculate which tabs are
                // visible and which are potentially fully or partially obscured.
                var $grouper = $children.filter(".extra-tabs");
                $grouper.children().appendTo(this.$el);
                $grouper.remove();
                $children = this.$el.children();

                // precalculate the collective size of all the tabs
                total_width = _.reduce(
                    $children,
                    function(value, el) {
                        return value + $(el).outerWidth(true);
                    },
                    0
                );

                // only execute if all tabs cannot fit comfortably in the container
                if (total_width >= container_width) {
                    this.$el.append('<span class="extra-tabs"></span>'); // create extra-tabs span
                    var extra_tab_width = $(".extra-tabs").outerWidth(true);
                    total_width = 0;
                    tab_width = $($children[idx]).outerWidth(true);
                    // iterate through all visible tabs until we find the first obscured tab
                    while (
                        total_width + tab_width <
                        container_width - extra_tab_width
                    ) {
                        total_width += tab_width;
                        idx++;
                        tab_width = $($children[idx]).outerWidth(true);
                    }
                    $overflowing = this.$el.children(":gt(" + (idx - 1) + ")");
                    // move obscured tabs to a special 'extra-tabs' span
                    this.$el
                        .children()
                        .filter(".extra-tabs")
                        .append($overflowing); // move tabs into it
                }
            }
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
