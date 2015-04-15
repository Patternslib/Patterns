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
    "pat-inject",
    "pat-logger",
    "pat-parser",
    "pat-store",
    "pat-registry",
    "pat-base",
    "pat-jquery-ext"
], function($, inject, logger, Parser, store, registry, Base) {
    var log = logger.getLogger("pat.collapsible"),
        parser = new Parser("collapsible");

    parser.add_argument("load-content");
    parser.add_argument("store", "none", ["none", "session", "local"]);
    parser.add_argument("transition", "slide", ["none", "css", "fade", "slide", "slide-horizontal"]);
    parser.add_argument("effect-duration", "fast");
    parser.add_argument("effect-easing", "swing");
    parser.add_argument("closed", false);
    parser.add_argument("trigger", "::first");

    return Base.extend({
        name: "collapsible",
        trigger: ".pat-collapsible",
        jquery_plugin: true,

        transitions: {
            none: {closed: "hide", open: "show"},
            fade: {closed: "fadeOut", open: "fadeIn"},
            slide: {closed: "slideUp", open: "slideDown"},
            "slide-horizontal": {closed: "slideOut", open: "slideIn"}
        },

        init: function($el, opts) {
            var $content, state, storage;
            this.options = store.updateOptions($el[0], parser.parse($el, opts));

            if (this.options.trigger === "::first") {
                this.$trigger = $el.children(":first");
                $content = $el.children(":gt(0)");
            } else {
                this.$trigger = $(this.options.trigger);
                $content = $el.children();
            }
            if (this.$trigger.length === 0) {
                log.error("Collapsible has no trigger.", $el[0]);
                return;
            }

            this.$panel = $el.find(".panel-content");
            if (this.$panel.length === 0) {
                if ($content.length) {
                    this.$panel = $content
                        .wrapAll("<div class='panel-content' />")
                        .parent();
                } else {
                    this.$panel = $("<div class='panel-content' />")
                        .insertAfter(this.$trigger);
                }
            }

            state=(this.options.closed || $el.hasClass("closed")) ? "closed" : "open";
            if (this.options.store!=="none") {
                storage=(this.options.store==="local" ? store.local : store.session)(this.name);
                state=storage.get($el.attr('id')) || state;
            }

            if (state==="closed") {
                this.$trigger.removeClass("collapsible-open").addClass("collapsible-closed");
                $el.removeClass("open").addClass("closed");
                this.$panel.hide();
            } else {
                if (this.options.loadContent)
                    this._loadContent($el, this.options.loadContent, this.$panel);
                this.$trigger.removeClass("collapsible-closed").addClass("collapsible-open");
                $el.removeClass("closed").addClass("open");
                this.$panel.show();
            }

            this.$trigger
                .off(".pat-collapsible")
                .on("click.pat-collapsible", null, $el, this._onClick.bind(this))
                .on("keypress.pat-collapsible", null, $el, this._onKeyPress.bind(this));
            return $el;
        },

        _onClick: function(event) {
            this.toggle(event.data);
        },

        _onKeyPress : function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13)
                this.toggle(event.data);
        },

        destroy: function($el) {
            $el.children(":first").off(".pat-collapsible");
        },

        open: function($el) {
            if (!$el.hasClass("open"))
                this.toggle($el);
            return $el;
        },

        close: function($el) {
            if (!$el.hasClass("closed"))
                this.toggle($el);
            return $el;
        },

        _validateOptions: function(trigger) {
            if (this.options.store!=="none") {
                if (!trigger.id) {
                    log.warn("state persistance requested, but element has no id");
                    this.options.store="none";
                } else if (!store.supported) {
                    log.warn("state persistance requested, but browser does not support webstorage");
                    this.options.store="none";
                }
            }
            return this.options;
        },

        _loadContent: function($el, url, $target) {
            var components = url.split("#"),
                base_url = components[0],
                id = components[1] ? "#" + components[1] : "body",
                opts = [{
                    url: base_url,
                    source: id,
                    $target: $target,
                    dataType: "html"
                }];
            inject.execute(opts, $el);
        },

        // jQuery method to force loading of content.
        loadContent: function($el) {
            return $el.each(function(idx, el) {
                if (this.options.loadContent)
                    this._loadContent($(el), this.options.loadContent, this.$panel);
            }.bind(this));
        },

        toggle: function($el) {
            var new_state = $el.hasClass("closed") ? "open" : "closed";
            if (this.options.store!=="none") {
                var storage=(this.options.store==="local" ? store.local : store.session)(this.name);
                storage.set($el.attr("id"), new_state);
            }

            if (new_state==="open") {
                $el.trigger("patterns-collapsible-open");
                this._transit($el, "closed", "open");
            } else {
                $el.trigger("patterns-collapsible-close");
                this._transit($el, "open", "closed");
            }

            // allow for chaining
            return $el;
        },

        _transit: function($el, from_cls, to_cls) {
            if (to_cls === "open" && this.options.loadContent)
                this._loadContent($el, this.options.loadContent, this.$panel);

            var duration = (this.options.transition==="css" || this.options.transition==="none") ? null : this.options.effect.duration;
            if (!duration) {
                this.$trigger
                        .removeClass("collapsible-" + from_cls)
                        .addClass("collapsible-" + to_cls);
                $el
                    .removeClass(from_cls)
                    .addClass(to_cls)
                    .trigger("pat-update",
                            {pattern: "collapsible",
                             transition: "complete"});
            } else {
                var t = this.transitions[this.options.transition];
                $el
                    .addClass("in-progress")
                    .trigger("pat-update",
                            {pattern: "collapsible",
                             transition: "start"});
                this.$trigger.addClass("collapsible-in-progress");
                this.$panel[t[to_cls]](duration, this.options.effect.easing, function() {
                    this.$trigger
                            .removeClass("collapsible-" + from_cls)
                            .removeClass("collapsible-in-progress")
                            .addClass("collapsible-" + to_cls);
                    $el
                        .removeClass(from_cls)
                        .removeClass("in-progress")
                        .addClass(to_cls)
                        .trigger("pat-update",
                            {pattern: "collapsible",
                             transition: "complete"});
                }.bind(this));
            }
        }
    });
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
