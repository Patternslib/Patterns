/**
 * A Base pattern for creating scoped patterns.
 *
 * Each instance of a pattern has its own local scope.
 * A new instance is created for each DOM element on which a pattern applies.
 *
 * For usage, see basepattern.md
 */
import events, { event_listener_map } from "./events";
import lifecycle from "./lifecycle";
import logging from "./logging";
import create_uuid from "./uuid";

const log = logging.getLogger("basepattern");

class BasePattern {
    static name; // name of pattern used in Registry.
    static trigger; // A CSS selector to match elements that should trigger the pattern instantiation.
    static parser; // Options parser.
    static order = 1000; // Registry pattern sorting.

    // Parser options
    parser_group_options = true;
    parser_multiple = undefined;
    parser_inherit = true;

    // Elements with listeners registered via ``add_event_listener``.
    // The event listener registry is a WeakMap which cannot be iterated, so
    // remember the elements to remove the listeners on destroy.
    _listener_els = new Set();

    constructor(el, options = {}) {
        // Make static variables available on instance.
        this.name = this.constructor.name;
        this.trigger = this.constructor.trigger;
        this.parser = this.constructor.parser;

        if (!el) {
            log.warn(`No element given to pattern ${this.name}.`);
            return;
        }
        if (el.jquery) {
            el = el[0];
        }
        this.el = el;
        this.uuid = create_uuid();
        this.destroyed = false;

        // Remember if the element was part of the document at construction
        // time. Used to destroy the pattern if the element was removed while
        // the pattern was initializing.
        const was_connected = el.isConnected;

        // Notify pre-init
        this.el.dispatchEvent(
            new Event(`pre-init.${this.name}.patterns`, {
                bubbles: true,
                cancelable: true,
            })
        );

        // Initialize asynchronously.
        //
        // 1) We need to call the concrete implementation of ``init``, but the
        //    inheritance chain is not yet set up and ``init`` not available.
        //
        // 2) We want to wait for the init() to successfuly finish and fire an
        //    event then.
        //    But the constructer cannot not return a Promise, thus not be
        //    asynchronous but only return itself.
        //
        // Both limitations are gone in next tick.
        //
        window.setTimeout(async () => {
            if (this.destroyed) {
                // Destroyed before initialization.
                log.debug(`Not initializing destroyed pattern ${this.name}.`, this.el);
                this.el.dispatchEvent(
                    new Event(`not-init.${this.name}.patterns`, {
                        bubbles: true,
                        cancelable: false,
                    })
                );
                return;
            }

            if (typeof this.el[`pattern-${this.name}`] !== "undefined") {
                // Do not reinstantiate
                log.debug(`Not reinstatiating the pattern ${this.name}.`, this.el);

                // Notify that not instantiated
                this.el.dispatchEvent(
                    new Event(`not-init.${this.name}.patterns`, {
                        bubbles: true,
                        cancelable: false,
                    })
                );
                return;
            }

            // Create the options object by parsing the element and using the
            // optional options as default.
            this.options =
                this.parser?.parse(
                    this.el,
                    options,
                    this.parser_multiple,
                    this.parser_inherit,
                    this.parser_group_options
                ) ?? options;

            // Store pattern instance on element
            this.el[`pattern-${this.name}`] = this;

            // Initialize the pattern
            await this.init();

            if (this.destroyed) {
                // Destroyed while initializing. Remove the listeners which
                // were registered after the destroy.
                this._remove_all_event_listeners();
            } else {
                if (this.el.isConnected) {
                    // Destroy the pattern when the element is removed from
                    // the document.
                    lifecycle.track(this);
                } else if (was_connected) {
                    // The element was removed while initializing.
                    this.destroy();
                }
            }

            // Notify that now ready
            this.el.dispatchEvent(
                new Event(`init.${this.name}.patterns`, {
                    bubbles: true,
                    cancelable: true,
                })
            );
        }, 0);
    }

    async init() {
        // Extend this method in your pattern.
    }

    emit_update(action = undefined, options = {}) {
        options = {
            pattern: this.name,
            dom: this.el,
            action: action,
            ...options,
        };
        this.el.dispatchEvent(events.update_event(options));
    }

    /**
     * Listen to an event on the element only once.
     *
     * @param {string} event_name - Name of the event to listen to.
     * @param {function} callback - Callback to call when the event is thrown.
     */
    one(event_name, event_callback) {
        events.add_event_listener(
            this.el,
            `${event_name}.${this.name}.patterns`,
            `basepattern-one--${event_name}.${this.name}.patterns`,
            event_callback,
            {
                once: true,
            }
        );
    }

    /**
     * Add an event listener which is scoped to this pattern instance.
     *
     * The listener is registered via ``events.add_event_listener`` under the
     * id ``<pattern name>--<instance uuid>--<name>`` and removed when the
     * pattern is destroyed.
     *
     * @param {Node|Window} el - The element to register the event listener on.
     * @param {string} event_type - The event type to listen for.
     * @param {string} name - A name for the listener, unique within this instance.
     * @param {function} cb - The event handler / callback function.
     * @param {Object} [opts] - Options for the addEventListener API.
     */
    add_event_listener(el, event_type, name, cb, opts = {}) {
        if (!el?.addEventListener) {
            return; // nothing to do.
        }
        events.add_event_listener(el, event_type, this._listener_id(name), cb, opts);
        this._listener_els.add(el);
    }

    /**
     * Remove an event listener which was registered with ``add_event_listener``.
     *
     * Only removes listeners of this pattern instance.
     *
     * @param {Node|Window} el - The element the event listener was registered on.
     * @param {string} name - The name of the listener, as passed to ``add_event_listener``.
     */
    remove_event_listener(el, name) {
        if (!el) {
            return;
        }
        events.remove_event_listener(el, this._listener_id(name));

        // Forget the element if this instance has no more listeners on it.
        const prefix = this._listener_id("");
        const ids = event_listener_map.get(el)?.keys() || [];
        if (![...ids].some((id) => id.startsWith(prefix))) {
            this._listener_els.delete(el);
        }
    }

    _listener_id(name) {
        return `${this.name}--${this.uuid}--${name}`;
    }

    _remove_all_event_listeners() {
        for (const el of this._listener_els) {
            events.remove_event_listener(el, this._listener_id("*"));
        }
        this._listener_els.clear();
    }

    /**
     * Destroy/remove/unload the pattern from the element.
     *
     * Also removes all event listeners registered with ``add_event_listener``.
     *
     * Called automatically when the pattern's element is removed from the
     * document. Calling it more than once has no further effect.
     *
     * If you override this method, call ``super.destroy()``.
     */
    destroy() {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        lifecycle.untrack(this);
        this._remove_all_event_listeners();
        if (this.el[`pattern-${this.name}`] === this) {
            // Only remove the reference if it points to this instance and not
            // to another instance which was initialized on the element.
            delete this.el[`pattern-${this.name}`];
        }
    }
}

export default BasePattern;
export { BasePattern };
