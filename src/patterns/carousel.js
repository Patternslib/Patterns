/**
 * @license
 * Patterns @VERSION@ carousel
 *
 * Copyright 2012 Simplon B.V.
 */
define([
    "jquery",
    "../logging",
    "../core/parser",
    "../3rdparty/jquery.anythingslider"
], function($, logging, Parser) {
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
        markup_trigger: ".pt-carousel",

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
                    control = $carousel.data("AnythingSlider");

                $carousel.children().each(function(index, el) {
                    if (!this.id)
                        return;
                    $("a[href=#" + this.id+"]").on("click.carousel", function(event) {
                        control.gotoPage(index, false);
                        event.preventDefault();
                    });
                });

            });
        }
    };

    return carousel;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
