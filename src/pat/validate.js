/**
 * Patterns validate - Form vlidation
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../registry",
    "../utils",
    "parsley"
], function($, patterns, utils) {
    var validate = {
        name: "validate",
        trigger: "form.pat-validate",

        init: function($el) {
            return $el.each(function() {
                this.noValidate=true;
                var parsley_form, field, i;
                
                parsley_form=$(this).parsley({
                    successClass: "valid",
                    errorClass: "warning",
                    errors: {
                        classHandler: validate._classHandler,
                        container: validate._container,
                    }
                });
                for (i=0; i<parsley_form.items.length; i++) {
                    field=parsley_form.items[i];
                    field.addError=validate._addFieldError;
                    field.removeError=validate._removeFieldError;
                }
            });
        },

        // Parsley error class handler, used to determine which element will
        // receive the status class.
        _classHandler: function(elem, isRadioOrCheckbox) {
            return $(elem).add(elem.map(function(idx, el) { return utils.findLabel(el); }));
        },

        // Parsley hook to determine where error messages are inserted.
        _container: function(element, isRadioOrCheckbox) {
            return $();
        },

        // Parsley method to add an error to a field
        _addFieldError: function(error) {
            for (var constraint in error) {
                var $message = $("<em/>", {"class": "warning message"});
                $message.attr("data-validate-constraint", constraint);
                $message.text(error[constraint]);
                $message.insertAfter(this.element);
            }
        },

        // Parsley method to remove all error messages for a field
        _removeFieldError: function(constraintName) {
            this.element.siblings("em.warning.message[data-validate-constraint="+constraintName+"]").remove();
        }
    };


    patterns.register(validate);
    return validate;
});
