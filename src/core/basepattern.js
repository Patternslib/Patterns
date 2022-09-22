/**
 * A Base pattern for creating scoped patterns.
 * Each instance of a pattern has its own local scope (closure).
 *
 * A new instance is created for each DOM element on which a pattern applies.
 *
 */
import logging from "./logging";

const log = logging.getLogger("Patternslib Base");

export class BasePattern {
    static name; // name of pattern used in Registry.
    static trigger; // A CSS selector to match elements that should trigger the pattern instantiation.
    parser; // Options parser.

    //// name - name of pattern used in Registry.
    //_name;
    //static get name() {
    //    console.log("a");
    //    return this._name;
    //}
    //static set name(name) {
    //    console.log("1");
    //    this._name = name;
    //}

    //// trigger - A CSS selector to match elements that should trigger
    ////           the pattern instantiation.
    //_trigger;
    //static get trigger() {
    //    console.log("1");
    //    return this._trigger;
    //}
    //static set trigger(selector) {
    //    console.log("2");
    //    this._trigger = selector;
    //}

    constructor(el, options = {}) {
        // Make static ``name`` and ``trigger`` available on instance.
        this.name = this.constructor.name;
        this.trigger = this.constructor.trigger;

        if (!el) {
            log.warn(`No element given to pattern ${this.name}.`);
            return;
        }
        this.el = el;

        // Initialize asynchronously.
        //
        // 1) We need to call the concrete implementation of ``init``, but the
        //    inheritance chain is not yet set up and ``init`` is not yet
        //    available.
        //
        // 2) We want to fire an event after successful initialization, but the
        //    constructer cannot be asynchronous or return a Promise but only
        //    return itself.
        //
        // Both limitations are gone in next tick.
        //
        window.setTimeout(async () => {
            if (typeof this.el[`pattern-${this.name}`] !== "undefined") {
                // Do not reinstantiate
                log.debug(`Not reinstatiating the pattern ${this.name}.`, this.el);
                return;
            }

            this.options = this.parser?.parse(this.el, options) ?? options;

            // Store pattern instance on element
            this.el[`pattern-${this.name}`] = this;

            // Initialize pattern
            await this.init();

            // Notify ready
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
}
