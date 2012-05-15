define([
    'require',
    '../../lib/chosen.jquery',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('breadcrumbs');

    var init = function($el, opts) {
        // wrap elements in a DIV that will be shifted around
        var $content = $el.children()
                .wrapAll('<div class="breadcrumbs-content"></div>').parent();

        // set fixed width on content
        var width = $content.children().toArray().reduce(function(acc, el) {
            return acc + $(el).outerWidth(true);
        }, 0);
        $content.width(width);

        // shift ctrl
        var $ctrl = $('<span class="button shift">shift</span>')
                .prependTo($el);

        var shifted = false,
            shifting = false,
            difference = 0;
        var shifter = function(toggle) {
            return function() {
                var margin;
                if (toggle) {
                    margin = shifted ? 0 : difference;
                    $content.animate({"margin-left": margin}, function() {
                        $ctrl.toggleClass('shift-right shift-left');
                        shifted = !shifted;
                    });
                } else {
                    margin = shifted ? difference : 0;
                    $content.css({"margin-left": margin});
                }
            };
        };

        var maybeshift = function() {
            // account for other stuff on the same line (100px)
            difference = $el.innerWidth() - $content.width() - 100;

            if (difference < 0) {
                // we should be shifting
                if (!shifting) {
                    shifting = true;
                    $el.addClass('shifting');
                    $ctrl.removeClass('shift-right');
                    $ctrl.addClass('shift-left');
                    $ctrl.on('click.breadcrumbs', shifter(true));
                    $ctrl.click();
                } else {
                    // a shifter that keeps state
                    shifter(false)();
                }
            } else {
                // we should not be shifting
                if (shifting) {
                    $content.animate({"margin-left": 0}, function() {
                        shifted = false;
                        shifting = false;
                        $el.removeClass('shifting');
                        $ctrl.removeClass('shift-left shift-right');
                        $ctrl.off('.breadcrumbs');
                    });
                }
            }
        };
        maybeshift();
        $(window).on('resize.breadcrumbs', maybeshift);
    };

    var pattern = {
        markup_trigger: 'nav.breadcrumbs',
        init: init
    };
    return pattern;
});