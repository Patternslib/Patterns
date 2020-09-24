/**
 * Patterns validate - Form vlidation
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 * Copyright 2014-2015 Syslab.com GmBH  - JC Brand
 */
import $ from "jquery";
import _ from "underscore";
import Parser from "../../core/parser";
import Base from "../../core/base";
import utils from "../../core/utils";
import moment from "moment";
import validate from "validate.js";

const parser = new Parser("validation");
parser.addArgument("disable-selector"); // Elements which must be disabled if there are errors
parser.addArgument("message-date", "This value must be a valid date");
parser.addArgument(
    "message-datetime",
    "This value must be a valid date and time"
);
parser.addArgument("message-email", "This value must be a valid email address");
parser.addArgument("message-integer", "This value must be an integer");
parser.addArgument(
    "message-max",
    "This value must be less than or equal to %{count}"
);
parser.addArgument(
    "message-min",
    "This value must be greater than or equal to %{count}"
);
parser.addArgument("message-number", "This value must be a number");
parser.addArgument("message-required", "This field is required");
parser.addArgument("message-equality", "is not equal to %{attribute}");
parser.addArgument("message-confirm", "This field is required");
parser.addArgument("not-after");
parser.addArgument("not-before");
parser.addArgument("equality");
parser.addArgument("type", undefined, ["integer", "date", "datetime"]);

const VALIDATION_TYPE_MAP = {
    required: "presence",
    email: "email",
    datetime: "datetime",
    date: "date",
};

// Before using it we must add the parse and format functions
// Here is a sample implementation using moment.js
validate.moment = moment;
validate.extend(validate.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: function (value) {
        return +moment.utc(value);
    },
    // Input is a unix timestamp
    format: function (value, options) {
        var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return moment.utc(value).format(format);
    },
});

export default Base.extend({
    name: "validation",
    trigger: "form.pat-validation",

    init: function ($el, opts) {
        this.errors = 0;
        this.options = parser.parse(this.$el, opts);
        this.$inputs = this.$el.find(
            "input[name], select[name], textarea[name]"
        );
        this.$el.find("input[type=number]").on(
            "keyup mouseup",
            _.debounce(
                function (ev) {
                    this.validateElement(ev.target);
                }.bind(this),
                500
            )
        );
        this.$inputs.on(
            "change.pat-validation",
            function (ev) {
                this.validateElement(ev.target);
            }.bind(this)
        );
        // formaction causes form validation to be skipped, so validate on
        // submit button click instead.
        this.$el
            .find("button[type=submit][formaction]")
            .on("click.pat-validation", this.validateForm.bind(this));
        this.$el.on("submit.pat-validation", this.validateForm.bind(this));
        this.$el.on(
            "pat-update.pat-validation",
            this.onPatternUpdate.bind(this)
        );
        this.$el.on(
            "click.pat-validation",
            ".close-panel",
            function (ev) {
                if (!$(ev.target).hasClass("validate-ignore")) {
                    this.validateForm(ev);
                }
            }.bind(this)
        );
    },

    getFieldType: function (input) {
        var opts = parser.parse($(input));
        var type = input.getAttribute("type");
        if (_.contains(["datetime", "date"], opts.type)) {
            type = opts.type;
        }
        if (type === "datetime-local") {
            type = "datetime";
        }
        return type;
    },

    setLocalDateConstraints: function (input, opts, constraints) {
        /* Set the relative date constraints, i.e. not-after and not-before, as well as custom messages.
         */
        var name = input.getAttribute("name").replace(/\./g, "\\.");
        var type = this.getFieldType(input);
        var c = constraints[name][type];

        if (!c || typeof opts == "undefined") {
            return constraints;
        }

        _.each(["before", "after"], function (relation) {
            var relative = opts.not ? opts.not[relation] : undefined;
            var $ref;
            if (typeof relative === "undefined") {
                return;
            }
            var relative_constraint =
                relation === "before" ? "earliest" : "latest";
            if (validate.moment.isDate(relative)) {
                c[relative_constraint] = relative;
            } else {
                try {
                    $ref = $(relative);
                } catch (e) {
                    console.log(e);
                }
                var arr = $ref.data("pat-validation-refs") || [];
                if (!_.contains(arr, input)) {
                    arr.unshift(input);
                    $ref.data("pat-validation-refs", arr);
                }
                if ($ref && $ref.val()) {
                    // relative constraint validation
                    c[relative_constraint] = $ref.val();
                }
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
        var name = input.getAttribute("name").replace(/\./g, "\\."),
            type = this.getFieldType(input),
            opts = parser.parse($(input)),
            constraint = constraints[name];
        if (_.contains(["datetime", "date"], type)) {
            constraints = this.setLocalDateConstraints(
                input,
                opts,
                constraints
            );
        } else if (type == "number") {
            _.each(["min", "max"], function (limit) {
                // TODO: need to figure out how to add local validation
                // messages for numericality operators
                if (input.getAttribute(limit)) {
                    var constraint = constraints[name],
                        key =
                            limit == "min"
                                ? "greaterThanOrEqualTo"
                                : "lessThanOrEqualTo",
                        value = Number(input.getAttribute(limit));
                    if (typeof constraint.numericality === "boolean") {
                        constraint.numericality = {};
                    }
                    constraint.numericality[key] = value;
                }
            });
            if (opts.type == "integer") {
                if (typeof constraint.numericality === "boolean") {
                    constraint.numericality = {};
                }
                constraint.numericality.onlyInteger = true;
            }
        }

        // Handle fields equality
        if (opts.equality) {
            this.$el
                .find("[name=" + opts.equality + "]")
                .each(function (idx, el) {
                    if (input.value !== el.value) {
                        constraint.equality = {
                            attribute: opts.equality,
                            message: "^" + opts.message["equality"],
                        };
                    }
                });
        }

        // Set local validation messages.
        _.each(Object.keys(VALIDATION_TYPE_MAP), function (type) {
            var c = constraints[name][VALIDATION_TYPE_MAP[type]];
            if (c === false) {
                c = { message: "^" + opts.message[type] };
            } else {
                c.message = "^" + opts.message[type];
            }
        });
        return constraints;
    },

    getConstraints: function (input) {
        // Get validation constraints by parsing the input element for hints
        var name = input.getAttribute("name"),
            type = this.getFieldType(input),
            constraints = {};
        if (!name) {
            return;
        }
        constraints[name.replace(/\./g, "\\.")] = {
            presence: input.hasAttribute("required")
                ? {
                      message: "^" + this.options.message.required,
                      allowEmpty: false,
                  }
                : false,
            email:
                type === "email"
                    ? { message: "^" + this.options.message.email }
                    : false,
            numericality: type === "number" ? true : false,
            datetime:
                type === "datetime" && this.doDateCheck(input)
                    ? { message: "^" + this.options.message.datetime }
                    : false,
            date:
                type === "date" && this.doDateCheck(input)
                    ? { message: "^" + this.options.message.date }
                    : false,
        };
        constraints = this.setLocalConstraints(input, constraints);
        return constraints;
    },

    doDateCheck: function (input) {
        // Returns true if a date check should be done.
        // Don't check if there is no input - this should be handled by
        // the ``required`` attribute.
        // In case of HTML5 date/datetime-local support we also have to
        // check for ``badInput`` as invalid date input will result in an
        // empty ``value``.
        var type = input.getAttribute("type"); // we need the raw type here
        if (
            utils.checkInputSupport("date", "wrong value") &&
            type.indexOf("date") === 0 &&
            typeof input.validity.badInput !== "undefined"
        ) {
            // Do the date check if the input is invalid or not missing
            // (actually double-checking here - HTML5 and validate.js).
            return input.validity.badInput || !!input.value;
        } else {
            // Do the date check if input is not empty (Safari has yet no
            // date support at all)
            return !!input.value;
        }
    },

    getValueDict: function (input) {
        /* Return a dict {name: value} derived from a DOM input element.
         * Used by validate.js's validate method.
         */
        var value_dict = {};
        var name = input.getAttribute("name");
        var value = input.value;
        if (input.getAttribute("type") == "number") {
            if (value !== "") {
                try {
                    value = Number(input.value);
                } catch (e) {
                    value = input.value;
                }
            } else {
                value = null;
            }
        }
        value_dict[name] = value;
        return value_dict;
    },

    validateForm: function (ev) {
        /* Handler which gets called when the entire form needs to be
         * validated. Will prevent the event's default action if validation fails.
         */
        var has_errors = false;
        // Ignore invisible elements (otherwise pat-clone template
        // elements get validated). Not aware of other cases where this
        // might cause problems.
        var $single = this.$inputs.filter(
            ":visible:enabled:not(:checkbox):not(:radio), .pat-autosuggest:not(:visible)"
        );
        var group_names = this.$inputs
            .filter(":enabled:checkbox, :enabled:radio")
            .map(function () {
                return this.getAttribute("name");
            });
        var handleError = function (error) {
            if (typeof error != "undefined") {
                if (!has_errors && ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    ev.stopImmediatePropagation();
                }
                has_errors = true;
            }
        };
        // We use for loops, to keep things synchronous, otherwise other
        // pattern's event handlers (like pat-inject) start getting called,
        // which we need to avoid.
        for (let single of $single) {
            handleError(this.validateElement(single));
        }
        for (let group_name of group_names) {
            handleError(this.validateGroupedElement(group_name));
        }
    },

    customizeMessage: function (msg, input) {
        /* Due to a limitation in validate.js, whereby we cannot have more
         * fine-grained error messages for sub-validations (e.g. is a
         * number and is bigger than 5), we need to customize the messages
         * after validation. We do that here.
         */
        var opts = parser.parse($(input));
        if (msg.indexOf("must be greater than or equal to") != -1) {
            return validate.format(opts.message.min, {
                count: input.getAttribute("min"),
            });
        } else if (msg.indexOf("must be less than or equal to") != -1) {
            return validate.format(opts.message.max, {
                count: input.getAttribute("max"),
            });
        } else if (msg.indexOf("is not a number") != -1) {
            return opts.message.number;
        } else if (msg.indexOf("must be an integer") != -1) {
            return opts.message.integer;
        }
        return msg;
    },

    validateGroupedElement: function (name) {
        /* Handler which gets called for :checkbox and :radio elments. */
        var input = this.$el.find('[name="' + name + '"]')[0];
        var error = validate(
            _.pick(validate.collectFormValues(this.$el), name),
            this.getConstraints(input)
        );
        if (!error) {
            this.removeError(input);
        } else {
            _.each(
                error[name.replace(/\./g, "\\.")],
                function (msg) {
                    this.showError(this.customizeMessage(msg, input), input);
                }.bind(this)
            );
        }
        return error;
    },

    validateElement: function (input, no_recurse) {
        /* Handler which gets called when a single form input element
         * needs to be validated. Will prevent the event's default action
         * if validation fails.
         */
        if (input.disabled) {
            return;
        }
        var error = validate(
            this.getValueDict(input),
            this.getConstraints(input)
        );
        if (!error) {
            this.removeError(input);
        } else {
            var name = input.getAttribute("name").replace(/\./g, "\\.");
            _.each(
                error[name],
                function (msg) {
                    this.showError(this.customizeMessage(msg, input), input);
                }.bind(this)
            );
        }
        if (!no_recurse) {
            _.each(
                $(input).data("pat-validation-refs") || [],
                _.partial(this.validateElement.bind(this), _, true)
            );
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
            this.$inputs.off("change.pat-validation");
            this.$el.off("submit.pat-validation");
            this.$el.off("pat-update.pat-validation");
            this.init();
            if (data.pattern == "clone" && data.action == "remove") {
                this.validateForm(ev);
            }
        }
        return true;
    },

    findErrorMessages: function (el) {
        var $el = $(el),
            selector = "em.validation.message",
            $messages = $el.next(selector);
        if ($el.is("[type=radio],[type=checkbox]")) {
            var $fieldset = $el.closest("fieldset.pat-checklist");
            if ($fieldset.length) $messages = $fieldset.find(selector);
        }
        return $messages;
    },

    removeError: function (input) {
        var $errors = this.findErrorMessages(input);
        this.errors = this.errors - $errors.length;
        $errors.remove();
        utils
            .findRelatives(input)
            .removeClass("is-invalid")
            .addClass("is-valid");
        if (this.errors < 1 && this.options.disableSelector) {
            $(this.options.disableSelector)
                .prop("disabled", false)
                .removeClass("disabled");
        }
    },

    showError: function (error, input) {
        var $el = $(input),
            $relatives = utils.findRelatives(input),
            $position = $el,
            strategy = "after",
            $message = $("<em/>", { class: "validation warning message" }),
            $fieldset;
        if ($el.is("[type=radio],[type=checkbox]")) {
            $fieldset = $el.closest("fieldset.pat-checklist");
            if ($fieldset.length) {
                $position = $fieldset;
                strategy = "append";
            }
        }
        this.removeError(input);
        $message.text(error);
        switch (strategy) {
            case "append":
                $message.appendTo($position);
                break;
            case "after":
                $message.insertAfter($position);
                break;
        }
        $relatives.removeClass("is-valid").addClass("is-invalid");
        this.errors += 1;
        if (this.options.disableSelector) {
            $(this.options.disableSelector)
                .prop("disabled", true)
                .addClass("disabled");
        }
        $position.trigger("pat-update", { pattern: "validation" });
    },
});
