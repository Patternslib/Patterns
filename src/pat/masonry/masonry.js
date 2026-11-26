/**
 * Patternslib pattern for Masonry
 * Copyright 2015 Syslab.com GmBH
 */
import $ from "jquery";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import Base from "../../core/base";
import utils from "../../core/utils";

// Lazy loading modules.
let Masonry;

const log = logging.getLogger("pat.masonry");

export const parser = new Parser("masonry");
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

    async init($el, opts) {
        Masonry = (await import("masonry-layout")).default;

        this.options = parser.parse(this.$el, opts);
        // Initialize
        this.initMasonry();

        // Re-layout whenever an image within has been loaded or failed
        // loading. The load and error events do not bubble, but can be
        // captured. This also catches images which are added later.
        // When all images are loaded, do a full layout which sets the
        // ``masonry-ready`` class.
        this.is_images_loaded = false;
        const on_image_loaded = () => {
            this.quicklayout();
            this.layout_when_images_loaded();
        };
        this.el.addEventListener("load", on_image_loaded, true);
        this.el.addEventListener("error", on_image_loaded, true);
        this.layout_when_images_loaded();

        // Update if something gets injected inside the pat-masonry
        this.$el
            .on(
                "patterns-injected.pat-masonry",
                utils.debounce(this.update.bind(this), 100)
            )
            .on("pat-update", utils.debounce(this.quicklayout.bind(this), 200));

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
            attributeFilter: ["class"],
        };
        observer.observe(document.body, config);
    },

    async initMasonry() {
        var containerStyle;
        try {
            containerStyle = JSON.parse(this.options.containerStyle);
        } catch {
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
            transitionDuration: this.options.transitionDuration,
        });
    },

    update: function () {
        this.msnry.remove();
        this.initMasonry();
        this.layout();
    },

    quicklayout: function () {
        if (!this.msnry) {
            // Not initialized yet
            return;
        }
        // call masonry layout on the children before calling it on this element
        this.$el.find(".pat-masonry").each(function (idx, child) {
            $(child).patMasonry("quicklayout");
        });
        this.msnry.layout();
    },

    layout: function () {
        this.$el.removeClass("masonry-ready");
        this.msnry.once("layoutComplete", () => {
            this.$el.addClass("masonry-ready");
        });
        this.msnry.layout();
        this.quicklayout();
    },

    layout_when_images_loaded() {
        // Do a full layout once all images are loaded or failed loading.
        if (this.is_images_loaded) {
            return;
        }
        // Ignore lazy loading images, which might only be loaded when
        // scrolled into view.
        const is_images_loaded = [...this.el.querySelectorAll("img")].every(
            (img) => img.complete || img.getAttribute("loading") === "lazy"
        );
        if (!is_images_loaded) {
            return;
        }
        this.is_images_loaded = true;
        this.layout();
    },

    getTypeCastedValue: function (original) {
        var val = Number(original);
        return isNaN(val) ? original || 0 : val;
    },
});
