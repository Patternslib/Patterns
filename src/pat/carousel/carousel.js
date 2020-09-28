/**
 * Patterns carousel
 *
 * Copyright 2017 Syslab.com GmbH Alexander Pilz
 */
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import utils from "../../core/utils";

var log = logging.getLogger("pat.carousel"),
    parser = new Parser("carousel");

parser.addArgument("auto-play", false);
parser.addArgument("auto-play-speed", 1000);
parser.addArgument("speed", 500);
parser.addArgument("height", "fixed");
parser.addArgument("arrows", "show");
parser.addArgument("slides-to-show", 1);
parser.addArgument("slides-to-scroll", 1);
parser.addArgument("dots", "show");
parser.addArgument("append-dots", "");
parser.addArgument("infinite", false);

export default Base.extend({
    name: "carousel",
    trigger: ".pat-carousel",

    async init(el, opts) {
        await import("slick-carousel");

        if (el.jquery) {
            el = el[0];
        }
        const options = parser.parse(el, opts);
        const settings = {};

        settings.autoplay = options.auto.play;
        settings.autoplaySpeed = options.auto["play-speed"];
        settings.speed = options.speed;
        settings.adaptiveHeight = options.height === "adaptive";
        settings.arrows = options.arrows === "show";
        settings.slidesToShow = options.slides["to-show"];
        settings.slidesToScroll = options.slides["to-scroll"];
        settings.dots = options.dots === "show";
        if (options.appendDots) {
            settings.appendDots = options.appendDots;
        }
        settings.infinite = options.infinite;

        this.setup(el, settings);
    },

    async setup(el, settings) {
        let loaded = true;
        const images = el.querySelectorAll("img");
        for (let img of images) {
            if (!img.complete || img.naturalWidth === 0) {
                loaded = false;
            }
        }
        if (!loaded) {
            log.debug("Delaying carousel setup until images have loaded.");
            await utils.timeout(50);
            this.setup(el, settings);
            return;
        }
        const $carousel = $(el).slick(settings);
        let $panel_links = $();

        $carousel
            .children()
            .each((index, obj) => {
                if (!obj.id) {
                    return;
                }
                var $links = $("a[href=#" + obj.id + "]");
                // TODO: fix this.
                // eslint-disable-next-line no-undef
                if (index === control.currentPage) {
                    $links.addClass("current");
                } else {
                    $links.removeClass("current");
                }
                $links.on(
                    "click.pat-carousel",
                    null,
                    // TODO: fix this.
                    // eslint-disable-next-line no-undef
                    { control: control, index: index },
                    this.onPanelLinkClick.bind(this)
                );
                $panel_links = $panel_links.add($links);
            })
            .end()
            .on(
                "slide_complete.pat-carousel",
                null,
                $panel_links,
                this.onSlideComplete.bind(this)
            );
    },

    _loadPanelImages(slider, page) {
        let $img;
        log.info("Loading lazy images on panel " + page);
        slider.$items
            .eq(page)
            .find("img")
            .addBack()
            .filter("[data-src]")
            .each((idx, img) => {
                $img = $(img);
                this.src = $img.attr("data-src");
                $img.removeAttr("data-src");
            });
    },

    onPanelLinkClick: function (event) {
        event.data.control.gotoPage(event.data.index, false);
        event.preventDefault();
    },

    onInitialized: function (event, slider) {
        debugger;
        this._loadPanelImages(slider, slider.options.startPanel);
        this._loadPanelImages(slider, slider.options.startPanel + 1);
        this._loadPanelImages(slider, 0);
        this._loadPanelImages(slider, slider.pages + 1);
    },

    onSlideInit: function (event, slider) {
        debugger;
        this._loadPanelImages(slider, slider.targetPage);
    },

    onSlideComplete: function (event, slider) {
        var $panel_links = event.data;
        $panel_links.removeClass("current");
        if (slider.$targetPage[0].id)
            $panel_links
                .filter("[href=#" + slider.$targetPage[0].id + "]")
                .addClass("current");
        this._loadPanelImages(slider, slider.targetPage + 1);
    },
});
