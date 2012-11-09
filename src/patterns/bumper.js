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
                    top = $this.offset().top - parseFloat($this.css('marginTop').replace(/auto/, 0));

                $this.data('patterns.bumper', {'top': top, 'margin': opts.margin, 'threshold': top - opts.margin});
            });

            $(window).scroll(function() {
                _._testBump($el, $(this).scrollTop());
            });

            _._testBump($el, $(window).scrollTop());
        },

        _testBump: function($el, y) {
            $el.each(function() {
                var $this = $(this), top = $this.data('patterns.bumper').threshold;
                if (y > top) {
                    $this.addClass('bumped');
                } else {
                    $this.removeClass('bumped');
                }
            });
        }
    }
    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
