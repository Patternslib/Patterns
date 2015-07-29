/**
 * Patterns validate - Form vlidation
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 * Copyright 2014-2015 Syslab.com GmBH  - JC Brand
 */
define([
    "jquery",
    "underscore",
    "pat-parser",
    "pat-base",
    "pat-utils",
    "moment",
    "validate"
], function($, _, Parser, Base, utils, moment, validate) {
    "use strict";
    validate.moment = moment;
    var parser = new Parser("validation");
    parser.addArgument("disable-selector"); // Elements which must be disabled if there are errors
    parser.addArgument("message-date", "This value must be a valid date");
    parser.addArgument("message-datetime", "This value must be a valid date and time");
    parser.addArgument("message-email", "This value must be a valid email address");
    parser.addArgument("message-number", "This value must be a number");
    parser.addArgument("message-required", "This field is required");
    parser.addArgument("message-min", "This value must be greater than or equal to %{count}");
    parser.addArgument("message-max", "This value must be less than or equal to %{count}");
    parser.addArgument("not-after");
    parser.addArgument("not-before");
    var VALIDATION_TYPE_MAP = {
        'required': 'presence',
        'email': 'email',
        'datetime': 'datetime',
        'date': 'date'
    };

    return Base.extend({
        name: "validation",
        trigger: "form.pat-validation",

        init: function($el, opts) {
            this.errors = 0;
            this.options = parser.parse(this.$el, opts);
            this.$inputs = this.$el.find(':input[name]');
            this.$el.find(":input[type=number]").bind('keyup mouseup', _.debounce(function (ev) {
                this.validateElement(ev.target);
            }.bind(this), 500));
            this.$inputs.on('change.pat-validation', function (ev) { this.validateElement(ev.target); }.bind(this));
            this.$el.on('submit.pat-validation', this.validateForm.bind(this));
            this.$el.on('pat-update.pat-validation', this.onPatternUpdate.bind(this));
        },

        setLocalDateConstraints: function (input, opts, constraints) {
            /* Set the relative date constraints, i.e. not-after and not-before, as well as custom messages.
             */
            var name = input.getAttribute('name').replace(/\./g, '\\.'),
                type = input.getAttribute('type'),
                c = constraints[name][type];

            if (typeof opts == "undefined") {
                return constraints;
            }
            _.each(['before', 'after'], function (relation) {
                var isDate = validate.moment.isDate,
                    relative = opts.not[relation], arr, constraint, $ref;
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
                    arr = $ref.data('pat-validation-refs') || [];
                    if (!_.contains(arr, input)) {
                        arr.unshift(input);
                        $ref.data('pat-validation-refs', arr);
                    }
                    c[constraint] = $ref.val();
                }
            });
            return constraints;
        },

        setLocalConstraints: function (input, constraints) {
            /* Some form fields might have their own data-pat-validation
             * attribute, used to set field-specific constraints.
             *
             * We parse them and add them to the passed in constraints obj.
             */
            var name = input.getAttribute('name').replace(/\./g, '\\.'),
                type = input.getAttribute('type'),
                opts = parser.parse($(input));
            if (_.contains(['datetime', 'date'], type)) {
                this.setLocalDateConstraints(input, opts, constraints);
            } else if (type == 'number') {
                _.each(['min', 'max'], function (limit) {
                    // TODO: need to figure out how to add local validation
                    // messages for numericality operators
                    if (input.getAttribute(limit)) {
                        var constraint = constraints[name],
                            key = limit == 'min' ? 'greaterThanOrEqualTo' : 'lessThanOrEqualTo',
                            value = Number(input.getAttribute(limit));
                        if (typeof constraint.numericality === "boolean") {
                            constraint.numericality = {};
                        }
                        constraint.numericality[key] = value;
                    }
                });
            }
            // Set local validation messages.
            _.each(Object.keys(VALIDATION_TYPE_MAP), function (type) {
                var c = constraints[name][VALIDATION_TYPE_MAP[type]];
                if (c === false) {
                    c = { 'message': '^'+opts.message[type] };
                } else {
                    c.message = '^'+opts.message[type];
                }
            });
            return constraints;
        },

        getConstraints: function (input) {
            // Get validation constraints by parsing the input element for hints
            var name = input.getAttribute('name'),
                type = input.getAttribute('type'),
                constraints = {};
            if (!name) { return; }
            constraints[name.replace(/\./g, '\\.')] = {
                'presence': input.getAttribute('required') ? { 'message': '^'+this.options.message.required } : false,
                'email': type == 'email' ? { 'message': '^'+this.options.message.email } : false,
                'numericality': type == 'number' ? true : false,
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
            var value = input.value;
            if (input.getAttribute('type') == "number") {
                try {
                    value = Number(input.value);
                } catch (e) {
                    value = input.value;
                }
            }
            value_dict[name] = value;
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

        customizeMessage: function (msg, input) {
            /* Due to a limitation in validate.js, whereby we cannot have more
             * fine-grained error messages for sub-validations (e.g. is a
             * number and is bigger than 5), we need to customize the messages
             * after validation. We do that here.
             */
            if (msg.indexOf("must be greater than or equal to") != -1) {
                return validate.format(this.options.message.min, {
                    count: input.getAttribute('min')
                });
            } else if (msg.indexOf("must be less than or equal to") != -1) {
                return validate.format(this.options.message.max, {
                    count: input.getAttribute('max')
                });
            } else if (msg.indexOf("is not a number") != -1) {
                return this.options.message.number;
            }
            return msg;
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
                var name = input.getAttribute('name').replace(/\./g, '\\.');
                _.each(error[name], function (msg) {
                    this.showError(this.customizeMessage(msg, input), input);
                }.bind(this));
            }
            if (!no_recurse) {
                _.each($(input).data('pat-validation-refs') || [], _.partial(this.validateElement.bind(this), _, true));
            }
            return error;
        },

        onPatternUpdate: function (ev, data) {
            /* Handler which gets called when pat-update is triggered within
             * the .pat-validation element.
             *
             * Currently we handle the case where new content appears in the
             * form. In that case we need to remove and then reassign event
             * handlers.
             */
            if (data.pattern == "clone" || data.pattern == "inject") {
                this.$inputs.off('change.pat-validation');
                this.$el.off('submit.pat-validation');
                this.$el.off('pat-update.pat-validation');
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
            $message.text(error);
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
            $position.trigger("pat-update", {pattern: "validation"});
        }
    });
});
