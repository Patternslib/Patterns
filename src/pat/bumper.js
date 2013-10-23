/**
 * Patterns bumper - `bumper' handling for elements
 *
 * Copyright 2013 Florian Friesdorf
 * Copyright 2012 Humberto Sermeno
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../core/parser",
    "../registry"
], function($, Parser, registry) {
    var parser = new Parser("bumper");

    parser.add_argument("margin", 0);
    parser.add_argument("selector");
    parser.add_argument("bump-add", "bumped");
    parser.add_argument("bump-remove");
    parser.add_argument("unbump-add");
    parser.add_argument("unbump-remove", "bumped");

    var _ = {
        name: "bumper",
        trigger: ".pat-bumper",

        init: function($el, opts) {
            $el.each(function() {
                var $trigger = $(this),
                    options = parser.parse($trigger, opts);
                $trigger.data("pat-bumper.config", options);
            });

            $(window).on("scroll.bumper", function() {
                _._testBump($el, _._getViewport());
            });

            _._testBump($el, _._getViewport());
            return $el;
        },
        
        /**
         * Calculates the bounding box for the current viewport
         */
        _getViewport: function() {
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
        _getElementBox: function($elem) {
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
        _testBump: function($el, box) {
            // initialize the elements
            $el.each(function() {
                var $this = $(this),
                    options = $this.data("pat-bumper.config"),
                    $target = options.selector ? $(options.selector) : $this,
                    bumped = false,
                    data;

                // get current ElementBox while not bumped, otherwise used
                // saved state before bumping
                if ($target.hasClass("bumped")) {
                    data = $this.data("patterns.bumper");
                } else {
                    data = _._getElementBox($this);
                    data.threshold = {
                        top:    data.top - options.margin,
                        bottom: data.bottom + options.margin,
                        left:   data.left - options.margin,
                        right:  data.right + options.margin
                    };
                    data.margin = options.margin;
                    $this.data("patterns.bumper", data);
                }

                if (box.top > data.threshold.top) {
                    $target.addClass("bumped-top").removeClass("bumped-bottom");
                    bumped = true;
                } else if (box.bottom < data.threshold.bottom) {
                    $target.addClass("bumped-bottom").removeClass("bumped-top");
                    bumped = true;
                } else {
                    $target.removeClass("bumped-top bumped-bottom");
                }
                
                if (box.left > data.threshold.left) {
                    $target.addClass("bumped-left").removeClass("bumped-right");
                    bumped = true;
                } else if (box.right < data.threshold.right) {
                    $target.addClass("bumped-right").removeClass("bumped-left");
                    bumped = true;
                } else {
                    $target.removeClass("bumped-left bumped-right");
                }
                
                if (bumped) {
                    $target.addClass("bumped");
                } else {
                    $target.removeClass("bumped");
                }
            });
        }
    };
    registry.register(_);
    return _;
});

// vim: sw=4 expandtab
