/**
 * Patterns bind - declarative data binding between DOM elements.
 *
 * A ``pat-bind`` element wires one or more of its accessors (a form value, an
 * attribute, its text or HTML content) to a named *channel*. Elements sharing a
 * channel stay in sync: change a source and every target updates.
 *
 * Bindings are reactive under the hood via ``core/signals``, but the page
 * author only ever writes markup - in the spirit of Patternslib.
 *
 * For usage, see documentation.md
 */
import { BasePattern } from "../../core/basepattern";
import { signal, effect } from "../../core/signals";
import Parser from "../../core/parser";
import dom from "../../core/dom";
import events from "../../core/events";
import logging from "../../core/logging";
import registry from "../../core/registry";

const log = logging.getLogger("pat-bind");

export const parser = new Parser("bind");
parser.addArgument("key"); // channel name
parser.addArgument("value"); // accessor: [attr], ::text, ::html or empty (inferred)
parser.addArgument("direction", null, ["source", "target", "both"]);

// Channel registry: maps a scope-root element to its named signals.
// A ``WeakMap`` so detached scope roots can be garbage collected.
const channel_registry = new WeakMap();

/**
 * Resolve the scope root for an element: the nearest ancestor (or itself)
 * marked with ``data-pat-bind-scope``, falling back to ``document``.
 */
function get_scope_root(el) {
    return el.closest("[data-pat-bind-scope]") || document;
}

/**
 * Get - lazily creating - the signal backing a channel within an element's
 * scope. Created on first use, so source/target order in the DOM is irrelevant.
 */
function get_channel(el, key) {
    const root = get_scope_root(el);
    let channels = channel_registry.get(root);
    if (!channels) {
        channels = new Map();
        channel_registry.set(root, channels);
    }
    let sig = channels.get(key);
    if (!sig) {
        sig = signal(undefined);
        channels.set(key, sig);
    }
    return sig;
}

/**
 * Turn an accessor string into a ``{ read, write, event, observe }`` descriptor.
 *
 * - ``read()``  reads the bound value off the element.
 * - ``write(v)`` writes a value onto the element.
 * - ``event``   native event to listen to for source updates (or ``null``).
 * - ``observe`` MutationObserver target for source updates (or ``null``).
 *
 * @param {Element} el - The bound element.
 * @param {string} accessor - The accessor string, possibly empty (inferred).
 * @param {function} sanitize - HTML sanitizer used for the ``::html`` accessor.
 */
function resolve_accessor(el, accessor, sanitize) {
    if (!accessor) {
        // Infer the accessor from the element type.
        if (dom.is_input(el)) {
            const type = (el.getAttribute("type") || "").toLowerCase();
            accessor = type === "checkbox" || type === "radio" ? "[checked]" : "[value]";
        } else {
            accessor = "::text";
        }
    }

    if (accessor === "::text") {
        return {
            read: () => el.textContent,
            write: (v) => {
                el.textContent = v ?? "";
            },
            event: null,
            observe: "content",
        };
    }

    if (accessor === "::html") {
        return {
            read: () => el.innerHTML,
            write: (v) => {
                el.innerHTML = sanitize(v ?? "");
            },
            event: null,
            observe: "content",
        };
    }

    const attr_match = accessor.match(/^\[\s*([a-z][a-z0-9_-]*)\s*\]$/i);
    if (attr_match) {
        const attr = attr_match[1];
        // For live form-control state, ``[value]`` and ``[checked]`` map to the
        // IDL property and the native ``input``/``change`` event, not to the
        // static attribute.
        const use_property = (attr === "value" || attr === "checked") && attr in el;
        if (use_property) {
            return {
                read: () => el[attr],
                write: (v) => {
                    el[attr] = attr === "checked" ? Boolean(v) : v ?? "";
                },
                event: attr === "checked" ? "change" : "input",
                observe: null,
            };
        }
        return {
            read: () => el.getAttribute(attr),
            write: (v) => {
                if (v === null || v === undefined || v === false) {
                    el.removeAttribute(attr);
                } else {
                    el.setAttribute(attr, String(v));
                }
            },
            event: null,
            observe: `attribute:${attr}`,
        };
    }

    log.error(`Invalid bind accessor: "${accessor}".`, el);
    return null;
}

/**
 * The MutationObserver config for a source accessor that has no native event.
 */
function mutation_config(observe) {
    if (observe === "content") {
        return { childList: true, characterData: true, subtree: true };
    }
    if (observe.startsWith("attribute:")) {
        return { attributes: true, attributeFilter: [observe.slice("attribute:".length)] };
    }
    return {};
}

/**
 * Default binding direction when not given explicitly: form controls bound to
 * their value/checked default to two-way, everything else to ``target``.
 */
function infer_direction(el, accessor) {
    if (dom.is_input(el) && accessor.event) {
        return "both";
    }
    return "target";
}

class Pattern extends BasePattern {
    static name = "bind";
    static trigger = ".pat-bind";
    static parser = parser;

    // One binding per ``&&``-separated config; ``this.options`` becomes an array.
    parser_multiple = true;
    // Each element defines its own bindings; do not inherit from ancestors.
    parser_inherit = false;

    async init() {
        this._disposers = []; // effect dispose functions
        this._observers = []; // MutationObservers
        this._listener_ids = []; // event listener ids, for cleanup

        const bindings = Array.isArray(this.options) ? this.options : [this.options];

        // Lazily load DOMPurify only when an ``::html`` accessor is in use.
        let sanitize = (v) => v;
        if (bindings.some((binding) => binding.value === "::html")) {
            const DOMPurify = (await import("dompurify")).default;
            sanitize = (v) => DOMPurify.sanitize(v ?? "");
        }

        for (const binding of bindings) {
            this.setup_binding(binding, sanitize);
        }
    }

    setup_binding(binding, sanitize) {
        const key = binding.key;
        if (!key) {
            log.warn("Ignoring a pat-bind binding without a `key`.", this.el);
            return;
        }

        const accessor = resolve_accessor(this.el, binding.value, sanitize);
        if (!accessor) {
            return;
        }

        const direction = binding.direction || infer_direction(this.el, accessor);
        const sig = get_channel(this.el, key);

        if (direction === "target" || direction === "both") {
            this.setup_target(sig, accessor);
        }
        if (direction === "source" || direction === "both") {
            this.setup_source(sig, accessor, key);
        }
    }

    // Channel → element: keep the element's accessor in sync with the signal.
    setup_target(sig, accessor) {
        const dispose = effect(() => {
            const value = sig.value;
            if (value === undefined) {
                // Channel not seeded yet; leave the server-rendered DOM as-is.
                return;
            }
            if (Object.is(accessor.read(), value)) {
                // Already in sync. Avoids redundant writes (e.g. resetting the
                // caret of an input) and breaks two-way feedback loops.
                return;
            }
            accessor.write(value);
        });
        this._disposers.push(dispose);
    }

    // Element → channel: push the element's accessor value into the signal.
    setup_source(sig, accessor, key) {
        // Seed the channel from the element's current value.
        sig.value = accessor.read();

        // The signal's own equal-value guard stops the
        // signal → write → observer → read → signal feedback loop.
        const handler = () => {
            sig.value = accessor.read();
        };

        if (accessor.event) {
            const id = `pat-bind--${key}--${this.uuid}`;
            events.add_event_listener(this.el, accessor.event, id, handler);
            this._listener_ids.push(id);
        } else if (accessor.observe) {
            const observer = new MutationObserver(handler);
            observer.observe(this.el, mutation_config(accessor.observe));
            this._observers.push(observer);
        }
    }

    destroy() {
        for (const dispose of this._disposers) {
            dispose();
        }
        for (const observer of this._observers) {
            observer.disconnect();
        }
        for (const id of this._listener_ids) {
            events.remove_event_listener(this.el, id);
        }
        super.destroy();
    }
}

registry.register(Pattern);

export default Pattern;
