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
            events.add_event_listener(
                input,
                "change",
                `pat-depends--change--${this.uuid}`, // We need to support multiple events per dependant ...
                this.set_state.bind(this)
            );
            events.add_event_listener(
                input,
                "keyup",
                `pat-depends--keyup--${this.uuid}`, // ... therefore we need to add a uuid to the event id ...
                this.set_state.bind(this)
            );

            if (input.form) {
                events.add_event_listener(
                    input.form,
                    "reset",
                    `pat-depends--reset--${this.uuid}`, // ... to not override previously set event handlers.
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
            input.disabled = false;
        }
        if (this.el.tagName === "A") {
            events.remove_event_listener(this.el, "pat-depends--click");
        }
        this.el.classList.remove("disabled");
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
            input.disabled = true;
        }
        if (this.el.tagName === "A") {
            events.add_event_listener(this.el, "click", "pat-depends--click", (e) =>
                e.preventDefault()
            );
        }
        this.el.classList.add("disabled");
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
