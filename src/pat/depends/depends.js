import $ from "jquery";
import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import events from "../../core/events";
import dom from "../../core/dom";
import logging from "../../core/logging";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";

const log = logging.getLogger("depends");

export const parser = new Parser("depends");
parser.addArgument("condition");
parser.addArgument("action", "show", ["show", "enable", "both"]);
parser.addArgument("transition", "none", ["none", "css", "fade", "slide"]);
parser.addArgument("effect-duration", "fast");
parser.addArgument("effect-easing", "swing");


// A custom input event which differs from the one in `core/events` in that it
// accepts a `detail` object to pass arbitrary information around.
// TODO: The events in `core/events` should be refactored to accept a `detail`
// object.
const input_event = (detail = {}) => {
    return new CustomEvent("input", {
        bubbles: true,
        cancelable: false,
        detail: detail,
    });
};


class Pattern extends BasePattern {
    static name = "depends";
    static trigger = ".pat-depends";
    static parser = parser;

    async init() {
        this.$el = $(this.el);
        const DependsHandler = (await import("../../lib/dependshandler")).default; // prettier-ignore

        try {
            this.handler = new DependsHandler(this.el, this.options.condition);
        } catch (e) {
            log.error("Invalid condition: " + e.message, this.el);
            return;
        }

        // Initialize
        this.set_state();

        for (const input of this.handler.getAllInputs()) {
            // Note: One input can be a dependency for multiple other dependent
            // elements. Therefore we need to bind the events not uniquely and
            // add a uuid to the event bindings id.

            events.add_event_listener(
                input,
                "input",
                `pat-depends--input--${this.uuid}`,
                (e) => {
                    if (e?.detail?.pattern_uuid === this.uuid) {
                        // Ignore input events invoked from this pattern
                        // instance to avoid infinite loops.
                        return;
                    }
                    this.set_state();
                }
            );

            if (input.form) {
                events.add_event_listener(
                    input.form,
                    "reset",
                    `pat-depends--reset--${this.uuid}`,
                    async () => {
                        // TODO: note sure, what this timeout is for.
                        await utils.timeout(50);
                        this.set_state.bind(this);
                    }
                );
            }
        }
    }

    update_modal() {
        const modal = this.el.closest(".pat-modal");

        // If we're in a modal, make sure that it gets resized.
        if (modal) {
            $(document).trigger("pat-update", { pattern: "depends" });
        }
    }

    enable() {
        const inputs = dom.find_inputs(this.el);
        for (const input of inputs) {
            if (input.disabled === false) {
                // Do not re-enable an already enabled input.
                continue;
            }

            // Now, enable the input element.
            input.disabled = false;

            if (input === this.el) {
                // Do not re-trigger this pattern on it's own element to avoid
                // infinite loops.
                continue;
            }

            if (dom.is_button(input)) {
                // Do not trigger the input event on buttons as they do not
                // support it.
                continue;
            }

            // Trigger the input after enabling so that any other bound
            // actions can react on that.
            input.dispatchEvent(input_event({ pattern_uuid: this.uuid }));
        }

        // Restore the original click behavior for anchor elements.
        if (this.el.tagName === "A") {
            events.remove_event_listener(this.el, "pat-depends--click");
        }

        // Remove the disabled class from the element.
        this.el.classList.remove("disabled");

        // Trigger the pat-update event to notify other patterns about enabling.
        this.$el.trigger("pat-update", {
            pattern: "depends",
            action: "attribute-changed",
            dom: this.el,
            enabled: true,
        });
    }

    disable() {
        const inputs = dom.find_inputs(this.el);
        for (const input of inputs) {
            if (input.disabled === true) {
                // Do not re-disable an already disabled input.
                continue;
            }

            // Now, disable the input element.
            input.disabled = true;

            if (input === this.el) {
                // Do not re-trigger this pattern on it's own element to avoid
                // infinite loops.
                continue;
            }

            if (dom.is_button(input)) {
                // Do not trigger the input event on buttons as they do not
                // support it.
                continue;
            }

            // Trigger the input after disabling so that any other bound
            // actions can react on that.
            input.dispatchEvent(input_event({ pattern_uuid: this.uuid }));
        }

        // Prevent the default click behavior for anchor elements.
        if (this.el.tagName === "A") {
            events.add_event_listener(this.el, "click", "pat-depends--click", (e) =>
                e.preventDefault()
            );
        }

        // Add the disabled class to the element.
        this.el.classList.add("disabled");

        // Trigger the pat-update event to notify other patterns about disabling.
        this.$el.trigger("pat-update", {
            pattern: "depends",
            action: "attribute-changed",
            dom: this.el,
            enabled: false,
        });
    }

    set_state() {
        const state = this.handler.evaluate();
        switch (this.options.action) {
            case "show":
                utils.hideOrShow(this.el, state, this.options, this.name);
                this.update_modal();
                break;
            case "enable":
                if (state) {
                    this.enable();
                } else {
                    this.disable();
                }
                break;
            case "both":
                utils.hideOrShow(this.el, state, this.options, this.name);
                this.update_modal();
                if (state) {
                    this.enable();
                } else {
                    this.disable();
                }
                break;
        }
    }
}

// Register Pattern class in the global pattern registry
registry.register(Pattern);

// Make it available
export default Pattern;
