// Patterns switch - toggle classes on click
import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";
import logging from "../../core/logging";
import registry from "../../core/registry";
import store from "../../core/store";
import utils from "../../core/utils";

var log = logging.getLogger("pat.switch"),
    parser = new Parser("switch");

parser.addArgument("selector");
parser.addArgument("remove");
parser.addArgument("add");
parser.addArgument("store", "none", ["none", "session", "local"]);

export default Base.extend({
    name: "switch",
    trigger: ".pat-switch",
    jquery_plugin: true,

    init($el, defaults) {
        this.options = parser.parse(this.el, this.options, false);
        this.options = this._validateOptions(this.options);
        if (!this.options.length) {
            return;
        }
        this.$el
            .data("patternSwitch", this.options)
            .off(".patternSwitch")
            .on("click.patternSwitch", (e) => this._onClick(e));
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.store !== "none") {
                option._storage = (option.store === "local"
                    ? store.local
                    : store.session)("switch");
                var state = option._storage.get(option.selector);
                if (
                    state &&
                    state.remove === option.remove &&
                    state.add === option.add
                )
                    switcher._update(option.selector, state.remove, state.add);
            }
        }
    },

    destroy($el) {
        return $el.each(function () {
            $(this).removeData("patternSwitch").off("click.patternSwitch");
        });
    },

    // jQuery API to toggle a switch
    execute($el) {
        return $el.each(function () {
            switcher._go($(this));
        });
    },

    _onClick(e) {
        if ($(e.currentTarget).is("a")) {
            e.preventDefault();
        }
        this._go();
    },

    _go() {
        for (const option of this.options) {
            this._update(option.selector, option.remove, option.add);
            if (option._storage) {
                option._storage.set(option.selector, {
                    remove: option.remove,
                    add: option.add,
                });
            }
        }
        $trigger.trigger("resize");
    },

    _validateOptions(options) {
        var correct = [];

        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.selector && (option.remove || option.add)) {
                correct.push(option);
            } else {
                log.error(
                    "Switch pattern requires selector and one of add or remove."
                );
            }
        }
        return correct;
    },

    _update(selector, remove, add) {
        var $targets = $(selector);

        if (!$targets.length) return;

        if (remove) utils.removeWildcardClass($targets, remove);
        if (add) $targets.addClass(add);
        $targets.trigger("pat-update", { pattern: "switch" });
    },
});
