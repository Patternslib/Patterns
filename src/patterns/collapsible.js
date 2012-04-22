define([
    'require',
    '../lib/jquery'
], function(require) {

    var init = function($el, opts) {
        // create collapsible structure
        var $ctrl = $el.children(':first'),
            $content = $el.children(':gt(0)'),
            $panel;
        if ($content.length > 0) {
            $panel = $content.wrapAll('<div class="panel-content" />')
                .parent();
        } else {
            $panel = $('<div class="panel-content" />').insertAfter($ctrl);
        }

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

    var open = function($el, duration) {
        if ($el.hasClass("open")) return;
        toggle($el, duration);

        // allow for chaining
        return $el;
    };

    var close = function($el, duration) {
        if ($el.hasClass("closed")) return;
        toggle($el, duration);

        // allow for chaining
        return $el;
    };

    var transit = function($el, $panel, from_cls, to_cls, duration) {
        $el.removeClass(from_cls);
        if (duration) $el.addClass("in-progress");
        $panel.slideToggle(duration, function() {
            if (duration) $el.removeClass("in-progress");
            $el.addClass(to_cls);
        });
    };

    var toggle = function($el, duration) {
        var $panel = $el.find('.panel-content');
        if ($el.hasClass("closed")) {
            transit($el, $panel, "closed", "open", duration);
        } else {
            transit($el, $panel, "open", "closed", duration);
        }

        // allow for chaining
        return $el;
    };

    var pattern = {
        markup_trigger: ".collapsible",
        initialised_class: "collapsible",
        init: init,
        open: open,
        close: close,
        toggle: toggle
    };

    return pattern;
});
