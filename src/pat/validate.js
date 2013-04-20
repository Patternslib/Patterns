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
                        container: validate._container
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
        _classHandler: function(elem/*, isRadioOrCheckbox */) {
            var $result = elem;
            for (var i=0; i<elem.length; i++) {
                $result=$result.add(utils.findLabel(elem[i]));
                $result=$result.add(elem.eq(i).closest("fieldset"));
            }
            return $result;
        },

        // Parsley hook to determine where error messages are inserted.
        _container: function(/* element, isRadioOrCheckbox */) {
            return $();
        },

        _findErrorMessages: function($el, constraintName) {
            var selector = "em.warning.message[data-validate-constraint="+constraintName+"]",
                $messages = $el.siblings(selector);
            if ($el.is("[type=radio],[type=checkbox]")) {
                var $fieldset = $el.closest("fieldset.checklist");
                if ($fieldset.length)
                    $messages=$fieldset.find(selector);
            }
            return $messages;
        },

        // Parsley method to add an error to a field
        _addFieldError: function(error) {
            var $position = this.element,
                strategy="after";

            if (this.element.is("[type=radio],[type=checkbox]")) {
                var $fieldset = this.element.closest("fieldset.checklist");
                if ($fieldset.length) {
                    $position=$fieldset;
                    strategy="append";
                }
            }

            for (var constraintName in error) {
                if (validate._findErrorMessages(this.element, constraintName).length)
                    return;
                var $message = $("<em/>", {"class": "warning message"});
                $message.attr("data-validate-constraint", constraintName);
                $message.text(error[constraintName]);
                switch (strategy) {
                    case "append":
                        $message.appendTo($position);
                        break;
                    case "after":
                        $message.insertAfter($position);
                        break;
                }
            }
        },

        // Parsley method to remove all error messages for a field
        _removeFieldError: function(constraintName) {
            var $messages = validate._findErrorMessages(this.element, constraintName);
            $messages.remove();
        }
    };


    patterns.register(validate);
    return validate;
});
