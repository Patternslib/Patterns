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
        trigger: "input[type=checkbox],input[type=radio]",

        init: function($el) {
            $el
                .filter("[type=checkbox]")
                    .each(checkedflag.onChangeCheckbox)
                    .on("change.patternCheckedflag", checkedflag.onChangeCheckbox)
                    .end()
                .filter("[type=radio]")
                    .each(checkedflag.onChangeRadio)
                    .on("change.patternCheckedflag", checkedflag.onChangeRadio)
                    .end();
        },

        onChangeCheckbox: function(event) {
            var $el = $(this),
                $label = $el.closest("label"),
                $fieldset = $el.closest("fieldset");

            if (this.checked) {
                $label.add($fieldset).removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
                if ($fieldset.find("input:checked").length)
                    $fieldset.removeClass("unchecked").addClass("checked");
                else
                    $fieldset.addClass("unchecked").removeClass("checked");
            }
        },

        onChangeRadio: function(event) {
            var $el = $(this),
                $label = $el.closest("label"),
                $fieldset = $el.closest("fieldset"),
                selector = "label:has(input[name='" + this.name + "']:not(:checked))",
                $siblings = (this.form===null) ? $(selector) : $(selector, this.form);

            $siblings.removeClass("checked").addClass("unchecked");
            if (this.checked) {
                $label.add($fieldset).removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
                if ($fieldset.find("input:checked").length)
                    $fieldset.removeClass("unchecked").addClass("checked");
                else
                    $fieldset.addClass("unchecked").removeClass("checked");
            }
        }
    };

    patterns.register(checkedflag);
    return checkedflag;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
