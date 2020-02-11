/**
 * Patterns carousel
 *
 * Copyright 2017 Syslab.com GmbH Alexander Pilz
 */
define([
    "jquery",
    "pat-registry",
    "pat-logger",
    "pat-parser",
    "slick-carousel"
], function($, patterns, logger, Parser) {
    var log = logger.getLogger("pat.carousel"),
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

    var carousel = {
        name: "carousel",
        trigger: ".pat-carousel",

        init: function($el, opts) {
            return $el.each(function() {
                var $carousel = $(this),
                    options = parser.parse($carousel, opts),
                    settings = {};

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
                carousel.setup($carousel, settings);
            });
        },

        setup: function($el, settings) {
            var loaded = true,
                $images = $el.find("img"),
                img,
                i;
            for (i = 0; loaded && i < $images.length; i++) {
                img = $images[i];
                if (!img.complete || img.naturalWidth === 0) loaded = false;
            }
            if (!loaded) {
                log.debug("Delaying carousel setup until images have loaded.");
                setTimeout(function() {
                    carousel.setup($el, settings);
                }, 50);
                return;
            }
            var $carousel = $el.slick(settings),
                // control = $carousel.data("AnythingSlider"),
                $panel_links = $();

            $carousel
                .children()
                .each(function(index) {
                    if (!this.id) return;

                    var $links = $("a[href=#" + this.id + "]");
                    if (index === control.currentPage)
                        $links.addClass("current");
                    else $links.removeClass("current");
                    $links.on(
                        "click.pat-carousel",
                        null,
                        { control: control, index: index },
                        carousel.onPanelLinkClick
                    );
                    $panel_links = $panel_links.add($links);
                })
                .end()
                .on(
                    "slide_complete.pat-carousel",
                    null,
                    $panel_links,
                    carousel.onSlideComplete
                );
        },

        _loadPanelImages: function(slider, page) {
            var $img;
            log.info("Loading lazy images on panel " + page);
            slider.$items
                .eq(page)
                .find("img")
                .addBack()
                .filter("[data-src]")
                .each(function() {
                    $img = $(this);
                    this.src = $img.attr("data-src");
                    $img.removeAttr("data-src");
                });
        },

        onPanelLinkClick: function(event) {
            event.data.control.gotoPage(event.data.index, false);
            event.preventDefault();
        },

        onInitialized: function(event, slider) {
            carousel._loadPanelImages(slider, slider.options.startPanel);
            carousel._loadPanelImages(slider, slider.options.startPanel + 1);
            carousel._loadPanelImages(slider, 0);
            carousel._loadPanelImages(slider, slider.pages + 1);
        },

        onSlideInit: function(event, slider) {
            carousel._loadPanelImages(slider, slider.targetPage);
        },

        onSlideComplete: function(event, slider) {
            var $panel_links = event.data;
            $panel_links.removeClass("current");
            if (slider.$targetPage[0].id)
                $panel_links
                    .filter("[href=#" + slider.$targetPage[0].id + "]")
                    .addClass("current");
            carousel._loadPanelImages(slider, slider.targetPage + 1);
        }
    };

    patterns.register(carousel);
    return carousel; // XXX For testing only
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
