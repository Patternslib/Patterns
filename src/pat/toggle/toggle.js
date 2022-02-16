/**
 * Patterns toggle - toggle class on click
 *
 * Copyright 2012-2014 Simplon B.V. - Wichert Akkerman
 */
import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import store from "../../core/store";

const log = logging.getLogger("pat.toggle");

export const parser = new Parser("toggle");
parser.addArgument("selector");
parser.addArgument("event");
parser.addArgument("attr", "class");
parser.addArgument("value");
parser.addArgument("store", "none", ["none", "session", "local"]);

export function ClassToggler(values) {
    this.values = values.slice(0);
    if (this.values.length > 1) this.values.push(values[0]);
}

ClassToggler.prototype = {
    toggle(el) {
        const current = this.get(el);
        const next = this.next(current);
        this.set(el, next);
        return next;
    },

    get(el) {
        const classes = el.className.split(/\s+/);
        for (const value of this.values) {
            if (classes.indexOf(value) !== -1) {
                return value;
            }
        }
        return null;
    },

    set(el, value) {
        const values = this.values;
        let classes = el.className.split(/\s+/);
        classes = classes.filter((it) => it && values.indexOf(it) === -1);
        if (value) {
            classes.push(value);
        }
        el.className = classes.join(" ");
        $(el).trigger("pat-update", { pattern: "toggle" });
    },

    next(current) {
        if (this.values.length === 1) {
            return current ? null : this.values[0];
        }
        for (let i = 0; i < this.values.length - 1; i++) {
            if (this.values[i] === current) {
                return this.values[i + 1];
            }
        }
        return this.values[0];
    },
};

export function AttributeToggler(attribute) {
    this.attribute = attribute;
}

AttributeToggler.prototype = new ClassToggler([]);
AttributeToggler.prototype.get = function (el) {
    return !!el[this.attribute];
};

AttributeToggler.prototype.set = function (el, value) {
    if (value) el[this.attribute] = value;
    else el.removeAttribute(this.attribute);
};

AttributeToggler.prototype.next = function (value) {
    return !value;
};

export default Base.extend({
    name: "toggle",
    trigger: ".pat-toggle",

    init() {
        const options = this._validateOptions(parser.parse(this.$el, true));
        this.options = options;

        if (!options.length) {
            return;
        }

        let event_name;
        for (const option of options) {
            if (option.value_storage) {
                const victims = $(option.selector);
                if (!victims.length) {
                    continue;
                }
                const state = option.toggler.get(victims[0]);
                const last_state = option.value_storage.get();
                if (state !== last_state && last_state !== null) {
                    for (const victim of victims) {
                        option.toggler.set(victim, last_state);
                    }
                }
            }
            if (option.event) {
                event_name = option.event;
            } else {
                event_name = "click";
            }
        }

        this.$el
            .off(".toggle")
            .on(`${event_name || "click"}.toggle`, this._onClick.bind(this))
            .on("keypress.toggle", this._onKeyPress.bind(this));
    },

    _makeToggler(option) {
        if (option.attr === "class") {
            let values = option.value.split(/\s+/);
            values = values.filter((v) => v.length);
            return new ClassToggler(values);
        } else {
            return new AttributeToggler(option.attr);
        }
    },

    _validateOptions(options) {
        const correct = [];

        if (!options.length) {
            return correct;
        }

        for (const [idx, option] of options.entries()) {
            if (!option.selector) {
                log.error("Toggle pattern requires a selector.");
                continue;
            }
            if (option.attr !== "class" && option.value) {
                log.warn("Values are not supported attributes other than class.");
                continue;
            }
            if (option.attr === "class" && !option.value) {
                log.error("Toggle pattern needs values for class attributes.");
                continue;
            }
            if (idx && option.store !== "none") {
                log.warn("store option can only be set on first argument");
                option.store = "none";
            }
            if (option.store !== "none") {
                if (!this.el.id) {
                    log.warn("state persistance requested, but element has no id");
                    option.store = "none";
                } else if (!store.supported) {
                    log.warn(
                        "state persistance requested, but browser does not support webstorage"
                    );
                    option.store = "none";
                } else {
                    const storage = (
                        option.store === "local" ? store.local : store.session
                    )(this.name);
                    option.value_storage = new store.ValueStorage(
                        storage,
                        `${this.el.id}-${idx}`
                    );
                }
            }
            option.toggler = this._makeToggler(option);
            correct.push(option);
        }
        return correct;
    },

    _onClick() {
        let updated = false;

        for (const option of this.options) {
            const victims = $(option.selector);
            if (!victims.length) {
                continue;
            }
            const toggler = option.toggler;
            const next_state = toggler.toggle(victims[0]);
            for (let j = 1; j < victims.length; j++) {
                toggler.set(victims[j], next_state);
            }
            if (option.value_storage) {
                option.value_storage.set(next_state);
            }
            updated = true;
        }
        if (updated) {
            // XXX: Is this necessary? pat-update gets called on changed
            // element above.
            this.$el.trigger("pat-update", { pattern: "toggle" });
        }
        event.preventDefault();
    },

    _onKeyPress(event) {
        const keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode === "13") {
            this.$el.trigger("click");
        }
    },
});
