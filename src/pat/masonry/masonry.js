/**
* Patternslib pattern for Masonry
* Copyright 2015 Syslab.com GmBH
*/

import $ from "jquery";
import logger from "../../core/logger";
import registry from "../../core/registry";
import Parser from "../../core/parser";
import Base from "../../core/base";
import utils from "../../core/utils";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

var log = logger.getLogger("pat.masonry");
var parser = new Parser("masonry");

// parser.addArgument("stagger", "");
parser.addArgument("column-width");
parser.addArgument("container-style", '{ "position": "relative" }');
parser.addArgument("gutter");
parser.addArgument("is-fit-width", false);
parser.addArgument("is-horizontal-order", false); // preserve horizontal order.
parser.addArgument("is-origin-left", true);
parser.addArgument("is-origin-top", true);
parser.addArgument("is-percent-position", false); // set item positions in percent values. items will not transition on resize.
parser.addArgument("is-resize", true); // adjust sizes and position on resize.
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

export default Base.extend({
    name: "masonry",
    trigger: ".pat-masonry",

    init: function masonryInit($el, opts) {
        this.options = parser.parse(this.$el, opts);
        // Initialize
        this.initMasonry();

        var imgLoad = imagesLoaded(this.$el);
        imgLoad.on(
            "progress",
            function() {
                if (!this.msnry) {
                    this.initMasonry();
                }
                this.quicklayout();
            }.bind(this)
        );
        imgLoad.on(
            "always",
            function() {
                if (!this.msnry) {
                    this.initMasonry();
                }
                this.layout();
            }.bind(this)
        );

        // Update if something gets injected inside the pat-masonry
        this.$el
            .on(
                "patterns-injected.pat-masonry",
                utils.debounce(this.update.bind(this), 100)
            )
            .on(
                "pat-update",
                utils.debounce(this.quicklayout.bind(this), 200)
            );

        var callback = utils.debounce(this.quicklayout.bind(this), 400);
        var observer = new MutationObserver(callback);
        /* Explicitly not including style. We assume style is set dynamically only by scripts and we do all our controlled changes through classes.
           That way we avoid masonry to react on its own style calculation */
        var config = {
            childList: true,
            subtree: true,
            characterData: false,
            attributeOldValue: true,
            attributes: true,
            attributeFilter: ["class"]
        };
        observer.observe(document.body, config);
    },

    initMasonry: function() {
        var containerStyle;
        try {
            containerStyle = JSON.parse(this.options.containerStyle);
        } catch (e) {
            containerStyle = { position: "relative" };
            log.warn(
                "Invalid value passed in as containerStyle. Needs to " +
                    "be valid JSON so that it can be converted to an object for Masonry."
            );
        }
        this.msnry = new Masonry(this.$el[0], {
            columnWidth: this.getTypeCastedValue(this.options.columnWidth),
            containerStyle: containerStyle,
            fitWidth: this.options.is["fit-width"],
            gutter: this.getTypeCastedValue(this.options.gutter),
            horizontalOrder: this.options.is["horizontal-order"],
            initLayout: false,
            itemSelector: this.options.itemSelector,
            originLeft: this.options.is["origin-left"],
            originTop: this.options.is["origin-top"],
            percentPosition: this.options.is["percent-position"],
            resize: this.options.is["resize"],
            stamp: this.options.stamp,
            transitionDuration: this.options.transitionDuration
        });
    },

    update: function() {
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
        this.$el.find(".pat-masonry").each(function(idx, child) {
            $(child).patMasonry("quicklayout");
        });
        this.msnry.layout();
    },

    layout: function() {
        this.$el.removeClass("masonry-ready");
        this.msnry.on(
            "layoutComplete",
            function() {
                this.$el.addClass("masonry-ready");
            }.bind(this)
        );
        this.msnry.layout();
        this.quicklayout();
    },

    getTypeCastedValue: function(original) {
        var val = Number(original);
        return isNaN(val) ? original || 0 : val;
    }
});
