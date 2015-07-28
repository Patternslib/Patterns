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
    "use strict";
    validate.moment = moment;
    var parser = new Parser("validate");
    parser.addArgument("disable-selector"); // Elements which must be disabled if there are errors
    parser.addArgument("message-date", "This value must be a valid date");
    parser.addArgument("message-datetime", "This value must be a valid date and time");
    parser.addArgument("message-email", "This value must be a valid email address");
    parser.addArgument("message-number", "This value must be a number");
    parser.addArgument("message-required", "This field is required");
    parser.addArgument("not-after");
    parser.addArgument("not-before");

    return Base.extend({
        name: "validate",
        trigger: "form.pat-validate",

        init: function($el, opts) {
            this.errors = 0;
            this.options = parser.parse(this.$el, opts);
            this.$inputs = this.$el.find(':input[name]');
            this.$inputs.on('change.pat-validate', function (ev) { this.validateElement(ev.target); }.bind(this));
            this.$el.on('submit.pat-validate', this.validateForm.bind(this));
            this.$el.on('pat-update.pat-validate', this.onPatternUpdate.bind(this));
        },

        setLocalDateConstraints: function (input, opts, constraints) {
            /* Set the relative date constraints, i.e. not-after and not-before, as well as custom messages.
             */
            var name, c, type = input.getAttribute('type');
            if (typeof opts == "undefined") {
                return constraints;
            }
            name = input.getAttribute('name').replace(/\./g, '\\.');
            c = constraints[name][type];
            _.each(['before', 'after'], function (relation) {
                var isDate = validate.moment.isDate,
                    relative = opts.not[relation], arr, constraint, $ref;
                if (opts.message[type]) {
                    c.message = '^'+opts.message[type];
                }
                if (typeof relative == "undefined") {
                    return;
                }
                constraint = relation === "before" ? 'earliest' : 'latest';
                if (isDate(relative)) {
                    c[constraint] = relative;
                } else {
                    try {
                        $ref = $(relative);
                    } catch (e) {
                        console.log(e);
                    }
                    arr = $ref.data('pat-validate-refs') || [];
                    if (!_.contains(arr, input)) {
                        arr.unshift(input);
                        $ref.data('pat-validate-refs', arr);
                    }
                    c[constraint] = $ref.val();
                }
            });
            return constraints;
        },

        setLocalConstraints: function (input, constraints) {
            /* Some form fields might have their own data-pat-validate
             * attribute, used to set field-specific constraints.
             *
             * We parse them and add them to the passed in constraints obj.
             */
            if (input.dataset.patValidate) {
                if (_.contains(['datetime', 'date'], input.getAttribute('type'))) {
                    this.setLocalDateConstraints(input, parser.parse($(input)), constraints);
                }
            }
            return constraints;
        },

        getConstraints: function (input) {
            // Get validation constraints by parsing the input element for hints
            var name = input.getAttribute('name'), constraints = {};
            if (!name) { return; }
            constraints[name.replace(/\./g, '\\.')] = {
                'presence': input.getAttribute('required') ? { 'message': '^'+this.options.message.required } : false,
                'email': type == 'email' ? { 'message': '^'+this.options.message.email } : false,
                'numericality': type == 'number' ? { 'message': '^'+this.options.message.number } : false,
                'datetime': type == 'datetime' ? { 'message': '^'+this.options.message.datetime } : false,
                'date': type == 'date' ? { 'message': '^'+this.options.message.date } : false
            };
            return this.setLocalConstraints(input, constraints);
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
            var has_errors = false, input, error;
            var $not_disabled = this.$inputs.filter(function (idx, input) {
                return !input.hasAttribute('disabled');
            });
            for (var i=0; i<$not_disabled.length; i++) {
                error = this.validateElement($not_disabled[i]);
                if (typeof error != "undefined") {
                    if (!has_errors) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        ev.stopImmediatePropagation();
                    }
                    has_errors = true;
                }
            }
        },

        validateElement: function (input, no_recurse) {
            /* Handler which gets called when a single form :input element
             * needs to be validated. Will prevent the event's default action
             * if validation fails.
             */
            var error = validate(this.getValueDict(input), this.getConstraints(input));
            if (!error) {
                this.removeError(input);
            } else {
                this.showError(error, input);
            }
            if (!no_recurse) {
                _.each($(input).data('pat-validate-refs') || [], _.partial(this.validateElement.bind(this), _, true));
            }
            return error;
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

        findErrorMessages: function(el) {
            var $el = $(el),
                selector = "em.validation.message",
                $messages = $el.siblings(selector);
            if ($el.is("[type=radio],[type=checkbox]")) {
                var $fieldset = $el.closest("fieldset.checklist");
                if ($fieldset.length)
                    $messages=$fieldset.find(selector);
            }
            return $messages;
        },

        removeError: function(input) {
            var $errors = this.findErrorMessages(input);
            $errors.remove();
            this.errors = this.errors - $errors.length;
            if (this.errors < 1 && this.options.disableSelector) {
                $(this.options.disableSelector).removeProp('disabled').removeClass('disabled');
            }
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
            this.findErrorMessages(input).remove();
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
            this.errors += 1;
            if (this.options.disableSelector) {
                $(this.options.disableSelector).prop('disabled', true).addClass('disabled');
            }
            $position.trigger("pat-update", {pattern: "validate"});
        }
    });
});
