/**
 * Patterns depends - show/hide/disable content based on form status
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012-2013 Simplon B.V. - Wichert Akkerman
 */

import $ from "jquery";
import Base from "../../core/base";
import utils from "../../core/utils";
import logging from "../../core/logging";
import Parser from "../../core/parser";

// Lazy loading modules.
let DependsHandler;

var log = logging.getLogger("depends"),
    parser = new Parser("depends");

parser.addArgument("condition");
parser.addArgument("action", "show", ["show", "enable", "both"]);
parser.addArgument("transition", "none", ["none", "css", "fade", "slide"]);
parser.addArgument("effect-duration", "fast");
parser.addArgument("effect-easing", "swing");

export default Base.extend({
    name: "depends",
    trigger: ".pat-depends",
    jquery_plugin: true,

    transitions: {
        none: { hide: "hide", show: "show" },
        fade: { hide: "fadeOut", show: "fadeIn" },
        slide: { hide: "slideUp", show: "slideDown" },
    },

    async init($el, opts) {
        const depdendent = this.$el[0];
        const options = parser.parse(this.$el, opts);
        let handler;
        let state;
        this.$modal = this.$el.parents(".pat-modal");

        DependsHandler = await import("../../lib/dependshandler");
        DependsHandler = DependsHandler.default;

        try {
            handler = new DependsHandler(this.$el, options.condition);
        } catch (e) {
            log.error("Invalid condition: " + e.message, depdendent);
            return;
        }

        state = handler.evaluate();
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

        var data = {
            handler: handler,
            options: options,
            depdendent: depdendent,
        };

        for (let input of handler.getAllInputs()) {
            if (input.form) {
                var $form = $(input.form);
                var depdendents = $form.data("patDepends.depdendents");
                if (!depdendents) {
                    depdendents = [data];
                    $form.on("reset.pat-depends", this.onReset.bind(this));
                } else if (depdendents.indexOf(data) === -1)
                    depdendents.push(data);
                $form.data("patDepends.depdendents", depdendents);
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

    onReset(event) {
        const depdendents = $(event.target).data("patDepends.depdendents");
        setTimeout(() => {
            for (let depdendent of depdendents) {
                event.data = depdendent;
                this.onChange(event);
            }
        }, 50);
    },

    updateModal() {
        /* If we're in a modal, make sure that it gets resized.
         */
        if (this.$modal.length) {
            $(document).trigger("pat-update", { pattern: "depends" });
        }
    },

    enable() {
        if (this.$el.is(":input")) this.$el[0].disabled = null;
        else if (this.$el.is("a")) this.$el.off("click.patternDepends");
        else if (this.$el.hasClass("pat-autosuggest")) {
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
        if (this.$el.is(":input")) this.$el[0].disabled = "disabled";
        else if (this.$el.is("a"))
            this.$el.on("click.patternDepends", this.blockDefault);
        else if (this.$el.hasClass("pat-autosuggest")) {
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
        var handler = event.data.handler,
            options = event.data.options,
            depdendent = event.data.depdendent,
            $depdendent = $(depdendent),
            state = handler.evaluate();

        switch (options.action) {
            case "show":
                utils.hideOrShow($depdendent, state, options, this.name);
                this.updateModal();
                break;
            case "enable":
                if (state) this.enable();
                else this.disable();
                break;
            case "both":
                utils.hideOrShow($depdendent, state, options, this.name);
                this.updateModal();
                if (state) this.enable();
                else this.disable();
                break;
        }
    },

    blockDefault(event) {
        event.preventDefault();
    },
});
