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
               .on("focusin", "fieldset", focus.onFocusin)
               .on("focusout", "fieldset", focus.onFocusout);
        },

        initContent: function(root) {
            $(document.activeElement).closest("fieldset").addClass("pt-focus");
        },

        onFocusin: function(e) {
            $(this).addClass("pt-focus");
        },

        onFocusout: function(e) {
            if ($(":focus", this).length===0) {
                $(this).removeClass("pt-focus");
            }
        },
    };

    return focus;
});

