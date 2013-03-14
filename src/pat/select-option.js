/**
 * Patterns checkedflag - Add checked flag to checkbox labels
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 * Copyright 2013 Florian Friesdorf
 */
define([
    "jquery",
    "../registry"
], function($, patterns) {
    var select_option = {
        name: "select-option",
        trigger: "select",

        init: function($el) {
            $el.each(function() {
                var $el = $(this);
                // create parent span if not direct child of a label
                if ($el.parent('label').length === 0) {
                    $el.wrap('<span />');
                }
                select_option.onChange.call(this);
            }).on("change.pat-select-option", select_option.onChange);
        },

        destroy: function($el) {
            return $el.off(".pat-select-option");
        },

        onChange: function() {
            $(this).parent().attr(
                'data-option',
                $(this).find('option[value="' + $(this).val() + '"]').text()
            );
        }
    };

    patterns.register(select_option);
    return select_option;
});
