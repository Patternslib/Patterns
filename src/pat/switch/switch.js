// Patterns switch - toggle classes on click
import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import store from "../../core/store";
import utils from "../../core/utils";
import dom from "../../core/dom";

const log = logging.getLogger("pat.switch");

export const parser = new Parser("switch");
parser.addArgument("selector");
parser.addArgument("remove");
parser.addArgument("add");
parser.addArgument("store", "none", ["none", "session", "local"]);

export default Base.extend({
    name: "switch",
    trigger: ".pat-switch",

    init() {
        this.options = this._validateOptions(parser.parse(this.el, this.options, true));
        if (!this.options.length) {
            log.error("Switch without options cannot be initialized.");
        }

        dom.add_event_listener(this.el, "click", "pat-switch--on-click", (e) => {
            if (e.tagName === "A") {
                e.preventDefault();
            }
            this._go();
        });

        for (const option of this.options) {
            if (option.store !== "none") {
                option._storage = (
                    option.store === "local" ? store.local : store.session
                )("switch");
                const state = option._storage.get(option.selector);
                if (state && state.remove === option.remove && state.add === option.add)
                    this._update(option.selector, state.remove, state.add);
            }
        }
    },

    destroy() {
        dom.remove_event_listener(this.el, "pat-switch--on-click");
    },

    execute() {
        // jQuery API to toggle a switch
        this._go();
    },

    _go() {
        for (const option of this.options) {
            this._update(option.selector, option.remove, option.add);
            if (option._storage)
                option._storage.set(option.selector, {
                    remove: option.remove,
                    add: option.add,
                });
        }
        $(this.el).trigger("resize"); // See: https://github.com/Patternslib/Patterns/pull/539
    },

    _validateOptions: function (options) {
        var correct = [];

        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.selector && (option.remove || option.add)) correct.push(option);
            else log.error("Switch pattern requires selector and one of add or remove.");
        }
        return correct;
    },

    _update: function (selector, remove, add) {
        const targets = document.querySelectorAll(selector);
        for (const target of targets) {
            if (remove) {
                utils.removeWildcardClass(target, remove);
            }

            if (add) {
                target.classList.add(add);
            }

            $(target).trigger("pat-update", { pattern: "switch" });
        }
    },
});
