/**
 * Patterns autosubmit - automatic submission of forms
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012 Simplon B.V. - Wichert Akkerman
 * Copyright 2013 Marko Durkovic
 */
define([
    "jquery",
    "pat-registry",
    "pat-logger",
    "pat-parser",
    "pat-input-change-events",
    "pat-utils"
], function($, registry, logging, Parser, input_change_events, utils) {
    var log = logging.getLogger("autosubmit"),
        parser = new Parser("autosubmit");

    // - 400ms -> 400
    // - 400 -> 400
    // - defocus
    parser.add_argument("delay", "400ms");

    var _ = {
        name: "autosubmit",
        trigger: ".pat-autosubmit :input",
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
            if ($el.length > 1)
                return $el.each(function() { _.init($(this), opts); });

            // handle the form itself
            if ($el.is("form,.pat-subform")) {
                if ($el.data("pat-autosubmit-initialized")) {
                    return $el;
                }
                input_change_events.setup($el, "autosubmit");
                $el.on("input-change-delayed.pat-autosubmit", _.onInputChange)
                    .data("pat-autosubmit-initialized", true);
                return $el;
            }

            // make sure the form is initialized if it does not have the pat-autosubmit class
            var $form = $el.parents("form,.pat-subform").first();
            if (!$form.data("pat-autosubmit-initialized")) {
                _.init($form);
            }

            var cfg = _.parser.parse($el, opts),
                isText = $el.is("input:text, input[type=search], textarea");

            if (cfg.delay === "defocus" && !isText) {
                log.error("The defocus delay value makes only sense on text input elements.");
                return $el;
            }

            if (cfg.delay === "defocus") {
                $el.on("input-defocus.pat-autosubmit", function() {
                    $el.trigger("input-change-delayed");
                });
            } else if (cfg.delay > 0) {
                $el.on("input-change.pat-autosubmit", utils.debounce(function() {
                    $el.trigger("input-change-delayed");
                }, cfg.delay));
            } else {
                $el.on("input-change.pat-autosubmit", function() {
                    $el.trigger("input-change-delayed");
                });
            }
            return $el;
        },

        destroy: function($el) {
            input_change_events.remove($el, "autosubmit");
            $el.removeData("pat-autosubmit-initialized");
            $el.off(".pat-autosubmit")
                .find(":input").off(".pat-autosubmit");
        },

        onInputChange: function(ev) {
            ev.stopPropagation();

            $(this).submit();

            log.debug("triggered by " + ev.type);
        }
    };

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
