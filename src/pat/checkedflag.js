/**
 * Patterns checkedflag - Add checked flag to checkbox labels and API
 * for (un)checking.
 *
 * Copyright 2012-2013 Simplon B.V. - Wichert Akkerman
 * Copyright 2012 JC Brand
 * Copyright 2012-2013 Florian Friesdorf
 */
define([
    "jquery",
    "../registry",
    "../core/logger",
    "../utils"
], function($, patterns, logger, utils) {
    var log = logger.getLogger("checkedflag");

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

        // XXX: so far I was under the assumption that prop is current
        // state and attr is default and current state. Well, this
        // does not seem to be the case. I feel like doing this
        // without jquery.
        set: function($el, val, opts) {
            opts = opts || {};
            // XXX: no support for radio yet
            return $el.each(function() {
                var $el = $(this);
                if ($el.is('input[type=checkbox]')) {
                    var $input = $(this);
                    if (opts.setdefault) {
                        // XXX: implement me
                    } else {
                        // just change the current state
                        // XXX: not sure whether this is correct
                        $input.prop('checked', val);
                    }
                    _.onChangeCheckbox.call(this);
                } else if ($el.is('select:not([multiple])')) {
                    var $select = $(this);
                    if (opts.setdefault) {
                        // XXX: implement me
                    } else {
                        // just change the current state
                        $select.find('option:selected')
                            .prop('selected', false);
                        $select.find('option[value="' + val + '"]')
                            .prop('selected', true);
                    }
                    _.onChangeSelect.call(this);
                } else {
                    log.error('Unsupported element', $el[0]);
                }
            });
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

        _getLabelAndFieldset: function(el) {
            var $result = $(utils.findLabel(el));
            return $result.add($(el).closest("fieldset"));
        },

        _getSiblingsWithLabelsAndFieldsets: function(el) {
            var selector = "input[name=\""+el.name+"\"]",
                $related = (el.form===null) ? $(selector) : $(selector, el.form),
                $result = $();
            $result=$related=$related.not(el);
            for (var i=0; i<$related.length; i++)
                $result=$result.add(_._getLabelAndFieldset($related[i]));
            return $result;
        },

        onChangeCheckbox: function() {
            var $el = $(this),
                $label = $(utils.findLabel(this)),
                $fieldset = $el.closest("fieldset");

            if ($el.closest("ul.radioList").length)
                $label=$label.add($el.closest("li"));

            if (this.checked) {
                $label.add($fieldset)
                    .removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
                if ($fieldset.find("input:checked").length) {
                    $fieldset.removeClass("unchecked").addClass("checked");
                } else
                    $fieldset.addClass("unchecked").removeClass("checked");
            }
        },

        onChangeRadio: function() {
            var $el = $(this),
                $label = $(utils.findLabel(this)),
                $fieldset = $el.closest("fieldset"),
                $siblings = _._getSiblingsWithLabelsAndFieldsets(this);

            if ($el.closest("ul.radioList").length) {
                $label=$label.add($el.closest("li"));
                $siblings=$siblings.closest("li");
            }

            $siblings.removeClass("checked").addClass("unchecked");
            if (this.checked) {
                $label.add($fieldset)
                    .removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
                if ($fieldset.find("input:checked").length) {
                    $fieldset.removeClass("unchecked").addClass("checked");
                } else
                    $fieldset.addClass("unchecked").removeClass("checked");
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

// vim: sw=4 expandtab
