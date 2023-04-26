// helper functions to make all input elements
import $ from "jquery";
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

        if (!patterns.length) {
            log.debug("installing handlers");
            _.setupInputHandlers($el);

            $el.on("patterns-injected." + namespace, function (event) {
                _.setupInputHandlers($(event.target));
            });
        }
        if (patterns.indexOf(pat) === -1) {
            patterns.push(pat);
            $el.data(namespace, patterns);
        }
    },

    setupInputHandlers($el) {
        if ($el.is(":input")) {
            // The element itself is an input, se we simply register a
            // handler fot it.
            _.registerHandlersForElement.bind($el)();
        } else {
            // We've been given an element that is not a form input. We
            // therefore assume that it's a container of form inputs and
            // register handlers for its children.
            for (const _el of $el[0].closest("form").elements) {
                // Search for all form elements, also those outside the form
                // container.
                _.registerHandlersForElement.bind(_el)();
            }
        }
    },

    registerHandlersForElement() {
        let el_within_form = true;
        const $form = $(this.form);
        if (this.closest("form") !== this.form) {
            el_within_form = false;
        }

        const $el = $(this);
        const isNumber = $el.is("input[type=number]");
        const isText = $el.is("input:text, input[type=search], textarea");

        if (isNumber) {
            // for <input type="number" /> we want to trigger the change
            // on keyup
            if ("onkeyup" in window) {
                $el.on("keyup." + namespace, function () {
                    log.debug("translating keyup");
                    (el_within_form ? $el : $form).trigger("input-change");
                });
            }
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
