/**
 * Patterns validate - Form vlidation
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 * Copyright 2014-2015 Syslab.com GmBH  - JC Brand
 */
define([
    "jquery",
    "pat-parser",
    "pat-base",
    "pat-utils",
    "moment",
    "validate"
], function($, Parser, Base, utils, moment, validate) {
    var parser = new Parser("validate");
    parser.addArgument("disable-selector"); // Elements which must be disabled if there are errors
    parser.addArgument("message-required", "This field is required");
    parser.addArgument("message-email", "This value must be a valid email address");
    parser.addArgument("message-number", "This value must be a number");
    parser.addArgument("message-datetime", "This value must be a valid date and time");
    parser.addArgument("message-date", "This value must be a valid date");

    return Base.extend({
        name: "validate",
        trigger: "form.pat-validate",

        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts);
            this.$inputs = this.$el.find(':input[name]');
            this.$inputs.on('change.pat-validate', this.validateElement.bind(this));
            this.$el.on('submit.pat-validate', this.validateForm.bind(this));
            this.$el.on('pat-update.pat-validate', this.onPatternUpdate.bind(this));
        },

        getConstraints: function (input) {
            // Get validation constraints by parsing the input element for hints
            var name = input.getAttribute('name'),
                constraints = {};
            if (!name) { return; }
            constraints[name.replace(/\./g, '\\.')] = {
                'presence': input.getAttribute('required') ? { 'message': '^'+this.options.message.required } : false,
                'email': input.getAttribute('type') == 'email' ? { 'message': '^'+this.options.message.email } : false,
                'numericality': input.getAttribute('type') == 'number' ? { 'message': '^'+this.options.message.number } : false,
                'datetime': input.getAttribute('type') == 'datetime' ? { 'message': '^'+this.options.message.datetime } : false,
                'date': input.getAttribute('type') == 'date' ? { 'message': '^'+this.options.message.date } : false
            };
            return constraints;
        },

        getValueDict: function (input) {
            /* Return a dict {name: value} derived from a DOM input element.
             * Used by validate.js's validate method.
             */
            var value_dict = {};
            var name = input.getAttribute('name');
            value_dict[name] = input.value;
            return value_dict;
        },

        validateForm: function (ev) {
            /* Handler which gets called when the entire form needs to be
             * validated. Will prevent the event's default action if validation fails.
             */
            var has_errors = false;
            var $not_disabled = this.$inputs.filter(function (idx, input) {
                return !input.hasAttribute('disabled');
            });
            $not_disabled.each(function (idx, input) {
                var error = validate(this.getValueDict(input), this.getConstraints(input));
                if (typeof error != "undefined") {
                    this.showError(error, input);
                    has_errors = true;
                }
            }.bind(this));
            if (has_errors) {
                ev.preventDefault();
                ev.stopPropagation();
            }
        },

        validateElement: function (ev) {
            /* Handler which gets called when a single form :input element
             * needs to be validated. Will prevent the event's default action
             * if validation fails.
             */
            var error = validate(this.getValueDict(ev.target), this.getConstraints(ev.target));
            if (!error) {
                this.findErrorMessages($(ev.target)).remove();
            } else {
                this.showError(error, ev.target);
            }
        },

        onPatternUpdate: function (ev, data) {
            /* Handler which gets called when pat-update is triggered within
             * the .pat-validate element.
             *
             * Currently we handle the case where new content appears in the
             * form. In that case we need to remove and then reassign event
             * handlers.
             */
            if (data.pattern == "clone" || data.pattern == "inject") {
                this.$inputs.off('change.pat-validate');
                this.$el.off('submit.pat-validate');
                this.$el.off('pat-update.pat-validate');
                this.init();
            }
            return true;
        },

        findErrorMessages: function($el) {
            var selector = "em.validation.message",
                $messages = $el.siblings(selector);
            if ($el.is("[type=radio],[type=checkbox]")) {
                var $fieldset = $el.closest("fieldset.checklist");
                if ($fieldset.length)
                    $messages=$fieldset.find(selector);
            }
            return $messages;
        },

        showError: function(error, input) {
            var $el = $(input),
                $position = $el,
                strategy="after",
                $message = $("<em/>", {"class": "validation warning message"}),
                $fieldset;
            if ($el.is("[type=radio],[type=checkbox]")) {
                $fieldset = $el.closest("fieldset.checklist");
                if ($fieldset.length) {
                    $position = $fieldset;
                    strategy="append";
                }
            }
            this.findErrorMessages($el).remove();
            _.each(Object.keys(error), function (key) {
                $message.text(error[key]);
            });
            switch (strategy) {
                case "append":
                    $message.appendTo($position);
                    break;
                case "after":
                    $message.insertAfter($position);
                    break;
            }
            $(this.options.disableSelector).prop('disabled', true).addClass('disabled');
            $position.trigger("pat-update", {pattern: "validate"});
        }
    });
});
