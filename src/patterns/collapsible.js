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

    parser.add_argument("load-content");

    var _ = {
        name: "collapsible",
        trigger: ".pat-collapsible",
        init: function($el, opts) {
            $el.each(function() {
                _._init($(this), opts);
            });
            return $el;
        },
        parser: parser,
        _init: function($el, opts) {
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

            var cfg = _.parser.parse($el, opts);
            $el.data('patterns.collapsible', cfg);

            // set initial state
            if ((opts && opts.closed) || $el.hasClass("closed")) {
                $el.removeClass("closed");
                _.close($el, {duration: 0});
            } else {
                $el.addClass("open");
            }

            // bind to click events
            $ctrl.on("click.pat-collapsible", function() {
                _.toggle($el, "fast");
            });

            return $el;
        },
        destroy: function($el) {
            var $ctrl = $el.children(':first');
            $ctrl.off('.pat-collapsible');
        },
        open: function($el, opts) {
            opts = opts || {};
            if ($el.hasClass("open"))
                return null;

            _.toggle($el, opts.duration);

            // allow for chaining
            return $el;
        },
        loadContent: function($el) {
            var cfg = $el.data('patterns.collapsible');
            if (!cfg['load-content'])
                return;
            var components = cfg['load-content'].split('#'),
                url = components[0],
                id = components[1] ? '#' + components[1] : null,
                opts = [{
                    url: url,
                    source: id,
                    $targets: $('.panel-content', $el)
                }];
            inject.execute(opts);
        },
        close: function($el, opts) {
            opts = opts || {};
            if ($el.hasClass("closed")) return null;
            _.toggle($el, opts);

            // allow for chaining
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

    return registry.register(_);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
