/**
 * Patterns checklist - Easily (un)check all checkboxes
 *
 * Copyright 2012-2013 Simplon B.V. - Wichert Akkerman
 * Copyright 2012-2013 Florian Friesdorf
 */
define([
    "jquery",
    "pat-jquery-ext",
    "pat-parser",
    "pat-registry",
    "pat-utils"
], function($, dummy, Parser, registry, utils) {
    var parser = new Parser("checklist");
    parser.addArgument("select", ".select-all");
    parser.addArgument("deselect", ".deselect-all");

    var _ = {
        name: "checklist",
        trigger: ".pat-checklist",
        jquery_plugin: true,

        init: function($el, opts) {
            return $el.each(function() {
                var $trigger = $(this),
                    options = parser.parse($trigger, opts, false);

                $trigger.data("patternChecklist", options);
                $trigger.scopedFind(options.select)
                    .on("click.pat-checklist", {trigger: $trigger}, _.onSelectAll);
                $trigger.scopedFind(options.deselect)
                    .on("click.pat-checklist", {trigger: $trigger}, _.onDeselectAll);
                $trigger.on("change.pat-checklist", {trigger: $trigger}, _.onChange);
                // update select/deselect button status
                _.onChange({data: {trigger: $trigger}});

                $trigger.find("input[type=checkbox]")
                    .each(_._onChangeCheckbox)
                    .on("change.pat-checklist", _._onChangeCheckbox);

                $trigger.find("input[type=radio]")
                    .each(_._initRadio)
                    .on("change.pat-checklist", _._onChangeRadio);

            });
        },

        destroy: function($el) {
            return $el.each(function() {
                var $trigger = $(this),
                    options = $trigger.data("patternChecklist");
                $trigger.scopedFind(options.select).off(".pat-checklist");
                $trigger.scopedFind(options.deselect).off(".pat-checklist");
                $trigger.off(".pat-checklist", "input[type=checkbox]");
                $trigger.data("patternChecklist", null);
            });
        },

        _findSiblings: function(elem, sel) {
            var parents = $(elem).parents();
            for (var i=0; i<parents.length; i++) {
                var checkbox_children = $(parents[i]).find(sel);
                if (checkbox_children.length != 0) {
                    return checkbox_children;
                }
            }
        },
        onChange: function(event) {
            var $trigger = event.data.trigger,
                options = $trigger.data("patternChecklist");


            var all_selects = $trigger.find(options.select);
            if (all_selects.length === 0) {
                all_selects = $(options.select);
            }
            var all_deselects = $trigger.find(options.deselect);
            if (all_deselects.length === 0) {
                all_deselects = $(options.deselect);
            }
            for (var i=0; i<all_selects.length; i++) {

                if (_._findSiblings(all_selects[i], "input[type=checkbox]:visible").filter(":not(:checked)").length === 0) {
                    $(all_selects[i]).prop("disabled", true);
                } else {
                    $(all_selects[i]).prop("disabled", false);
                }
            }
            for (var i=0; i< all_deselects.length; i++) {
                if (_._findSiblings(all_deselects[i], "input[type=checkbox]:visible").filter(":checked").length === 0) {
                    $(all_deselects[i]).prop("disabled", true);
                } else {
                    $(all_deselects[i]).prop("disabled", false);
                }
            }

        },

        onSelectAll: function(event) {
            var $trigger = event.data.trigger,
                options = $trigger.data("patternChecklist"),
                button_clicked = event.currentTarget;
            
            /* look up checkboxes which are related to my button by going up one parent 
            at a time until I find some for the first time */
            var checkbox_siblings = _._findSiblings(button_clicked, "input[type=checkbox]:not(:checked)");
            checkbox_siblings.each(function () {
                $(this).prop("checked", true).trigger("change");
            });

            event.preventDefault();
        },

        onDeselectAll: function(event) {
            var $trigger = event.data.trigger,
                options = $trigger.data("patternChecklist"),
                button_clicked = event.currentTarget;

            /* look up checkboxes which are related to my button by going up one parent 
            at a time until I find some for the first time */
            var checkbox_siblings = _._findSiblings(button_clicked, "input[type=checkbox]:checked");
            checkbox_siblings.each(function () {
                $(this).prop("checked", false).trigger("change");
            });
            event.preventDefault();
        },

        /* The following methods are moved here from pat-checked-flag, which is being deprecated */
        _getLabelAndFieldset: function(el) {
            var $result = $(utils.findLabel(el));
            return $result.add($(el).closest("fieldset"));
        },

        _getSiblingsWithLabelsAndFieldsets: function(el) {
            var selector = "input[name=\""+el.name+"\"]",
                $related = (el.form===null) ? $(selector) : $(selector, el.form),
                $result = $();
            $result = $related=$related.not(el);
            for (var i=0; i<$related.length; i++) {
                $result=$result.add(_._getLabelAndFieldset($related[i]));
            }
            return $result;
        },

        _onChangeCheckbox: function() {
            var $el = $(this),
                $label = $(utils.findLabel(this)),
                $fieldset = $el.closest("fieldset");

            if ($el.closest("ul.radioList").length) {
                $label=$label.add($el.closest("li"));
            }

            if (this.checked) {
                $label.add($fieldset).removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
                if ($fieldset.find("input:checked").length) {
                    $fieldset.removeClass("unchecked").addClass("checked");
                } else
                    $fieldset.addClass("unchecked").removeClass("checked");
            }
        },

        _initRadio: function() {
            _._updateRadio(this, false);
        },

        _onChangeRadio: function() {
            _._updateRadio(this, true);
        },

        _updateRadio: function(input, update_siblings) {
            var $el = $(input),
                $label = $(utils.findLabel(input)),
                $fieldset = $el.closest("fieldset"),
                $siblings = _._getSiblingsWithLabelsAndFieldsets(input);

            if ($el.closest("ul.radioList").length) {
                $label=$label.add($el.closest("li"));
                $siblings=$siblings.closest("li");
            }

            if (update_siblings) {
                 $siblings.removeClass("checked").addClass("unchecked");
            }
            if (input.checked) {
                $label.add($fieldset).removeClass("unchecked").addClass("checked");
            } else {
                $label.addClass("unchecked").removeClass("checked");
                if ($fieldset.find("input:checked").length) {
                    $fieldset.removeClass("unchecked").addClass("checked");
                } else {
                    $fieldset.addClass("unchecked").removeClass("checked");
                }
            }
        },


    };
    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
