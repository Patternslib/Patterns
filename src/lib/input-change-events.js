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
            console.log("1");
            this.registerHandlersForElement({ trigger_source: el, trigger_target: el });
        } else {
            // We've been given an element that is not a form input. We
            // therefore assume that it's a container of form inputs and
            // register handlers for its children.
            console.log("2");
            const form = el.closest("form");
            for (const _el of form.elements) {
                console.log("3", _el);
                // Search for all form elements, also those outside the form
                // container.
                if (!dom.is_input(_el)) {
                    // form.elements also catches fieldsets, object, output,
                    // which we do not want to handle here.
                    continue;
                }
                this.registerHandlersForElement({
                    trigger_source: _el,
                    trigger_target: form,
                });
            }
        }
    },

    registerHandlersForElement({ trigger_source, trigger_target }) {
        const $trigger_source = $(trigger_source);
        const $trigger_target = $(trigger_target);
        const isNumber = trigger_source.matches("input[type=number]");
        const isText = trigger_source.matches(
            "input:not(type), input[type=text], input[type=search], textarea"
        );

        if (isNumber) {
            // for number inputs we want to trigger the change on keyup
            $trigger_source.on("keyup." + namespace, function () {
                log.debug("translating keyup");
                $trigger_target.trigger("input-change");
            });
        }
        if (isText || isNumber) {
            $trigger_source.on("input." + namespace, function () {
                log.debug("translating input");
                $trigger_target.trigger("input-change");
            });
        } else {
            $trigger_source.on("change." + namespace, function () {
                log.debug("translating change");
                $trigger_target.trigger("input-change");
            });
        }

        $trigger_source.on("blur", function () {
            $trigger_target.trigger("input-defocus");
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
