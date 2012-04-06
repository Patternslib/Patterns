/*jslint regexp: true,
         browser: true,
         sloppy: true,
         white: true,
         plusplus: true,
         indent: 4,
         maxlen: 200 */
/*global define, $ */

define([
    'require',
    '../lib/jquery'
], function(require) {
    var init,
        open,
        close,
        toggle,
        transit,
        pattern;

    init = function($el, opts) {
        // create collapsible structure
        var $ctrl = $el.children(':first'),
            $panel = $el.children(':gt(0)')
                .wrapAll('<div class="panel-content" />')
                .parent();

        // set initial state
        if ((opts && opts.closed) || $el.hasClass("closed")) {
            $el.removeClass("closed");
            close($el, 0);
        } else {
            $el.addClass("open");
        }

        // bind to click events
        $ctrl.bind("click", function() { toggle($el, "fast"); });

        // allow for chaining
        return $el;
    };

    open = function($el, duration) {
        if ($el.hasClass("open")) {
            return;
        }
        toggle($el, duration);

        // allow for chaining
        return $el;
    };

    close = function($el, duration) {
        if ($el.hasClass("closed")) {
            return;
        }
        toggle($el, duration);

        // allow for chaining
        return $el;
    };

    transit = function($el, $panel, from_cls, to_cls, duration) {
        $el.removeClass(from_cls);
        if (duration) {
            $el.addClass("in-progress");
        }
        $panel.slideToggle(duration, function() {
            if (duration) {
                $el.removeClass("in-progress");
            }
            $el.addClass(to_cls);
        });
    };

    toggle = function($el, duration) {
        var $panel = $el.find('.panel-content');
        if ($el.hasClass("closed")) {
            transit($el, $panel, "closed", "open", duration);
        } else {
            transit($el, $panel, "open", "closed", duration);
        }

        // allow for chaining
        return $el;
    };

    pattern = {
        markup_trigger: ".collapsible",
        initialised_class: "collapsible",
        init: init,
        open: open,
        close: close,
        toggle: toggle
    };

    return pattern;
});
