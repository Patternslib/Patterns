/**
 * @license
 * Patterns @VERSION@ checkedflag - Add checked flag to checkbox labels
 *
 * Copyright 2012 Simplon B.V.
 */
define([
    "jquery",
    "../registry"
], function($, patterns) {
    var checkedflag = {
        name: "checkedflag",
        trigger: "input",

        init: function($el) {
            $el
                .filter("[type=checkbox]").each(checkedflag.onChangeCheckbox).end()
                .filter("[type=radio]").each(checkedflag.onChangeRadio).end();
        },

        onChangeCheckbox: function(e) {
            var $el = $(this),
                $label = $el.closest("label");

            if (this.checked) {
                $label.removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
            }
        },

        onChangeRadio: function(e) {
            var $el = $(this),
                $label = $el.closest("label"),
                selector = "label:has(input[name='" + this.name + "']:not(:checked))",
                $siblings = (this.form===null) ? $(selector) : $(selector, this.form);

            $siblings.removeClass("checked").addClass("unchecked");
            if (this.checked) {
                $label.removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
            }
        }
    };

    $(document)
       .on("change", "input[type=checkbox]", checkedflag.onChangeCheckbox)
       .on("change", "input[type=radio]", checkedflag.onChangeRadio);
    patterns.register(checkedflag);
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
