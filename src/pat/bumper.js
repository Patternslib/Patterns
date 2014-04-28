/**
 * Patterns bumper - `bumper' handling for elements
 *
 * Copyright 2013 Florian Friesdorf
 * Copyright 2012 Humberto Sermeno
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "pat-parser",
    "pat-registry",
    "pat-utils"
], function($, Parser, registry, utils) {
    var parser = new Parser("bumper");

    parser.add_argument("margin", 0);
    parser.add_argument("selector");
    parser.add_argument("bump-add", "bumped");
    parser.add_argument("bump-remove");
    parser.add_argument("unbump-add");
    parser.add_argument("unbump-remove", "bumped");

    var bumper = {
        name: "bumper",
        trigger: ".pat-bumper",

        init: function bumper_init($el, opts) {
            $el.each(function() {
                var $trigger = $(this),
                    options = parser.parse($trigger, opts);
                $trigger.data("pat-bumper:config", options);
            });

            $(window).on("scroll.bumper", function bumper_onScroll() {
                bumper._testBump($el, bumper._getViewport());
            });

            bumper._testBump($el, bumper._getViewport());
            return $el;
        },
        
        /**
         * Calculates the bounding box for the current viewport
         */
        _getViewport: function bumper_getViewport() {
            var $win = $(window), view = {
                top: $win.scrollTop(),
                left: $win.scrollLeft()
            };
            
            view.right = view.left + $win.width();
            view.bottom = view.top + $win.height();
            return view;
        },
        
        /**
         * Calculates the bounding box for a given element, taking margins
         * into consideration
         *
         * @param $elem The element
         */
        _getElementBox: function bumper_getElementBox($elem) {
            var box = $elem.offset();
            
            box.top -= parseFloat($elem.css("marginTop").replace(/auto/, 0));
            box.left -= parseFloat($elem.css("marginLeft").replace(/auto/, 0));
            box.right = box.left + $elem.outerWidth(true);
            box.bottom = box.top + $elem.outerHeight(true);
            
            return box;
        },

        /**
         * Determines whether an element should be bumped
         *
         * @param $el  The element to look for
         * @param box The bounding box in which the element will be bumped
         */
        _testBump: function bumper_testBump($el, box) {
            // initialize the elements
            $el.each(function bumper_testBump_each() {
                var $this = $(this),
                    options = $this.data("pat-bumper:config"),
                    $target = options.selector ? $(options.selector) : $this,
                    already_bumped = !!$this.data("pat-bumper:bumped"),
                    must_bump = false,
                    element_box = $this.data("pat-bumper:elementbox");

                // get current ElementBox while not bumped, otherwise used
                // saved state before bumping
                if (!element_box) {
                    element_box = bumper._getElementBox($this);
                    element_box.threshold = {
                        top:    element_box.top - options.margin,
                        bottom: element_box.bottom + options.margin,
                        left:   element_box.left - options.margin,
                        right:  element_box.right + options.margin
                    };
                    element_box.margin = options.margin;
                    $this.data("pat-bumper:elementbox", element_box);
                }

                if (box.top > element_box.threshold.top) {
                    $target.addClass("bumped-top").removeClass("bumped-bottom");
                    must_bump = true;
                } else if (box.bottom < element_box.threshold.bottom) {
                    $target.addClass("bumped-bottom").removeClass("bumped-top");
                    must_bump = true;
                } else
                    $target.removeClass("bumped-top bumped-bottom");

                if (box.left > element_box.threshold.left) {
                    $target.addClass("bumped-left").removeClass("bumped-right");
                    must_bump = true;
                } else if (box.right < element_box.threshold.right) {
                    $target.addClass("bumped-right").removeClass("bumped-left");
                    must_bump = true;
                } else
                    $target.removeClass("bumped-left bumped-right");

                $this.data("pat-bumper:bumped", must_bump);
                if (!already_bumped && must_bump) {
                    $target.addClass("bumped");
                    if (options.bump.add)
                        $target.addClass(options.bump.add);
                    if (options.bump.remove)
                        utils.removeWildcardClass($target, options.bump.remove);
                } else if (already_bumped && !must_bump) {
                    $target.removeClass("bumped");
                    if (options.unbump.add)
                        $target.addClass(options.unbump.add);
                    if (options.unbump.remove)
                        utils.removeWildcardClass($target, options.unbump.remove);
                }
            });
        }
    };
    registry.register(bumper);
    return bumper;
});

// vim: sw=4 expandtab
