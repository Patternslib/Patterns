/**
 * Patternslib pattern for Masonry
 * Copyright 2015 Syslab.com GmBH
 */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "jquery",
            "pat-registry",
            "pat-parser",
            "pat-base",
            "masonry",
            "imagesloaded"
            ], function() {
                return factory.apply(this, arguments);
        });
    } else {
        factory(root.$, root.patterns, root.patterns.Parser, root.Base, root.Masonry, root.imagesLoaded);
    }
}(this, function($, registry, Parser, Base, Masonry, imagesLoaded) {
    "use strict";
    var parser = new Parser("masonry");
    parser.addArgument("column-width");
    parser.addArgument("container-style", "{ position: 'relative' }");
    parser.addArgument("gutter");
    parser.addArgument("hidden-style", "{ opacity: 0, transform: 'scale(0.001)' }");
    parser.addArgument("is-fit-width", false);
    parser.addArgument("is-origin-left", true);
    parser.addArgument("is-origin-top", true);
    parser.addArgument("item-selector", ".item");
    parser.addArgument("stamp", "");
    parser.addArgument("transition-duration", "0.4s");
    parser.addArgument("visible-style", "{ opacity: 1, transform: 'scale(1)' }");

    return Base.extend({
        name: "masonry",
        trigger: ".pat-masonry",

        init: function masonryInit($el, opts) {
            var options = parser.parse(this.$el, opts);
            $(document).trigger("clear-imagesloaded-cache");
            this.msnry = new Masonry(this.$el[0], {
                columnWidth:         this.getTypeCastedValue(options.columnWidth),
                containerStyle:      options.containerStyle,
                gutter:              this.getTypeCastedValue(options.gutter),
                hiddenStyle:         options.hiddenStyle,
                isFitWidth:          options.is["fit-width"],
                isInitLayout:        false,
                isOriginLeft:        options.is["origin-left"],
                isOriginTOp:         options.is["origin-top"],
                itemSelector:        options.itemSelector,
                stamp:               options.stamp,
                transitionDuration:  options.transitionDuration,
                visibleStyle:        options.visibleStyle
            });
            this.$el.imagesLoaded(this.layout.bind(this));
        },

        layout: function () {
            this.$el.removeClass("masonry-ready");
            this.msnry.on("layoutComplete", function() {
                this.$el.addClass("masonry-ready");
            }.bind(this));
            this.msnry.layout();
        },

        getTypeCastedValue: function (original) {
            var val = Number(original);
            return (isNaN(val)) ? (original || 0) : val;
        }
    });
}));
