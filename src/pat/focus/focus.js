/**
 * @license
 * Patterns @VERSION@ focus - Manage focus class on fieldsets
 *
 * Copyright 2012 Simplon B.V.
 */
define([
    "jquery",
    "pat-registry",
    "pat-utils"
], function($, patterns, utils) {
    var focus = {
        name: "focus",

        onNewContent: function() {
            if ($(document.activeElement).is(":input"))
                focus._doFocus(document.activeElement);
        },

        _findRelatives: function(el) {
            var $el = $(el),
                $relatives = $(el),
                $label = $();

            $relatives=$relatives.add($el.closest("label"));
            $relatives=$relatives.add($el.closest("fieldset"));

            if (el.id)
                $label=$("label[for='"+el.id+"']");
            if (!$label.length) {
                var $form = $el.closest("form");
                if (!$form.length)
                    $form=$(document.body);
                $label=$form.find("label[for='"+el.name+"']");
            }
            $relatives=$relatives.add($label);
            return $relatives;
        },

        onFocus: function() {
            focus._doFocus(this);
        },

        _doFocus: function(el) {
            var $relatives = focus._findRelatives(el);

            function updateHasValue() {
                var hv = utils.hasValue(el);

                if (hv)
                    $relatives.addClass("has-value");
                else {
                    $relatives
                        .filter(function (ix, e) { return !utils.hasValue(e) })
                        .removeClass("has-value");
                }
            }

            if (el.placeholder)
                $relatives.attr("data-placeholder", el.placeholder);
            $relatives.addClass("focus");
            updateHasValue($relatives);
            $(el).on("change.pat-focus keyup.pat-focus", updateHasValue)
        },

        onBlur: function() {
            var $relatives = focus._findRelatives(this);

            $(this).off("change.pat-focus keyup.pat-focus");

            $(document).one("mouseup keyup", function() {
                $relatives.filter(":not(:has(:input:focus))").removeClass("focus");
            });
        }
    };

    $(document)
        .on("focus.patterns", ":input", focus.onFocus)
        .on("blur.patterns", ":input", focus.onBlur)
        .on("newContent", focus.onNewContent);
    patterns.register(focus);
    return focus;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
