// Patterns validate - Form vlidation
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";
import events from "../../core/events";
import logging from "../../core/logging";
import utils from "../../core/utils";

const log = logging.getLogger("pat-validation");
//log.setLevel(logging.Level.DEBUG);

export const parser = new Parser("validation");
parser.addArgument("disable-selector", null); // Elements which must be disabled if there are errors
parser.addArgument("message-date", ""); // "This value must be a valid date");
parser.addArgument("message-datetime", ""); // "This value must be a valid date and time");
parser.addArgument("message-email", ""); // "This value must be a valid email address");
parser.addArgument("message-max", ""); // "This value must be less than or equal to %{count}");
parser.addArgument("message-min", ""); // "This value must be greater than or equal to %{count}"); // prettier-ignore
parser.addArgument("message-number", ""); // "This value must be a number");
parser.addArgument("message-required", ""); // "This field is required");
parser.addArgument("message-equality", "is not equal to %{attribute}.");
parser.addArgument("not-after", null);
parser.addArgument("not-before", null);
parser.addArgument("equality", null);
parser.addArgument("delay", 100); // Delay before validation is done to avoid validating while typing.

// BBB
// TODO: deprecated. Will be removed with next major version.
parser.addAlias("message-integer", "message-number");

const KEY_ERROR_EL = "__patternslib__input__error__el";
const KEY_ERROR_MSG = "__patternslib__input__error__msg";

export default Base.extend({
    name: "validation",
    trigger: "form.pat-validation",

    init() {
        this.options = parser.parse(this.el, this.options);
        this.inputs = this.el.querySelectorAll(
            "input[name], select[name], textarea[name]"
        );

        for (const [cnt, input] of this.inputs.entries()) {
            // Cancelable debouncer.
            const debouncer = utils.debounce((e) => {
                this.check_input(input, e);
            }, this.options.delay);

            events.add_event_listener(
                input,
                "input",
                `pat-validation--input-${input.name}--${cnt}--validator`,
                (e) => debouncer(e)
            );
            events.add_event_listener(
                input,
                "change",
                `pat-validation--change-${input.name}--${cnt}--validator`,
                (e) => debouncer(e)
            );
            events.add_event_listener(
                input,
                "blur",
                `pat-validation--blur-${input.name}--${cnt}--validator`,
                (e) => debouncer(e)
            );
            events.add_event_listener(
                this.el,
                "submit",
                `pat-validation--blur-${input.name}--${cnt}--validator`,
                (e) => this.check_input(input, e) // immediate check with submit. Otherwise submit is not cancelable.
            );
        }
    },

    check_input(input, e) {
        if (input.disabled) {
            // No need to check disabled inputs.
            return;
        }
        const input_options = parser.parse(input);

        // In any case, clear the custom validity first.
        this.set_validity({ input: input, msg: "" });
        const validity_state = input.validity;

        log.debug(`
            validity_state.badInput ${validity_state.badInput}
            validity_state.customError ${validity_state.customError}
            validity_state.patternMismatch ${validity_state.patternMismatch}
            validity_state.rangeOverflow ${validity_state.rangeOverflow}
            validity_state.rangeUnderflow ${validity_state.rangeUnderflow}
            validity_state.stepMismatch ${validity_state.stepMismatch}
            validity_state.tooLong ${validity_state.tooLong}
            validity_state.tooShort ${validity_state.tooShort}
            validity_state.typeMismatch ${validity_state.typeMismatch}
            validity_state.valid ${validity_state.valid}
            validity_state.valueMissing ${validity_state.valueMissing}
        `);

        if (validity_state.valid) {
            // Custom error cases or no invalid state.

            if (
                input_options.equality &&
                this.el.querySelector(`[name=${input_options.equality}]`)?.value !==
                    input.value
            ) {
                const message =
                    input_options.message.equality ||
                    `The value is not equal to %{attribute}`;
                this.set_validity({
                    input: input,
                    msg: message,
                    attribute: input_options.equality,
                });
            } else if (input_options.not.after || input_options.not.before) {
                const msg = input_options.message.date || input_options.message.datetime;

                let not_after;
                let not_before;
                const date = new Date(input.value);
                if (isNaN(date)) {
                    // Should not happen or input only partially typed in.
                    return;
                }
                if (input_options.not.after) {
                    // Handle value as date.
                    not_after = new Date(input_options.not.after);
                    if (isNaN(not_after)) {
                        // Handle value as selector
                        not_after = document.querySelector(
                            input_options.not.after
                        )?.value;
                        not_after =
                            not_after &&
                            new Date(
                                document.querySelector(input_options.not.after).value
                            );
                    }

                    // Use null if no valid date.
                    not_after = isNaN(not_after) ? null : not_after;
                }
                if (input_options.not.before) {
                    // Handle value as date.
                    not_before = new Date(input_options.not.before);
                    if (isNaN(not_before)) {
                        // Handle value as selector
                        not_before = document.querySelector(
                            input_options.not.before
                        )?.value;
                        not_before =
                            not_before &&
                            new Date(
                                document.querySelector(input_options.not.before).value
                            );
                    }

                    // Use null if no valid date.
                    not_before = isNaN(not_before) ? null : not_before;
                }
                if (not_after && date > not_after) {
                    this.set_validity({ input: input, msg: msg });
                } else if (not_before && date < not_before) {
                    this.set_validity({ input: input, msg: msg });
                }
            }

            if (!validity_state.customError) {
                // No error to handle. Return.
                this.remove_error(input, true);
                return;
            }
        } else {
            // Default error cases with custom messages.

            if (validity_state.valueMissing && input_options.message.required) {
                this.set_validity({ input: input, msg: input_options.message.required });
            } else if (validity_state.rangeUnderflow && input_options.message.min) {
                this.set_validity({
                    input: input,
                    msg: input_options.message.min,
                    min: input.getAttribute("min"),
                });
            } else if (validity_state.rangeOverflow && input_options.message.max) {
                this.set_validity({
                    input: input,
                    msg: input_options.message.max,
                    max: input.getAttribute("max"),
                });
            } else if (
                (validity_state.badInput || validity_state.stepMismatch) &&
                input.type === "number" &&
                input_options.message.number
            ) {
                this.set_validity({ input: input, msg: input_options.message.number });
            } else if (
                validity_state.typeMismatch &&
                input.type === "email" &&
                input_options.message.email
            ) {
                this.set_validity({ input: input, msg: input_options.message.email });
            } else if (
                validity_state.rangeUnderflow &&
                input.type === "date" &&
                input_options.message.date
            ) {
                this.set_validity({ input: input, msg: input_options.message.date });
            } else if (
                validity_state.rangeOverflow &&
                input.type === "date" &&
                input_options.message.date
            ) {
                this.set_validity({ input: input, msg: input_options.message.date });
            } else if (
                validity_state.rangeUnderflow &&
                input.type === "datetime" &&
                input_options.message.datetime
            ) {
                this.set_validity({ input: input, msg: input_options.message.datetime });
            } else if (
                validity_state.rangeOverflow &&
                input.type === "datetime" &&
                input_options.message.datetime
            ) {
                this.set_validity({ input: input, msg: input_options.message.datetime });
            }
        }

        if (e.type === "submit") {
            // Do not submit in error case.
            e.preventDefault();
        }
        this.set_error_message(input, input_options);
    },

    set_validity({ input, msg, attribute = null, min = null, max = null }) {
        // Replace some variables, as like validate.js
        if (attribute) {
            msg = msg.replace(/%{attribute}/g, attribute);
        }
        if (min) {
            msg = msg.replace(/%{count}/g, min);
        }
        if (max) {
            msg = msg.replace(/%{count}/g, max);
        }
        msg = msg.replace(/%{value}/g, JSON.stringify(input.value));

        input.setCustomValidity(msg);
        // Store the error message on the input.
        // Hidden inputs do not participate in validation but we need this
        // (e.g. styled date input).
        input[KEY_ERROR_MSG] = msg;
    },

    remove_error(input, all_of_group = false) {
        // Remove error message and related referencesfrom input.

        let inputs = [input];
        if (all_of_group) {
            // Get all inputs with the same name - e.g. radio buttons, checkboxes.
            inputs = [...this.inputs].filter((it) => it.name === input.name);
        }
        for (const it of inputs) {
            const msg_el = it[KEY_ERROR_EL];
            it[KEY_ERROR_EL] = null;
            msg_el?.remove();
        }

        // disable selector
        if (this.options.disableSelector && this.el.checkValidity()) {
            const disabled = document.querySelectorAll(this.options.disableSelector);
            for (const it of disabled) {
                it.removeAttribute("disabled");
                it.classList.remove("disabled");
            }
        }
    },

    set_error_message(input, options) {
        this.remove_error(input);

        // Do not set a error message for a input group like radio buttons or
        // checkboxes where one has already been set.
        const inputs = [...this.inputs].filter((it) => it.name === input.name);
        if (inputs.length > 1 && inputs.some((it) => !!it[KEY_ERROR_EL])) {
            // error message for input group already set.
            return;
        }

        const msg_el = document.createElement("em");
        msg_el.setAttribute("class", "validation warning message");
        msg_el.textContent = input.validationMessage || input[KEY_ERROR_MSG];

        let fieldset;
        if (input.type === "radio" || input.type === "checkbox") {
            fieldset = input.closest("fieldset.pat-checklist");
        }
        if (fieldset) {
            fieldset.append(msg_el);
        } else {
            input.after(msg_el);
        }
        input[KEY_ERROR_EL] = msg_el;

        if (options.disableSelector) {
            const disabled = document.querySelectorAll(options.disableSelector);
            for (const it of disabled) {
                it.setAttribute("disabled", "");
                it.classList.add("disabled");
            }
        }
        $(input).trigger("pat-update", { pattern: "validation" });
    },
});
