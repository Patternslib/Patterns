import $ from "jquery";
import Base from "../../core/base";
import utils from "../../core/utils";
import logging from "../../core/logging";
import Parser from "../../core/parser";

// Lazy loading modules.
let DependsHandler;

const log = logging.getLogger("depends");
const parser = new Parser("depends");

parser.addArgument("condition");
parser.addArgument("action", "show", ["show", "enable", "both"]);
parser.addArgument("transition", "none", ["none", "css", "fade", "slide"]);
parser.addArgument("effect-duration", "fast");
parser.addArgument("effect-easing", "swing");

export default Base.extend({
    name: "depends",
    trigger: ".pat-depends",
    jquery_plugin: true,

    async init($el, opts) {
        DependsHandler = await import("../../lib/dependshandler");
        DependsHandler = DependsHandler.default;

        const dependent = this.$el[0];
        const options = parser.parse(this.$el, opts);
        this.$modal = this.$el.parents(".pat-modal");

        let handler;
        try {
            handler = new DependsHandler(this.$el, options.condition);
        } catch (e) {
            log.error("Invalid condition: " + e.message, dependent);
            return;
        }

        let state = handler.evaluate();
        switch (options.action) {
            case "show":
                utils.hideOrShow($el, state, options, this.name);
                this.updateModal();
                break;
            case "enable":
                if (state) this.enable();
                else this.disable();
                break;
            case "both":
                if (state) {
                    utils.hideOrShow($el, state, options, this.name);
                    this.updateModal();
                    this.enable();
                } else {
                    utils.hideOrShow($el, state, options, this.name);
                    this.updateModal();
                    this.disable();
                }
                break;
        }

        const data = {
            handler: handler,
            options: options,
            dependent: dependent,
        };

        for (let input of handler.getAllInputs()) {
            if (input.form) {
                let $form = $(input.form);
                let dependents = $form.data("patDepends.dependents");
                if (!dependents) {
                    dependents = [data];
                    $form.on("reset.pat-depends", () => this.onReset);
                } else if (dependents.indexOf(data) === -1)
                    dependents.push(data);
                $form.data("patDepends.dependents", dependents);
            }
            $(input).on(
                "change.pat-depends",
                null,
                data,
                this.onChange.bind(this)
            );
            $(input).on(
                "keyup.pat-depends",
                null,
                data,
                this.onChange.bind(this)
            );
        }
    },

    async onReset(event) {
        const dependents = $(event.target).data("patDepends.dependents");
        await utils.timeout(50);
        for (let dependent of dependents) {
            event.data = dependent;
            this.onChange(event);
        }
    },

    updateModal() {
        // If we're in a modal, make sure that it gets resized.
        if (this.$modal.length) {
            $(document).trigger("pat-update", { pattern: "depends" });
        }
    },

    enable() {
        if (this.$el.is(":input")) {
            this.$el[0].disabled = null;
        } else if (this.$el.is("a")) {
            this.$el.off("click.patternDepends");
        }
        if (this.$el.hasClass("pat-autosuggest")) {
            this.$el
                .findInclusive("input.pat-autosuggest")
                .trigger("pat-update", {
                    pattern: "depends",
                    enabled: true,
                });
        }
        this.$el.removeClass("disabled");
    },

    disable() {
        if (this.$el.is(":input")) {
            this.$el[0].disabled = "disabled";
        } else if (this.$el.is("a")) {
            this.$el.on("click.patternDepends", (e) => e.preventDefault());
        }
        if (this.$el.hasClass("pat-autosuggest")) {
            this.$el
                .findInclusive("input.pat-autosuggest")
                .trigger("pat-update", {
                    pattern: "depends",
                    enabled: false,
                });
        }
        this.$el.addClass("disabled");
    },

    onChange(event) {
        const handler = event.data.handler;
        const options = event.data.options;
        const dependent = event.data.dependent;
        const $depdendent = $(dependent);
        const state = handler.evaluate();

        switch (options.action) {
            case "show":
                utils.hideOrShow($depdendent, state, options, this.name);
                this.updateModal();
                break;
            case "enable":
                if (state) {
                    this.enable();
                } else {
                    this.disable();
                }
                break;
            case "both":
                utils.hideOrShow($depdendent, state, options, this.name);
                this.updateModal();
                if (state) {
                    this.enable();
                } else {
                    this.disable();
                }
                break;
        }
    },
});
