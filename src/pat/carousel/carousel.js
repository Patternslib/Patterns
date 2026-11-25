/**
 * Patterns carousel
 *
 * Copyright 2017 Syslab.com GmbH Alexander Pilz
 */
import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";

const log = logging.getLogger("pat.carousel");

export const parser = new Parser("carousel");
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
parser.addArgument("breakpoint1", "");
parser.addArgument("breakpoint2", "");
parser.addArgument("breakpoint1-slides-to-show", 1);
parser.addArgument("breakpoint2-slides-to-show", 1);

export default Base.extend({
    name: "carousel",
    trigger: ".pat-carousel",

    async init() {
        if (window.__patternslib_import_styles) {
            import("slick-carousel/slick/slick.scss");
        }
        await import("slick-carousel");
        const ImagesLoaded = (await import("imagesloaded")).default;

        this.options = parser.parse(this.el, this.options);
        this.settings = {
            autoplay: this.options.auto.play,
            autoplaySpeed: this.options.auto["play-speed"],
            speed: this.options.speed,
            adaptiveHeight: this.options.height === "adaptive",
            arrows: this.options.arrows === "show",
            slidesToShow: this.options.slides["to-show"],
            slidesToScroll: this.options.slides["to-scroll"],
            dots: this.options.dots === "show",
            infinite: this.options.infinite,
        };
        if (this.options.appendDots) {
            this.settings.appendDots = this.options.appendDots;
        }

        var responsive_options = [];
        if (this.options['breakpoint1']) {
            responsive_options.push({
                breakpoint: this.options['breakpoint1'],
                settings: {
                    slidesToShow: this.options['breakpoint1SlidesToShow']
                }
            });
        }
        if (this.options['breakpoint2']) {
            responsive_options.push({
                breakpoint: this.options['breakpoint2'],
                settings: {
                    slidesToShow: this.options['breakpoint2SlidesToShow']
                }
            });
        }
        this.settings.responsive = responsive_options;

        ImagesLoaded(this.el, () => this.setup());
    },

    setup() {
        const $carousel = $(this.el).slick(this.settings);
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
        this._loadPanelImages(slider, slider.options.startPanel);
        this._loadPanelImages(slider, slider.options.startPanel + 1);
        this._loadPanelImages(slider, 0);
        this._loadPanelImages(slider, slider.pages + 1);
    },

    onSlideInit: function (event, slider) {
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
