define([
    "jquery",
    "../registry",
    "../core/logging",
    "../core/parser",
    "../utils"
], function($, patterns, logging, Parser, utils) {
    var log = logging.getLogger("pat.autosubmit"),
        parser = new Parser("autosubmit");
    parser.add_argument("delay");

    var autosubmit = {
        name: "autosubmit",
        trigger: ".pat-autosubmit",

        parse: function($trigger) {
            var options = parser.parse($trigger);
            if (Array.isArray(options)) {
                log.error("autosubmit does not support multiple options");
                options = options[0];
            }
            return options;
        },

        validateOptions: function(options) {
            if (typeof options.delay==="string") {
                if (options.delay==="delay" || options.delay==="true")
                    options.delay=400;
                else {
                    var number = parseInt(options.delay, 10);
                    if (isNaN(number)) {
                        log.error("Invalid delay value");
                        return null;
                    }
                    options.delay=number;
                }
            } else if (typeof options.delay==="number") {
                if (options.delay<0) {
                    log.error("Timetravel machine broken - negative delay not possible.");
                    return null;
                }
            } else if (options.delay) {
                log.error("Invalid delay value");
                return null;
            }
            return options;
        },

        onChange: function(event) {
            var $trigger = $(this),
                $form = this.tagName==="FORM" ? $trigger : $trigger.closest("form");

            if ($trigger.hasClass("auto-suggest")) {
                log.debug("Ignored event from autosuggest field.");
                return;
            }

            if ($trigger.is("input[type=search]")) {
                // clicking X on type=search deletes data attrs,
                // therefore we store the old value on the form.
                var name = $victim.attr('name'),
                    key = name + '-autosubmit-oldvalue',
                    oldvalue = $form.data(key) || "",
                    curvalue = $target[0].value || "";

                if (!name)
                    log.warn('type=search without name, will be a problem' +
                             ' if there are multiple', $target);
                if (oldvalue===curvalue)
                    return;
                $form.data(key, curvalue);
            }

            log.info("triggered by " + event.type);
            $form.submit();
            event.stopPropagation();
        },

        init: function($root, defaults) {
            defaults = defaults || {};
            return $root
                .find("input[type-search]").andSelf()
                .each(function() {
                var $trigger = $(this),
                    options = $.extend({}, autosubmit.parse($trigger), defaults);
                options=autosubmit.validateOptions(options);
                if (!options)
                    return;

                var func = autosubmit.onChange;
                if (options.delay)
                    func=utils.debounce(func, options.delay);
                $trigger
                    .data("patternAutosubmit", options)
                    .off(".patternAutosubmit")
                    .on("change.patternAutosubmit", func)
                    .on("keyup.patternAutosubmit", "input:not([type=file],[type=checkbox],[type=radio],[type=hidden],[type=image],[type=password],[type=submit])", func);
            });
        },

        destroy: function($root) {
            return $root
                .find("input[type-search]").andSelf()
                .each(function() {
                          $(this).removeData("patternAutosubmit").off(".patternAutosubmit");
                      });
        }
    };

    patterns.register(autosubmit);
    return autosubmit;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
