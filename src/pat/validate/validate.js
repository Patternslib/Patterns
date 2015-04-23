/**
 * Patterns validate - Form vlidation
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "pat-registry",
    "pat-utils",
    "parsley",
    "parsley.extend"
], function($, patterns, utils) {
    var validate = {
        name: "validate",
        trigger: "form.pat-validate",

        init: function($el) {
            return $el.each(function() {
                this.noValidate=true;
                var parsley_form, field, i;

                parsley_form=$(this).parsley({
                    trigger: "change keyup",
                    successClass: "valid",
                    errorClass: "warning",
                    errors: {
                        classHandler: validate._classHandler,
                        container: validate._container
                    },
                    messages: {
                        beforedate:     "This date should be before another date.",
                        onorbeforedate: "This date should be on or before another date.",
                        afterdate:      "This date should be after another date.",
                        onorafterdate:  "This date should be on or after another date."
                    }
                });
                for (i=0; i<parsley_form.items.length; i++) {
                    field = parsley_form.items[i];
                    if (typeof field.UI !== "undefined") {
                        // Parsley 1.2.x
                        field.UI.addError = validate._addFieldError;
                        field.UI.removeError = validate._removeFieldError;
                        validate.parsley12 = true;
                    } else {
                        // Parsley 1.1.x
                        field.addError = validate._addFieldError;
                        field.removeError = validate._removeFieldError;
                    }
                }
                $(this).on("pat-ajax-before.pat-validate",
                           validate.onPreSubmit);
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
            var selector = "em.validation.message[data-validate-constraint="+constraintName+"]",
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
            var $el;
            if (validate.parsley12) {
                $el = this.ParsleyInstance.element;
            } else {
                $el = this.element;
            }
            var $position = $el,
                strategy="after";

            if ($el.is("[type=radio],[type=checkbox]")) {
                var $fieldset = $el.closest("fieldset.checklist");
                if ($fieldset.length) {
                    $position=$fieldset;
                    strategy="append";
                }
            }

            for (var constraintName in error) {
                if (validate._findErrorMessages($el, constraintName).length)
                    return;
                var $message = $("<em/>", {"class": "validation warning message"});
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
            $position.trigger("pat-update", {pattern: "validate"});
        },

        // Parsley method to remove all error messages for a field
        _removeFieldError: function(constraintName) {
            var $el;
            if (validate.parsley12) {
                $el = this.ParsleyInstance.element;
            } else {
                $el = this.element;
            }
            var $messages = validate._findErrorMessages($el, constraintName);
            $messages.parent().trigger("pat-update", {pattern: "validate"});
            $messages.remove();
        },

        onPreSubmit: function(event, veto) {
            veto.veto |= !$(event.target).parsley("isValid");
            $(event.target).parsley("validate");
        }
    };


    patterns.register(validate);
    return validate;
});
