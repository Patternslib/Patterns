/**
 * Patterns autosubmit - automatic submission of forms
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012 Simplon B.V. - Wichert Akkerman
 * Copyright 2013 Marko Durkovic
 * Copyright 2014-2015 Syslab.com GmbH - JC Brand 
 */
define([
    "jquery",
    "pat-registry",
    "pat-base",
    "pat-logger",
    "pat-parser",
    "pat-input-change-events",
    "pat-utils"
], function($, registry, Base, logging, Parser, input_change_events, utils) {
    var log = logging.getLogger("autosubmit"),
        parser = new Parser("autosubmit");

    // - 400ms -> 400
    // - 400 -> 400
    // - defocus
    parser.addArgument("delay", "400ms");

    return Base.extend({
        name: "autosubmit",
        trigger: ".pat-autosubmit",
        parser: {
            parse: function($el, opts) {
                var cfg = parser.parse($el, opts);
                if (cfg.delay !== "defocus") {
                    cfg.delay = parseInt(cfg.delay.replace(/[^\d]*/g, ""), 10);
                }
                return cfg;
            }
        },

        init: function($el, opts) {
            input_change_events.setup($el, "autosubmit");
            this.$el.on("input-change-delayed.pat-autosubmit", this.onInputChange);
            this.options = this.parser.parse(this.$el, opts);
            this.registerHandlers();
            return this.$el;
        },

        registerHandlers: function() {
            var isText = this.$el.is("input:text, input[type=search], textarea");
            if (this.options.delay === "defocus" && !isText) {
                log.error("The defocus delay value makes only sense on text input elements.");
                return this.$el;
            }
            if (this.options.delay === "defocus") {
                this.$el.on("input-defocus.pat-autosubmit", function() {
                    $(this).trigger("input-change-delayed");
                });
            } else if (this.options.delay > 0) {
                this.$el.on("input-change.pat-autosubmit", utils.debounce(function() {
                    $(this).trigger("input-change-delayed");
                }, this.options.delay));
            } else {
                this.$el.on("input-change.pat-autosubmit", function() {
                    $(this).trigger("input-change-delayed");
                });
            }
        },

        destroy: function($el) {
            input_change_events.remove($el, "autosubmit");
            $el.removeData("pat-autosubmit-initialized");
            $el.off(".pat-autosubmit").find(":input").off(".pat-autosubmit");
        },

        onInputChange: function(ev) {
            ev.stopPropagation();
            $(this).submit();
            log.debug("triggered by " + ev.type);
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
