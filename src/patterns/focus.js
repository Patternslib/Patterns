/**
 * @license
 * Patterns @VERSION@ focus - Manage focus class on fieldsets
 *
 * Copyright 2012 Simplon B.V.
 */
define([
    'jquery'
], function($) {
    var focus = {
        init: function() {
            $(document)
               .on("focus", ":input", focus.onFocus)
               .on("blur", ":input", focus.onBlur);
        },

        initContent: function(root) {
            if ($(document.activeElement).is(":input")) {
                focus._markFocus(document.activeElement);
            }
        },

        _markFocus: function(el) {
            var $el = $(el);
            $el.closest("label").addClass("pt-focus");
            $el.closest("fieldset").addClass("pt-focus");
        },

        onFocus: function(e) {
            focus._markFocus(this);
        },

        onBlur: function(e) {
            var $el = $(this);

            $(document).one("mouseup keyup", function() {
                $el.closest("label").removeClass("pt-focus");
                $el.closest("fieldset").filter(":not(:has(:input:focus))").removeClass("pt-focus");
            });
        }
    };

    return focus;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
