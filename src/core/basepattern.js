/**
 * A Base pattern for creating scoped patterns.
 *
 * Each instance of a pattern has its own local scope.
 * A new instance is created for each DOM element on which a pattern applies.
 *
 * For usage, see basepattern.md
 */
import events from "./events";
import logging from "./logging";

const log = logging.getLogger("basepattern");

class BasePattern {
    static name; // name of pattern used in Registry.
    static trigger; // A CSS selector to match elements that should trigger the pattern instantiation.
    static parser; // Options parser.

    // Parser options
    parser_group_options = true;
    parser_multiple = undefined;
    parser_inherit = true;

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
     * Destroy/remove/unload the pattern from the element.
     */
    destroy() {
        delete this.el[`pattern-${this.name}`];
    }
}

export default BasePattern;
export { BasePattern };
