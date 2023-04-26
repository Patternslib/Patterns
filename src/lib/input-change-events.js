// helper functions to make all input elements
import $ from "jquery";
import dom from "../core/dom";
import logging from "../core/logging";

const namespace = "input-change-events";
const log = logging.getLogger(namespace);

const _ = {
    setup($el, pat) {
        if (!pat) {
            log.error("The name of the calling pattern has to be set.");
            return;
        }

        // list of patterns that installed input-change-event handlers
        const patterns = $el.data(namespace) || [];
        log.debug("setup handlers for " + pat);

        const el = $el[0];

        if (!patterns.length) {
            log.debug("installing handlers");
            this.setupInputHandlers(el);

            $el.on("patterns-injected." + namespace, (event) => {
                this.setupInputHandlers(event.target);
            });
        }
        if (patterns.indexOf(pat) === -1) {
            patterns.push(pat);
            $el.data(namespace, patterns);
        }
    },

    setupInputHandlers(el) {
        if (dom.is_input(el)) {
            // The element itself is an input, se we simply register a
            // handler fot it.
            this.registerHandlersForElement(el);
        } else {
            // We've been given an element that is not a form input. We
            // therefore assume that it's a container of form inputs and
            // register handlers for its children.
            for (const _el of el.closest("form").elements) {
                // Search for all form elements, also those outside the form
                // container.
                if (!dom.is_input(_el)) {
                    // form.elements also catches fieldsets, object, output,
                    // which we do not want to handle here.
                    continue;
                }
                this.registerHandlersForElement(_el);
            }
        }
    },

    registerHandlersForElement(el) {
        let el_within_form = true;
        if (el.closest("form") !== el.form) {
            el_within_form = false;
        }

        const $el = $(el);
        const $form = $(el.form);
        const isNumber = el.matches("input[type=number]");
        const isText = el.matches(
            "input:not(type), input[type=text], input[type=search], textarea"
        );

        if (isNumber) {
            // for number inputs we want to trigger the change on keyup
            $el.on("keyup." + namespace, function () {
                log.debug("translating keyup");
                (el_within_form ? $el : $form).trigger("input-change");
            });
        }
        if (isText || isNumber) {
            $el.on("input." + namespace, function () {
                log.debug("translating input");
                (el_within_form ? $el : $form).trigger("input-change");
            });
        } else {
            $el.on("change." + namespace, function () {
                log.debug("translating change");
                (el_within_form ? $el : $form).trigger("input-change");
            });
        }

        $el.on("blur", function () {
            (el_within_form ? $el : $form).trigger("input-defocus");
        });
    },

    remove($el, pat) {
        let patterns = $el.data(namespace) || [];
        if (patterns.indexOf(pat) === -1) {
            log.warn("input-change-events were never installed for " + pat);
        } else {
            patterns = patterns.filter(function (e) {
                return e !== pat;
            });
            if (patterns.length) {
                $el.data(namespace, patterns);
            } else {
                log.debug("remove handlers");
                $el.removeData(namespace);
                $el.find(":input").off("." + namespace);
                $el.off("." + namespace);
            }
        }
    },
};

export default _;
