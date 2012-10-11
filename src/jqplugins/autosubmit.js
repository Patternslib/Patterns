define([
        "jquery",
        "../logging",
        "../core/parser",
        "../utils"
        ],
function($, logging, Parser, utils) {
    var log = logging.getLogger("autosubmit"),
        parser = new Parser("autosubmit");
    parser.add_argument("delay");

    $.patterns = $.patterns || {};

    $.patterns.autosubmit = {
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
        }
    };

    var methods = {
        init: function(defaults) {
            defaults = defaults || {};
            return this.each(function() {
                var $trigger = $(this),
                    options = $.extend({}, $.patterns.autosubmit.parse($trigger), defaults);
                options=$.patterns.autosubmit.validateOptions(options);
                if (!options)
                    return;

                var func = $.patterns.autosubmit.onChange;
                if (options.delay)
                    func=utils.debounce(func, options.delay);
                $trigger
                    .data("patternAutosubmit", options)
                    .off(".patternAutosubmit")
                    .on("change.patternAutosubmit", func)
                    .on("keyup.patternAutosubmit", "input:not([type=file],[type=checkbox],[type=radio],[type=hidden],[type=image],[type=password],[type=submit])", func);
            });
        },

        destroy: function() {
            return this.each(function() {
                $(this).removeData("patternAutosubmit").off(".patternAutosubmit");
            });
        }
    };

    $.fn.patternAutosubmit = function(method) {
        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method ==="object" || !method)
            return methods.init.apply(this, arguments);
        else
            $.error("Method " + method + " does not exist on jQuery.patternAutosubmit");
    };

    return $.patterns.autosubmit;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 sts=4 expandtab
