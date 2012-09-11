/**
 * @license
 * Patterns @VERSION@ checkedflag - Add checked flag to checkbox labels
 *
 * Copyright 2012 Simplon B.V.
 */
define(function(require) {
    var checkedflag = {
        init: function() {
            $(document)
               .on("change", "input[type=checkbox]", checkedflag.onChange);
        },

        initContent: function(root) {
             $("input[type=checkbox]", root).each(checkedflag.onChange);
        },

        onChange: function(e) {
            var $el = $(this),
                $label = $el.closest("label");

            if ($label.length!==0) {
                if (this.checked) {
                    $label.removeClass("pt-unchecked").addClass("pt-checked");
                } else {
                    $label.addClass("pt-unchecked").removeClass("pt-checked");
                }
            }
        }
    };

    return checkedflag;
});

