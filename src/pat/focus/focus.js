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

        transform: function($root) {
            $root.find(":input[placeholder]").each(function(ix, el) {
                var $relatives = focus._findRelatives(el);
                if (el.placeholder)
                    $relatives.attr("data-placeholder", el.placeholder);
            });
            $root.find(":input").each(focus.onChange);
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

        _updateHasValue: function(el) {
            var $relatives = focus._findRelatives(el);
            var hv = utils.hasValue(el);

            if (hv) {
                $relatives
                    .addClass("has-value")
                    .attr("data-value", el.value);
            } else {
                $relatives
                    .filter(function (ix, e) {
                        const inputs = $(":input", e);
                        for (var i=0; i<inputs.length; i++)
                            if (utils.hasValue(inputs[i]))
                                return false;
                        return true;
                    })
                    .removeClass("has-value")
                    .attr("data-value", null);
            }
        },

        _doFocus: function(el) {
            var $relatives = focus._findRelatives(el);
            $relatives.addClass("focus");
            this._updateHasValue($relatives);
        },

        onBlur: function() {
            var $relatives = focus._findRelatives(this);

            $(document).one("mouseup keyup", function() {
                $relatives.filter(":not(:has(:input:focus))").removeClass("focus");
            });
        },

        onChange: function() {
            focus._updateHasValue(this);
        }
    };

    $(document)
        .on("focus.patterns", ":input", focus.onFocus)
        .on("blur.patterns", ":input", focus.onBlur)
        .on("newContent", focus.onNewContent)
        .on("change.pat-focus keyup.pat-focus", ":input", focus.onChange);
    patterns.register(focus);
    return focus;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
