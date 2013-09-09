define([
    "jquery",
    "../registry",
    "../core/logger",
    "../core/parser"
], function($, patterns, logger, Parser) {
    var log = logger.getLogger("pat.switch"),
        parser = new Parser("switch");
    parser.add_argument("selector");
    parser.add_argument("remove");
    parser.add_argument("add");

    var switcher = {
        name: "switch",
        trigger: ".pat-switch",
        jquery_plugin: true,

        init: function($el, defaults) {
            return $el.each(function() {
                var $trigger = $(this),
                    options = parser.parse($trigger, defaults, true);
                options=switcher._validateOptions(options);
                if (options && options.length)
                    $trigger
                        .data("patternSwitch", options)
                        .off(".patternSwitch")
                        .on("click.patternSwitch", switcher._onClick);
            });
        },

        destroy: function($el) {
            return $el.each(function() {
                $(this).removeData("patternSwitch").off("click.patternSwitch");
            });
        },

        execute: function($el) {
            return $el.each(function() {
                switcher._go($(this));
            });
        },

        _onClick: function(ev) {
            if ($(ev.target).is('a')) {
                ev.preventDefault();
            }
            switcher._go($(this));
        },

        _go: function($trigger) {
            var options = $trigger.data("patternSwitch"),
                option, i;
            if (!options) {
                log.error("Tried to execute a switch for an uninitialised element.");
                return;
            }
            for (i=0; i<options.length; i++) {
                option=options[i];
                switcher._update(option.selector, option.remove, option.add);
            }
        },

        _validateOptions: function(options) {
            var correct = [];

            for (var i=0; i<options.length; i++) {
                var option = options[i];
                if (option.selector && (option.remove || option.add))
                    correct.push(option);
                else
                    log.error("Switch pattern requires selector and one of add or remove.");
            }
            return correct.length ? correct : null;
        },

        _update: function(selector, remove, add) {
            var $targets = $(selector);

            if (!$targets.length)
                return;

            if (remove) {
                if (remove.indexOf("*")===-1)
                    $targets.removeClass(remove);
                else {
                    remove = remove.replace(/[\-\[\]{}()+?.,\\\^$|#\s]/g, "\\$&");
                    remove = remove.replace(/[*]/g, ".*");
                    remove = new RegExp("^" + remove + "$");
                    $targets.filter("[class]").each(function() {
                        var $this = $(this),
                            classes = $this.attr("class").split(/\s+/),
                            ok=[];
                        for (var i=0; i<classes.length; i++)
                            if (!remove.test(classes[i]))
                                ok.push(classes[i]);
                        if (ok.length)
                            $this.attr("class", ok.join(" "));
                        else
                            $this.removeAttr("class");
                    });
                }
            }
            if (add)
                $targets.addClass(add);
            $targets.trigger("pat-update", {pattern: "switch"});
        }
    };

    patterns.register(switcher);
    return switcher;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 sts=4 expandtab
