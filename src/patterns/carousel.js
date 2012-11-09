/**
 * @license
 * Patterns @VERSION@ carousel
 *
 * Copyright 2012 Simplon B.V.
 */
define([
    "jquery",
    "../registry",
    "../core/logging",
    "../core/parser",
    "jquery_anythingslider"
], function($, patterns, logging, Parser) {
    var log = logging.getLogger("carousel"),
        parser = new Parser("carousel");

    parser.add_argument("auto-play", false);
    parser.add_argument("loop", true);
    parser.add_argument("resize", false);
    parser.add_argument("expand", false);
    parser.add_argument("control-arrows", true);
    parser.add_argument("control-navigation", false);
    parser.add_argument("control-startstop", false);
    parser.add_argument("time-delay", 3000);
    parser.add_argument("time-animation", 600);

    var carousel = {
        name: "carousel",
        trigger: ".pat-carousel",

        init: function($el, opts) {
            return $el.each(function() {
                var options = parser.parse($(this), opts),
                    settings = {hashTags: false};

                settings.autoPlay = options.autoPlay;
                settings.stopAtEnd = !options.loop;
                settings.resizeContents = options.resize;
                settings.expand = options.expand;
                settings.buildArrows = options.controlArrows;
                settings.buildNavigation = options.controlNavigation;
                settings.buildStartStop = options.controlStartstop;
                settings.delay = options.timeDelay;
                settings.animationTime = options.timeAnimation;
                settings.onInitialized = carousel.onInitialized;
                settings.onSlideInit = carousel.onSlideInit;

                var $carousel = $(this).anythingSlider(settings),
                    control = $carousel.data("AnythingSlider"),
                    $panel_links = $();

                $carousel
                    .children().each(function(index, el) {
                        if (!this.id)
                            return;

                        var $links = $("a[href=#" + this.id+"]");
                        if (index===control.currentPage)
                            $links.addClass("current");
                        else
                            $links.removeClass("current");
                        $links.on("click.pat-carousel", null, {control: control, index: index}, carousel.onPanelLinkClick);
                        $panel_links = $panel_links.add($links);
                    }).end()
                    .on("slide_complete.pat-carousel", null, $panel_links, carousel.onSlideComplete);
            });
        },

        _loadPanelImages: function(slider, page) {
            var $img;
            log.info("Loading lazy images on panel " + page);
            slider.$items.eq(page).find("img").andSelf().filter("[data-src]").each(function() {
                $img=$(this);
                this.src=$img.attr("data-src");
                $img.removeAttr("data-src");
            });
        },

        onPanelLinkClick: function(event) {
            event.data.control.gotoPage(event.data.index, false);
            event.preventDefault();
        },

        onInitialized: function(event, slider) {
            carousel._loadPanelImages(slider, slider.options.startPanel);
            carousel._loadPanelImages(slider, slider.options.startPanel+1);
            carousel._loadPanelImages(slider, 0);
            carousel._loadPanelImages(slider, slider.pages+1);
        },

        onSlideInit: function(event, slider) {
            carousel._loadPanelImages(slider, slider.targetPage);
        },

        onSlideComplete: function(event, slider) {
            var $panel_links = event.data;
            $panel_links.removeClass("current");
            if (slider.$targetPage[0].id)
                $panel_links.filter("[href=#" + slider.$targetPage[0].id + "]").addClass("current");
            carousel._loadPanelImages(slider, slider.targetPage+1);
        }
    };

    patterns.register(carousel);
    return carousel;  // XXX For testing only
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
