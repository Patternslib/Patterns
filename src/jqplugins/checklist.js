define([
        "jquery",
        "../logging",
        "../core/parser"
        ],
function($, logging, Parser) {
    var log = logging.getLogger("checklist"),
        parser = new Parser();
    parser.add_argument("select", ".functions .select-all");
    parser.add_argument("deselect", ".functions .deselect-all");

    $.patterns = $.patterns || {};

    $.patterns.checklist = {
        parse: function($trigger) {
            var options = parser.parse($trigger.data("checklist"));
            if (Array.isArray(options)) {
                log.error("checklist does not support multiple options");
                options = options[0];
            }
            return options;
        },

        onChange: function(event) {
            var $trigger = event.data.trigger,
                options = $trigger.data("patternChecklist"),
                deselect = $trigger.find(options.deselect),
                select = $trigger.find(options.select);

            if (($trigger.find('input[type=checkbox]:visible:checked').length===0) &&
                (!deselect.prop('disabled'))) {
                deselect.attr({disabled: 'disabled'});
            } else if (deselect.prop('disabled')) {
                deselect.prop('disabled', false);
            }

            if (($trigger.find('input[type=checkbox]:visible:not(:checked)').length===0) &&
                (!select.prop('disabled'))) {
                select.attr({disabled: 'disabled'});
            } else if (select.prop('disabled')) {
                select.prop('disabled', false);
            }
        },

        onSelectAll: function(event) {
            var $trigger = event.data.trigger,
                options = $trigger.data("patternChecklist");
            $trigger.find("input[type=checkbox]:not(:checked)").prop("checked", true);
            $trigger.find(options.deselect).prop("disabled", false);
            $trigger.find(options.select).attr({disabled: "disabled"});
            $trigger.change();
            event.preventDefault();
        },

        onDeselectAll: function(event) {
            var $trigger = event.data.trigger,
                options = $trigger.data("patternChecklist");
            $trigger.find("input[type=checkbox]:checked").prop("checked", false);
            $trigger.find(options.select).prop("disabled", false);
            $trigger.find(options.deselect).attr({disabled: "disabled"});
            $trigger.change();
            event.preventDefault();
        }
    };

    var methods = {
        init: function(defaults) {
            defaults = defaults || {};
            return this.each(function() {
                var $trigger = $(this),
                    options = $.extend({}, $.patterns.checklist.parse($trigger), defaults);

                $trigger.data("patternChecklist", options);
                $trigger.find(options.select)
                    .on("click.checklist", {trigger: $trigger}, $.patterns.checklist.onSelectAll);
                $trigger.find(options.deselect)
                    .on("click.checklist", {trigger: $trigger}, $.patterns.checklist.onDeselectAll);
                $trigger.on("change.checklist", "input[type=checkbox]", {trigger: $trigger}, $.patterns.checklist.onChange);
            });
        },

        destroy: function() {
            return this.each(function() {
                var $trigger = $(this),
                    options = $trigger.data("patternChecklist");
                $trigger.find(options.select).off("click.checklist");
                $trigger.find(options.deselect).off("click.checklist");
                $trigger.off("change.checklist", "input[type=checkbox]");
                $trigger.data("patternChecklist", null);
            });
        }
    };

    $.fn.patternChecklist = function(method) {
        if (methods[method])
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method ==="object" || !method)
            return methods.init.apply(this, arguments);
        else
            $.error("Method " + method + " does not exist on jQuery.patternChecklist");
    };

    return $.patterns.checklist;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 sts=4 expandtab
