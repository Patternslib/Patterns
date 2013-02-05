/**
 * Patterns autosubmit - automatic submission of forms
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012 Simplon B.V. - Simplon B.V. - Wichert Akkerman
 * Copyright 2013 Marko Durkovic
 */
define([
    "jquery",
    "../registry",
    "../core/logger",
    "../core/parser",
    "../utils"
], function($, registry, logging, Parser, utils) {
    var log = logging.getLogger("autosubmit"),
        parser = new Parser("autosubmit");

    // XXX: would be great if the parser would handle validation and
    // interpretation of boolean values:
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
                if (cfg.delay !== 'defocus') {
                    cfg.delay = parseInt(cfg.delay.replace(/[^\d]*/g, ""), 10);
                }
                return cfg;
            }
        },
        init: function($el, opts) {
            if ($el.length > 1)
                return $el.each(function() { _.init($(this), opts); });

            var $form = $el.is("form") ? $el : $el.parents("form").first();

            $form.off('.pat-autosubmit')
                .on('form-change.pat-autosubmit', _.onFormChange);

            var cfg = _.parser.parse($el, opts),
                isText = $el.is("input:text, input[type=search], textarea");

            // XXX: form-state pattern
            if (cfg.delay === "defocus" || cfg.delay === 0) {
                if (isText && cfg.delay === 0) {
                    $el.on("keyup.pat-autosubmit", function() { $el.trigger("form-change"); });
                } else {
                    $el.on("change.pat-autosubmit", function() { $el.trigger("form-change"); });
                }
            } else {
                if (isText) {
                    $el.on("keyup.pat-autosubmit change.pat-autosubmit", utils.debounce(function() {
                        $el.trigger("form-change");
                    }, cfg.delay));
                } else {
                    $el.on("change.pat-autosubmit", utils.debounce(function() {
                        $el.trigger("form-change");
                    }, cfg.delay));
                }
            }

            // fix browser bug: trigger change on search reset
            // also form-state pattern or even more generic browser fixes
            $form.on('click', 'input[type=search]', function(ev) {
                var $el = $(ev.target);
                // clicking X on type=search deletes data attrs,
                // therefore we store the old value on the form.
                var name = $el.attr('name'),
                    key = name + '-autosubmit-oldvalue',
                    oldvalue = $form.data(key) || "",
                    curvalue = $el[0].value || "";

                if (!name) {
                    log.warn('type=search without name, will be a problem' +
                             ' if there are multiple', $el);
                }
                if (oldvalue !== curvalue) {
                    $el.trigger('form-change');
                }

                $form.data(key, curvalue);
            });

            return $el;
        },

        destroy: function($el) {
            $el.off(".pat-autosubmit")
                .find(":input").off(".pat-autosubmit");
        },

        onFormChange: function(ev) {
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
