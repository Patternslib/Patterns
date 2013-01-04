define([
    "jquery",
    "../core/parser",
    "../registry"
], function($, Parser, registry) {
    var parser = new Parser("bumper");

    parser.add_argument("margin", 0);

    var _ = {
        name: "bumper",
        trigger: ".pat-bumper",

        init: function($el, options) {
            // initialize the elements
            $el.each(function() {
                var $this = $(this),
                    opts = parser.parse($this, options),
                    data = _._getElementBox($this);
                
                data.threshold = {
                    top:    data.top - opts.margin,
                    bottom: data.bottom + opts.margin,
                    left:   data.left - opts.margin,
                    right:  data.right + opts.margin
                };
                data.margin = opts.margin;
                
                $this.data("patterns.bumper", data);
            });

            $(window).scroll(function() {
                _._testBump($el, _._getViewport());
            });

            _._testBump($el, _._getViewport());
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
         * @param view The bounding box in which the element will be bumped
         */
        _testBump: function($el, box) {
            $el.each(function() {
                var $this = $(this),
                    data = $this.data("patterns.bumper"),
                    bumped = false;

                if (box.top > data.threshold.top) {
                    $this.addClass("bumped-top").removeClass("bumped-bottom");
                    bumped = true;
                } else if (box.bottom < data.threshold.bottom) {
                    $this.addClass("bumped-bottom").removeClass("bumped-top");
                    bumped = true;
                } else {
                    $this.removeClass("bumped-top bumped-bottom");
                }
                
                if (box.left > data.threshold.left) {
                    $this.addClass("bumped-left").removeClass("bumped-right");
                    bumped = true;
                } else if (box.right < data.threshold.right) {
                    $this.addClass("bumped-right").removeClass("bumped-left");
                    bumped = true;
                } else {
                    $this.removeClass("bumped-left bumped-right");
                }
                
                if (bumped) {
                    $this.addClass("bumped");
                } else {
                    $this.removeClass("bumped");
                }
            });
        }
    };
    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
