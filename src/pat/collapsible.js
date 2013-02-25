/**
 * Patterns collapsible - Collapsible content
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012-2013 Simplon B.V. - Wichert Akkerman
 * Copyright 2012 Markus Maier
 * Copyright 2013 Peter Lamut
 * Copyright 2012 Jonas Hoersch
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
    parser.add_argument("duration", "0.4s");
    parser.add_argument("easing", "swing");
    parser.add_argument("closed", false);
    parser.add_argument("trigger", "::first");

    var _ = {
        name: "collapsible",
        trigger: ".pat-collapsible",
        jquery_plugin: true,

        init: function($el, opts) {
            return $el.each(function() {
                var $el = $(this),
                    options = _._validateOptions(this, parser.parse($el, opts)),
                // create collapsible structure
                    $content, state, storage;

                if (options.trigger === "::first") {
                    options.$trigger = $el.children(":first");
                    $content = $el.children(":gt(0)");
                } else {
                    options.$trigger = $(options.trigger);
                    $content = $el.children();
                }

                if (options.$trigger.length===0) {
                    log.error("Collapsible has no trigger.", this);
                    return;
                }

                if ($content.length)
                    options.$panel = $content.wrapAll("<div class='panel-content' />")
                        .parent();
                else
                    options.$panel = $("<div class='panel-content' />").insertAfter(options.$trigger);

                $el.data("patternCollapsible", options);
                state=(options.closed || $el.hasClass("closed")) ? "closed" : "open";
                if (options.store!=="none") {
                    storage=(options.store==="local" ? store.local : store.session)(_.name);
                    state=storage.get(this.id) || state;
                }

                if (state==="closed") {
                    options.$trigger.removeClass("collapsible-open").addClass("collapsible-closed");
                    $el.removeClass("open").addClass("closed");
                    options.$panel.hide();
                } else {
                    _.loadContent($el);
                    options.$trigger.removeClass("collapsible-closed").addClass("collapsible-open");
                    $el.removeClass("closed").addClass("open");
                    options.$panel.show();
                }

                options.$trigger
                    .off(".pat-collapsible")
                    .on("click.pat-collapsible", null, $el, _._onClick);

                return $el;
            });
        },

        _onClick: function(event) {
            _.toggle(event.data);
        },

        destroy: function($el) {
            $el.removeData("patternCollapsible");
            $el.children(":first").off(".pat-collapsible");
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
            var components = options.loadContent.split("#"),
                url = components[0],
                id = components[1] ? "#" + components[1] : null,
                opts = [{
                    url: url,
                    source: id,
                    $target: options.$panel,
                    dataType: "html"
                }];
            inject.execute(opts, $el);
        },

        toggle: function($el) {
            var options = $el.data("patternCollapsible"),
                new_state = $el.hasClass("closed") ? "open" : "closed";

            if (options.store!=="none") {
                var storage=(options.store==="local" ? store.local : store.session)(_.name);
                storage.set($el.attr("id"), new_state);
            }

            if (new_state==="open") {
                $el.trigger("patterns-collapsible-open");
                _._transit($el, "closed", "open", options);
            } else {
                $el.trigger("patterns-collapsible-close");
                _._transit($el, "open", "closed", options);
            }

            // allow for chaining
            return $el;
        },

        _transit: function($el, from_cls, to_cls, options) {
            if (to_cls === "open")
                _.loadContent($el);
            if (options.duration) {
                $el.addClass("in-progress");
                options.$trigger.addClass("collapsible-in-progress");
            }

            options.$panel.slideToggle(options.duration, options.easing, function() {
                options.$trigger
                        .removeClass("collapsible-" + from_cls)
                        .removeClass("collapsible-in-progress")
                        .addClass("collapsible-" + to_cls);
                $el
                    .removeClass(from_cls)
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
