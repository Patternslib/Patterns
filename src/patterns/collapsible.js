/*
 * changes:
 * - open($el, opts) instead of open($el, duration)
 * - same for close
 */
define([
    'jquery',
    './inject',
    '../logging',
    '../core/parser',
    '../registry'
], function($, inject, logging, Parser, registry) {
    var log = logging.getLogger('collapsible'),
        parser = new Parser("collapsible");

    parser.add_argument("duration", 200);
    parser.add_argument("load-content");
    parser.add_argument("state", "open");

    var _ = {
        name: "collapsible",
        trigger: ".pat-collapsible",
        parser: parser,
        parse: function($el, opts) {
            var defaults = {
                state: $el.hasClass('closed') ? "closed" : "open"
            };
            var cfg = $.extend({}, defaults, _.parser.parse($el, opts));
            return cfg;
        },
        init: function($el, opts) {
            return $el.each(function() {
                // create collapsible structure
                var $el = $(this),
                    $ctrl = $el.children(':first'),
                    $content = $el.children(':gt(0)'),
                    $panel = $el.find('.panel-content');
                if ($panel.length === 0) {
                    if ($content.length > 0) {
                        $panel = $content.wrapAll('<div class="panel-content" />')
                            .parent();
                    } else {
                        $panel = $('<div class="panel-content" />').insertAfter($ctrl);
                    }
                }

                var cfg = _.parse($el, opts);

                if (cfg.closed)
                    _.close($el);
                else if (cfg.open)
                    _.open($el);

                // bind to click events
                $ctrl.on("click.pat-collapsible", function() {
                    _.toggle($el);
                });

                return $el;
            });
        },
        destroy: function($el) {
            var $ctrl = $el.children(':first');
            $ctrl.off('.pat-collapsible');
        },
        open: function($el, opts) {
            if ($el.hasClass('open'))
                return $el;

            var cfg = _.parser.parse($el, opts),
                $panel = $el.find('.panel-content');
            $el.removeClass('closed');
            if (cfg.duration)
                $el.addClass('opening');
            $el.content.show(cfg.duration, function() {
                $el.removeClass('opening');
                $el.addClass('open');
            });
            return $el;
        },
        close: function($el, opts) {
            var cfg = _.parser.parse($el, opts);
            if (cfg.closed)
                $panel = $el.find('.panel-content');
            $el.removeClass('open');
            if (cfg.duration)
                $el.addClass('closing');
            $el.content.show(cfg.duration, function() {
                $el.removeClass('closing');
                $el.addClass('close');
            });
            return $el;
        },
        toggle: function($el, opts) {
            opts = opts || {};
            var $panel = $el.find('.panel-content');
            if ($el.hasClass("closed")) {
                $el.trigger('patterns-collapsible-open');
                _._transit($el, $panel, "closed", "open", opts.duration);
            } else {
                $el.trigger('patterns-collapsible-close');
                _._transit($el, $panel, "open", "closed", opts.duration);
            }

            // allow for chaining
            return $el;
        },
        loadContent: function($el) {
            var cfg = _.parser.parse($el, opts);
            if (!cfg.loadContent)
                return;
            var components = cfg.loadContent.split('#'),
                url = components[0],
                id = components[1] ? '#' + components[1] : null,
                opts = [{
                    url: url,
                    source: id,
                    $targets: $('.panel-content', $el)
                }];
            inject.execute(opts);
        },
        _transit: function($el, $panel, from_cls, to_cls, duration) {
            duration = duration || 0; // Handle undefined/null durations
            if (to_cls === "open")
                _.loadContent($el);
            $el.removeClass(from_cls);
            if (duration)
                $el.addClass("in-progress");
            $panel.slideToggle(duration, function() {
                if (duration)
                    $el.removeClass("in-progress");
                $el.addClass(to_cls);
            });
        }
    };

    registry.register(_);
    return _;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
