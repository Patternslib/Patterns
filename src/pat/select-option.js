/**
 * Patterns checkedflag - Add checked flag to checkbox labels
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
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
            return $el
                .on("change.pat-select-option", select_option._onChange)
                .trigger("change");
        },

	destroy: function($el) {
            return $el.off(".pat-select-option");
	},

        _onChange: function() {
            var label = utils.findLabel(this);
            if (label!==null) {
                var title = (this.selectedIndex===-1) ? "" : this.options[this.selectedIndex].label;
                label.setAttribute("data-option", title);
            }
        }
    };

    patterns.register(select_option);
    return select_option;
});
