/**
 * Patternslib pattern for Masonry
 * Copyright 2015 Syslab.com GmBH
 */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "jquery",
            "pat-logger",
            "pat-registry",
            "pat-parser",
            "pat-base",
            "pat-utils",
            "masonry"
            ], function() {
                return factory.apply(this, arguments);
        });
    } else {
        factory(root.$, root.patterns, root.patterns.Parser, root.Base, root.Masonry);
    }
}(this, function($, logger, registry, Parser, Base, utils, Masonry) {
    "use strict";
    var log = logger.getLogger("pat.masonry");
    var parser = new Parser("masonry");

    // parser.addArgument("stagger", "");
    parser.addArgument("column-width");
    parser.addArgument("container-style", '{ "position": "relative" }');
    parser.addArgument("gutter");
    parser.addArgument("is-fit-width", false);
    parser.addArgument("is-horizontal-order", false);  // preserve horizontal order.
    parser.addArgument("is-origin-left", true);
    parser.addArgument("is-origin-top", true);
    parser.addArgument("is-percent-position", false);  // set item positions in percent values. items will not transition on resize.
    parser.addArgument("is-resize", true);  // adjust sizes and position on resize.
    parser.addArgument("item-selector", ".item");
    parser.addArgument("stamp", "");
    parser.addArgument("transition-duration", "0.4s");

    // is-* are masonry v3 options, here we add v4 style names.
    // we keep the is-* as there is special support with options parsing.
    parser.addAlias("fit-width", "is-fit-width");
    parser.addAlias("origin-left", "is-origin-left");
    parser.addAlias("origin-top", "is-origin-top");
    parser.addAlias("horizontal-order", "is-horizontal-order");
    parser.addAlias("percent-position", "is-percent-position");
    parser.addAlias("resize", "is-resize");



    return Base.extend({
        name: "masonry",
        trigger: ".pat-masonry",

        init: function masonryInit($el, opts) {
            this.options = parser.parse(this.$el, opts);

            // Initialize
            this.initMasonry();

            // Update if something gets injected inside the pat-masonry
            this.$el
                .on("patterns-injected.pat-masonry",
                    utils.debounce(this.update.bind(this), 100))
                .on("pat-update",
                    utils.debounce(this.quicklayout.bind(this), 200));

            // Initially layout on document ready.
            $(document).ready(utils.debounce(this.layout.bind(this), 100));

            // Re-Layout, if images are loaded within pat-masonry
            $('img', this.$el)
                .on("load", utils.debounce(this.quicklayout.bind(this), 200));
        },

        initMasonry: function () {
            var containerStyle;
            try {
                containerStyle = JSON.parse(this.options.containerStyle);
            } catch (e) {
                containerStyle = { "position": "relative" };
                log.warn(
                    "Invalid value passed in as containerStyle. Needs to "+
                    "be valid JSON so that it can be converted to an object for Masonry."
                );
            }
            this.msnry = new Masonry(this.$el[0], {
                columnWidth:         this.getTypeCastedValue(this.options.columnWidth),
                containerStyle:      containerStyle,
                fitWidth:            this.options.is["fit-width"],
                gutter:              this.getTypeCastedValue(this.options.gutter),
                horizontalOrder:     this.options.is["horizontal-order"],
                initLayout:          false,
                itemSelector:        this.options.itemSelector,
                originLeft:          this.options.is["origin-left"],
                originTop:           this.options.is["origin-top"],
                percentPosition:     this.options.is["percent-position"],
                resize:              this.options.is["resize"],
                stamp:               this.options.stamp,
                transitionDuration:  this.options.transitionDuration,
            });
        },

        update: function () {
            this.msnry.remove();
            this.initMasonry();
            this.layout();
        },

        quicklayout: function() {
            if (!this.msnry) {
                // Not initialized yet
                return;
            }
            // call masonry layout on the children before calling it on this element
            this.$el.find('.pat-masonry').each(
                function(idx, child) {
                    $(child).patMasonry('quicklayout');
                }
            );
            this.msnry.layout();
        },

        layout: function () {
            this.$el.removeClass("masonry-ready");
            this.msnry.on("layoutComplete", function() {
                this.$el.addClass("masonry-ready");
            }.bind(this));
            this.msnry.layout();
            this.quicklayout();
        },

        getTypeCastedValue: function (original) {
            var val = Number(original);
            return (isNaN(val)) ? (original || 0) : val;
        }
    });
}));
