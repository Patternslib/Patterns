/**
 * Patterns checkedflag - Add checked flag to checkbox labels and API
 * for (un)checking.
 *
 * Copyright 2012-2013 Simplon B.V. - Simplon B.V. - Wichert Akkerman
 * Copyright 2012 JC Brand
 * Copyright 2012-2013 Florian Friesdorf
 */
define([
    "jquery",
    "../registry"
], function($, patterns) {
    var _ = {
        name: "checkedflag",
        trigger: "input[type=checkbox],input[type=radio],select",
        jquery_plugin: true,

        init: function($el) {
            var $forms = $();
            $el.each(function() {
                if (this.form === null)
                    return;
                var $form = $(this.form);
                if ($form.data("pat-checkedflag.reset"))
                    return;
                $form.data("pat-checkedflag.reset", true);
                $forms = $forms.add(this.form);
            });

            $el.filter("[type=checkbox]")
                .each(_.onChangeCheckbox)
                .on("change.pat-checkedflag", _.onChangeCheckbox);

            $el.filter("[type=radio]")
                .each(_.onChangeRadio)
                .on("change.pat-checkedflag", _.onChangeRadio);

            $el.filter("select:not([multiple])")
                .each(function() {
                    var $el = $(this);
                    // create parent span if not direct child of a label
                    if ($el.parent('label').length === 0) {
                        $el.wrap('<span />');
                    }
                    _.onChangeSelect.call(this);
                })
                .on("change.pat-checkedflag", _.onChangeSelect);

            $el.filter("input:disabled").each(function() {
                $(this).closest("label").addClass('disabled');
            });

            $forms.on("reset.pat-checkedflag", _.onFormReset);
        },

        destroy: function($el) {
            return $el.off(".pat-checkedflag");
        },

        onFormReset: function() {
            // This event is triggered before the form is reset, and we need
            // the post-reset state to update our pattern. Use a small delay
            // to fix this.
            var form = this;
            setTimeout(function() {
                $("input[type=checkbox]", form).each(_.onChangeCheckbox);
                $("input[type=radio]", form).each(_.onChangeRadio);
                $("select:not([multiple])", form).each(_.onChangeSelect);
            }, 50);
        },

        onChangeCheckbox: function() {
            var $el = $(this),
                $label = $el.closest("label"),
                $fieldset = $el.closest("fieldset");

            if (this.checked) {
                $label.add($fieldset)
                    .removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
                if ($fieldset.find("input:checked").length) {
                    $fieldset.removeClass("unchecked").addClass("checked");
                } else{
                    $fieldset.addClass("unchecked").removeClass("checked");
                }
            }
        },

        onChangeRadio: function() {
            var $el = $(this),
                $label = $el.closest("label"),
                $fieldset = $el.closest("fieldset"),
                selector = 'label' +
                    ':has(input[name="' + this.name + '"]' +
                    ':not(:checked))',
                $siblings = (this.form === null) ?
                    $(selector) : $(selector, this.form);

            $siblings.removeClass("checked").addClass("unchecked");
            if (this.checked) {
                $label.add($fieldset)
                    .removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
                if ($fieldset.find("input:checked").length) {
                    $fieldset.removeClass("unchecked").addClass("checked");
                } else {
                    $fieldset.addClass("unchecked").removeClass("checked");
                }
            }
        },

        onChangeSelect: function() {
            var $select = $(this);
            $select.parent().attr(
                'data-option',
                $select.find('option:selected').text()
            );
        }
    };

    patterns.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
