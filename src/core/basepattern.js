/**
 * A Base pattern for creating scoped patterns.
 *
 * Each instance of a pattern has its own local scope.
 * A new instance is created for each DOM element on which a pattern applies.
 *
 * For usage, see basepattern.md
 */
import logging from "./logging";

const log = logging.getLogger("Patternslib Base");

class BasePattern {
    static name; // name of pattern used in Registry.
    static trigger; // A CSS selector to match elements that should trigger the pattern instantiation.
    parser; // Options parser.

    constructor(el, options = {}) {
        // Make static ``name`` and ``trigger`` available on instance.
        this.name = this.constructor.name;
        this.trigger = this.constructor.trigger;

        if (!el) {
            log.warn(`No element given to pattern ${this.name}.`);
            return;
        }
        if (el.jquery) {
            el = el[0];
        }
        this.el = el;

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
                return;
            }

            // Create the options object by parsing the element and using the
            // optional optios as default.
            this.options = this.parser?.parse(this.el, options) ?? options;

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

    init() {
        // Extend this method in your pattern.
    }

    /**
     * Listen to an event on the element only once.
     *
     * @param {string} event_name - Name of the event to listen to.
     * @param {function} callback - Callback to call when the event is thrown.
     */
    one(event_name, event_callback) {
        this.el.addEventListener(`${event_name}.${this.name}.patterns`, event_callback, {
            once: true,
        });
    }
}

export default BasePattern;
export { BasePattern };
