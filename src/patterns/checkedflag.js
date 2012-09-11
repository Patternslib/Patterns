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
               .on("change", "input[type=checkbox]", checkedflag.onChangeCheckbox)
               .on("change", "input[type=radio]", checkedflag.onChangeRadio);
        },

        initContent: function(root) {
             $("input[type=checkbox]", root).each(checkedflag.onChangeCheckbox);
             $("input[type=radio]", root).each(checkedflag.onChangeRadio);
        },

        onChangeCheckbox: function(e) {
            var $el = $(this),
                $label = $el.closest("label");

            if (this.checked) {
                $label.removeClass("pt-unchecked").addClass("pt-checked");
            } else {
                $label.addClass("pt-unchecked").removeClass("pt-checked");
            }
        },

        onChangeRadio: function(e) {
            var $el = $(this),
                $label = $el.closest("label"),
                selector = "label:has(input[name=" + this.name + "]:not(:checked))",
                $siblings = (this.form===null) ? $(selector) : $(selector, this.form);

            $siblings.removeClass("pt-checked").addClass("pt-unchecked");
            if (this.checked) {
                $label.removeClass("pt-unchecked").addClass("pt-checked");
            } else {
                $label.addClass("pt-unchecked").removeClass("pt-checked");
            }
        }
    };

    return checkedflag;
});

