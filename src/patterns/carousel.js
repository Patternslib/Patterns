/**
 * @license
 * Patterns @VERSION@ carousel
 *
 * Copyright 2012 Simplon B.V.
 */
define([
    "jquery",
    "../registry",
    "../logging",
    "../core/parser",
    "../3rdparty/jquery.anythingslider"
], function($, patterns, logging, Parser) {
    var log = logging.getLogger("carousel"),
        parser = new Parser();

    parser.add_argument("auto-play", true);
    parser.add_argument("loop", true);
    parser.add_argument("resize", false);
    parser.add_argument("expand", false);
    parser.add_argument("control-arrows", false);
    parser.add_argument("control-navigation", false);
    parser.add_argument("control-startstop", false);
    parser.add_argument("time-delay", 3000);
    parser.add_argument("time-animation", 600);

    var carousel = {
        name: "carousel",
        trigger: ".pt-carousel",

        init: function($el) {
            return $el.each(function() {
                var options = parser.parse(this.dataset.carousel),
                    settings = {hashTags: false};

                if (Array.isArray(options)) {
                    log.warn("Multiple options not supported for carousels.");
                    options = options[0];
                }

                settings.autoPlay = options["auto-play"];
                settings.stopAtEnd = !options.loop;
                settings.resizeContents = options.resize;
                settings.expand = options.expand;
                settings.buildArrows = options["control-arrows"];
                settings.buildNavigation = options["control-navigation"];
                settings.buildStartStop = options["control-startstop"];
                settings.delay = options["time-delay"];
                settings.animationTime = options["time-animation"];

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
                        $links.on("click.carousel", null, {control: control, index: index}, carousel.onPanelLinkClick);
                        $panel_links = $panel_links.add($links);
                    }).end()
                    .on("slide_complete.carousel", null, $panel_links, carousel.onSlideComplete);
            });
        },

        onPanelLinkClick: function(event) {
            event.data.control.gotoPage(event.data.index, false);
            event.preventDefault();
        },

        onSlideComplete: function(event, slider) {
            var $panel_links = event.data;
            $panel_links.removeClass("current");
            if (slider.$targetPage[0].id)
                $panel_links.filter("[href=#" + slider.$targetPage[0].id + "]").addClass("current");
        }
    };

    patterns.register(carousel);
    return carousel;  // XXX For testing only
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
