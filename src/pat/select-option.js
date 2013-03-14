/**
 * Patterns checkedflag - Add checked flag to checkbox labels
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 * Copyright 2013 Florian Friesdorf
 */
define([
    "jquery",
    "../registry",
    "../utils"
], function($, patterns, utils) {
    var select_option = {
        name: "select-option",
        trigger: "label select",

        init: function($el) {
            $el.on("change.pat-select-option", select_option._onChange);
            select_option._onChange.call(this);
            return $el;
        },

        destroy: function($el) {
            return $el.off(".pat-select-option");
        },

        _onChange: function() {
            var label = utils.findLabel(this);
            if (label !== null) {
                $(label).attr('data-option', $(this).val() || "");
            }
        }
    };

    patterns.register(select_option);
    return select_option;
});
