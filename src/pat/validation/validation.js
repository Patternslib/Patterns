// Patterns validate - Form vlidation
import "../../core/polyfills"; // SubmitEvent.submitter for Safari < 15.4 and jsDOM
import $ from "jquery";
import { BasePattern } from "../../core/basepattern";
import Parser from "../../core/parser";
import dom from "../../core/dom";
import events from "../../core/events";
import logging from "../../core/logging";
import utils from "../../core/utils";
import registry from "../../core/registry";

const logger = logging.getLogger("pat-validation");
//logger.setLevel(logging.Level.DEBUG);

export const parser = new Parser("validation");
parser.addArgument("disable-selector", "[type=submit], button:not([type=button])"); // Elements which must be disabled if there are errors
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
parser.addArgument("error-template");

const KEY_ERROR_EL = "__patternslib__input__error__el";
const KEY_ERROR_MSG = "__patternslib__input__error__msg";

class Pattern extends BasePattern {
    static name = "validation";
    static trigger = "form.pat-validation";
    static parser = parser;

    init() {
        events.add_event_listener(
            this.el,
            "submit",
            `pat-validation--submit--validator`,
            (e) => {
                // On submit, check all.
                // Immediate, non-debounced check with submit. Otherwise submit
                // is not cancelable.
                for (const input of this.inputs) {
                    logger.debug("Checking input for submit", input, e);
                    this.check_input({ input: input, event: e });
                }
            }
        );

        this.initialize_inputs();
        $(this.el).on("pat-update", () => {
            this.initialize_inputs();
        });

        // Set ``novalidate`` attribute to disable the browser's validation
        // bubbles but not disable the validation API.
        this.el.setAttribute("novalidate", "");
    }

    initialize_inputs() {
        this.inputs = [
            ...this.el.querySelectorAll("input[name], select[name], textarea[name]"),
        ];
        this.disabled_elements = [
            ...this.el.querySelectorAll(this.options.disableSelector),
        ];

        for (const [cnt, input] of this.inputs.entries()) {
            // Cancelable debouncer.
            const debouncer = utils.debounce((e) => {
                logger.debug("Checking input for event", input, e);
                this.check_input({ input: input, event: e });
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
        }
    }

    check_input({ input, event, stop = false }) {
        if (input.disabled) {
            // No need to check disabled inputs.
            return;
        }

        // In any case, clear the custom validity first.
        this.set_validity({ input: input, msg: "" });
        const validity_state = input.validity;

        if (event?.submitter?.hasAttribute("formnovalidate")) {
            // Do not submit when a button with ``formnovalidate`` was used.
            return;
        }

        logger.debug(`
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

        const input_options = parser.parse(input);

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
                const msg_default_not_before = "The date must be after %{attribute}";
                const msg_default_not_after = "The date must be before %{attribute}";

                let not_after;
                let not_after_el;
                if (input_options.not.after) {
                    if (utils.is_iso_date_time(input_options.not.after, true)) {
                        not_after = new Date(input_options.not.after);
                    } else {
                        // Handle value as selector
                        not_after_el = document.querySelector(input_options.not.after);
                        not_after = not_after_el?.value
                            ? new Date(not_after_el?.value)
                            : undefined;
                    }

                    // Use null if no valid date.
                    not_after = isNaN(not_after) ? null : not_after;
                }

                let not_before;
                let not_before_el;
                if (input_options.not.before) {
                    if (utils.is_iso_date_time(input_options.not.before, true)) {
                        not_before = new Date(input_options.not.before);
                    } else {
                        // Handle value as selector
                        not_before_el = document.querySelector(input_options.not.before);
                        not_before = not_before_el?.value
                            ? new Date(not_before_el?.value)
                            : undefined;
                    }

                    // Use null if no valid date.
                    not_before = isNaN(not_before) ? null : not_before;
                }

                if (
                    input.value &&
                    utils.is_iso_date_time(input.value, true) &&
                    !isNaN(new Date(input.value))
                ) {
                    // That's 1 valid date!
                    const date = new Date(input.value);

                    if (not_after && date > not_after) {
                        let msg_attr;
                        // Try to construct a meaningfull error message
                        if (!not_after_el && input_options.not.after) {
                            // fixed date case
                            msg_attr = input_options.not.after;
                        } else {
                            // Get the label + other text content within the
                            // label and replace all whitespace and newlines
                            // with a single space.
                            msg_attr = not_after_el?.labels?.[0]?.textContent.replace(
                                /\s\s+/g, // replace all whitespace
                                " " // with a single space
                            );
                            msg_attr = msg_attr || not_after_el.name;
                        }
                        this.set_validity({
                            input: input,
                            msg: msg || msg_default_not_after,
                            attribute: msg_attr.trim(),
                        });
                    } else if (not_before && date < not_before) {
                        let msg_attr;
                        // Try to construct a meaningfull error message
                        if (!not_before_el && input_options.not.before) {
                            // fixed date case
                            msg_attr = input_options.not.before;
                        } else {
                            // Get the label + other text content within the
                            // label and replace all whitespace and newlines
                            // with a single space.
                            msg_attr = not_before_el?.labels?.[0]?.textContent.replace(
                                /\s\s+/g, // replace all whitespace
                                " " // with a single space
                            );
                            msg_attr = msg_attr || not_before_el.name;
                        }
                        this.set_validity({
                            input: input,
                            msg: msg || msg_default_not_before,
                            attribute: msg_attr.trim(),
                        });
                    }
                }

                // always check the other input to clear/set errors
                // do not re-check when stop is set to avoid infinite loops
                if (!stop && not_after_el) {
                    logger.debug("Check `not-after` input.", not_after_el);
                    this.check_input({ input: not_after_el, stop: true });
                }
                if (!stop && not_before_el) {
                    logger.debug("Check `no-before` input.", not_after_el);
                    this.check_input({ input: not_before_el, stop: true });
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

        if (event?.type === "submit") {
            // Do not submit in error case and prevent other handlers to take action.
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        this.set_error_message(input);
    }

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
    }

    remove_error(input, all_of_group = false) {
        // Remove error message and related referencesfrom input.

        let inputs = [input];
        if (all_of_group) {
            // Get all inputs with the same name - e.g. radio buttons, checkboxes.
            inputs = this.inputs.filter((it) => it.name === input.name);
        }
        for (const it of inputs) {
            const error_node = it[KEY_ERROR_EL];
            it[KEY_ERROR_EL] = null;
            error_node?.remove();
        }

        // disable selector
        if (this.el.checkValidity()) {
            for (const it of this.disabled_elements) {
                if (it.disabled) {
                    it.removeAttribute("disabled");
                    it.classList.remove("disabled");
                }
            }
        }
    }

    set_error_message(input) {
        this.remove_error(input);

        // Do not set a error message for a input group like radio buttons or
        // checkboxes where one has already been set.
        const inputs = this.inputs.filter((it) => it.name === input.name);
        if (inputs.length > 1 && inputs.some((it) => !!it[KEY_ERROR_EL])) {
            // error message for input group already set.
            return;
        }

        // Create the validation error DOM node from the template
        const validation_message = input.validationMessage || input[KEY_ERROR_MSG];
        const error_node = dom.create_from_string(
            this.error_template(validation_message)
        ).firstChild;

        let fieldset;
        if (input.type === "radio" || input.type === "checkbox") {
            fieldset = input.closest("fieldset.pat-checklist");
        }
        if (fieldset) {
            fieldset.append(error_node);
        } else {
            input.after(error_node);
        }
        input[KEY_ERROR_EL] = error_node;

        let did_disable = false;
        for (const it of this.disabled_elements) {
            if (!it.disabled) {
                did_disable = true;
                it.setAttribute("disabled", "disabled");
                it.classList.add("disabled");
                logger.debug("Disable element", it);
            }
        }

        // Do an initial check of the whole form when a form element (e.g. the
        // submit button) was disabled. We want to show the user all possible
        // errors at once and after the submit button is disabled there is no
        // way to check the whole form at once. ... well we also do not want to
        // check the whole form when one input was changed....
        if (did_disable) {
            logger.debug("Checking whole form after element was disabled.");
            for (const _input of this.inputs.filter((it) => it !== input)) {
                this.check_input({ input: _input, stop: true });
            }
        }
    }

    error_template(message) {
        // Template for the validation message
        return `<em class="validation warning message">${message}</em>`;
    }
}

registry.register(Pattern);

export default Pattern;
export { Pattern };
