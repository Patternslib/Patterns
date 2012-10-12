/* Explicitly requiring jquery should work like this, but currently breaks
 * when using build.sh.
define([
        "jquery",
        "../logging",
        "../core/parser"],
function($, logging, Parser) {
*/
define([
        "../logging",
        "../core/parser"],
function(logging, Parser) {
    $ = jQuery;
    var log = logging.getLogger("switch"),
        parser = new Parser("switch");
    parser.add_argument("selector");
    parser.add_argument("remove");
    parser.add_argument("add");

    $.patterns = $.patterns || {};

    $.patterns["switch"] = {
        go: function($trigger) {
            var options = $trigger.data("patternSwitch");
            if (!options) {
                log.error("onClick called for uninitialised element");
                return;
            }

            var option, i;
            for (i=0; i<options.length; i++) {
                option=options[i];
                $.patterns["switch"].update(option.selector, option.remove, option.add);
            }
        },

        onClick: function(e) {
            $.patterns["switch"].go($(this));
        },

        update: function(selector, remove, add) {
            var $targets = $(selector);

            if (!$targets.length)
                return;

            if (remove) {
                if (remove.indexOf('*')===-1) 
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
        },

        parse: function($trigger) {
            return parser.parse($trigger, true);
        },

        validateOptions: function(options) {
            var correct = [];

            for (var i=0; i<options.length; i++) {
                var option = options[i];
                if (option.selector && (option.remove || option.add))
                    correct.push(option);
                else
                    log.error('Switch pattern requires selector and one of add or remove.');
            }
            return correct.length ? correct : null;
        }
    };

    var methods = {
        init: function(defaults) {
            if (defaults && !Array.isArray(defaults))
                defaults = [defaults];

            return this.each(function() {
                var $trigger = $(this),
                    o = $trigger.data("patternSwitch");

                if (o)
                    return;

                var options = defaults || $.patterns["switch"].parse($trigger);
                options=$.patterns["switch"].validateOptions(options);
                if (options && options.length)
                    $trigger
                        .data("patternSwitch", options)
                        .on("click.patternSwitch", $.patterns["switch"].onClick);
            });
        },

        destroy: function() {
            return this.each(function() {
                $(this).removeData("patternSwitch").off("click.patternSwitch");
            });
        },

        "execute": function() {
            return this.each(function() {
                $.patterns["switch"].go($(this));
            });
        }
    };

    $.fn.patternSwitch = function(method) {
        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method ==="object" || !method)
            return methods.init.apply(this, arguments);
        else
            $.error("Method " + method + " does not exist on jQuery.patternSwitch");
    };

    return $.patterns["switch"];
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 sts=4 expandtab
