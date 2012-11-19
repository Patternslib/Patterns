/*
 * changes:
 * - open($el, opts) instead of open($el, duration)
 * - same for close
 */
define([
    "jquery",
    "./inject",
    "../core/logger",
    "../core/parser",
    "../core/store",
    "../registry"
], function($, inject, logger, Parser, store, registry) {
    var log = logger.getLogger("pat.collapsible"),
        parser = new Parser("collapsible");

    parser.add_argument("load-content");
    parser.add_argument("store", "none", ["none", "session", "local"]);
    parser.add_argument("duration", "fast");
    parser.add_argument("easing", "linear");
    parser.add_argument("closed", false);

    var _ = {
        name: "collapsible",
        trigger: ".pat-collapsible",

        init: function($el, opts) {
            return $el.each(function() {
                var $el = $(this),
                    options = _._validateOptions(this, parser.parse($el, opts)),
                // create collapsible structure
                    $trigger = $el.children(':first'),
                    $content = $el.children(':gt(0)'),
                    $panel, state;
                if ($content.length > 0)
                    $panel = $content.wrapAll('<div class="panel-content" />')
                        .parent();
                else
                    $panel = $('<div class="panel-content" />').insertAfter($trigger);

                $el.data("patternCollapsible", options);
                state=(options.closed || $el.hasClass("closed")) ? "closed" : "open";
                if (options.store!=="none") {
                    storage=(options.store==="local" ? store.local : store.session)(_.name);
                    state=storage.get(this.id) || state;
                }

                if (state==="closed") {
                    $el.removeClass("open").addClass("closed");
                    $panel.hide();
                } else {
                    _.loadContent($el);
                    $el.addClass("open");
                    $panel.show();
                }

                $trigger
                    .off(".pat-collapsible")
                    .on("click.pat-collapsible", null, $el, _._onClick);

                return $el;
            });
        },

        _onClick: function(event) {
            // XXX: hack to ignore clicks on a tooltip in our trigger element
            if ($(event.target).attr("data-tooltip") === undefined) {
                _.toggle(event.data);
            }
        },

        destroy: function($el) {
            $el.removeData("patternCollapsible");
            $el.children(":first").off('.pat-collapsible');
        },

        open: function($el) {
            if (!$el.hasClass("open"))
                _.toggle($el);
            return $el;
        },

        close: function($el) {
            if (!$el.hasClass("closed"))
                _.toggle($el);
            return $el;
        },

        _validateOptions: function(trigger, options) {
            if (options.store!=="none") {
                if (!trigger.id) {
                    log.warn("state persistance requested, but element has no id");
                    options.store="none";
                } else if (!store.supported) {
                    log.warn("state persistance requested, but browser does not support webstorage");
                    options.store="none";
                }
            }
            return options;
        },

        loadContent: function($el) {
            var options = $el.data("patternCollapsible");
            if (!options.loadContent)
                return;
            var components = options.loadContent.split('#'),
                url = components[0],
                id = components[1] ? '#' + components[1] : null,
                opts = [{
                    url: url,
                    source: id,
                    $target: $('.panel-content', $el)
                }];
            inject.execute(opts, $el);
        },

        toggle: function($el) {
            var options = $el.data("patternCollapsible"),
                $panel = $el.find('.panel-content'),
                new_state = $el.hasClass("closed") ? "open" : "closed";

            if (options.store!=="none") {
                var storage=(options.store==="local" ? store.local : store.session)(_.name);
                storage.set($el.attr("id"), new_state);
            }

            if (new_state==="open") {
                $el.trigger('patterns-collapsible-open');
                _._transit($el, $panel, "closed", "open", options);
            } else {
                $el.trigger('patterns-collapsible-close');
                _._transit($el, $panel, "open", "closed", options);
            }

            // allow for chaining
            return $el;
        },

        _transit: function($el, $panel, from_cls, to_cls, options) {
            if (to_cls === "open")
                _.loadContent($el);
            $el.removeClass(from_cls);
            if (options.duration)
                $el.addClass("in-progress");
            $panel.slideToggle(options.duration, options.easing, function() {
                $el
                    .removeClass("in-progress")
                    .addClass(to_cls);
            });
        }
    };

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
