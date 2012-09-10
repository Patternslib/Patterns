/**
 * @license
 * Patterns @VERSION@ tooltip - tooltips
 *
 * Copyright 2012 Simplon B.V.
 */
define(function(require) {

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
            $el.closest("label").removeClass("pt-focus");
            $el.closest("fieldset").removeClass("pt-focus");
        },
    };

    return focus;
});

