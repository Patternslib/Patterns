/**
 * A Base pattern for creating scoped patterns. It's similar to Backbone's
 * Model class. The advantage of this approach is that each instance of a
 * pattern has its own local scope (closure).
 *
 * A new instance is created for each DOM element on which a pattern applies.
 *
 * You can assign values, such as $el, to `this` for an instance and they
 * will remain unique to that instance.
 *
 * Older Patternslib patterns on the other hand have a single global scope for
 * all DOM elements.
 */
import $ from "jquery";
import Registry from "./registry";
import logging from "./logging";
import mockupParser from "./mockup-parser";

const log = logging.getLogger("Patternslib Base");

const initBasePattern = function ($el, options, trigger) {
    if (!$el.jquery) {
        $el = $($el);
    }
    const name = this.prototype.name;
    const plog = logging.getLogger(`pat.${name}`);
    let pattern = $el.data(`pattern-${name}`);
    if (pattern === undefined && Registry.patterns[name]) {
        try {
            // Immediately set the pattern instance to the temporary value
            // ``initializing`` before the async Base constructor is setting
            // the value later.
            // This prevents re-init the pattern on this element on multiple
            // initialization calls..
            $el.data(`pattern-${name}`, "initializing");
            options =
                this.prototype.parser === "mockup"
                    ? mockupParser.getOptions($el, name, options)
                    : options;
            pattern = new Registry.patterns[name]($el, options, trigger);
        } catch (e) {
            plog.error(`Failed while initializing ${name} pattern.`, e);
        }
    }
    return pattern;
};

const Base = async function ($el, options, trigger) {
    if (($el?.jquery && $el.length === 0) || !$el) {
        log.warn("No element given to pattern.");
        return;
    }
    if (!$el.jquery) {
        $el = $($el);
    }
    this.$el = $el;
    this.el = $el[0];
    this.options = $.extend(true, {}, this.defaults || {}, options || {});
    await this.init($el, options, trigger);

    // Store pattern instance on element
    this.$el.data(`pattern-${this.name}`, this);
    this.el[`pattern-${this.name}`] = this;

    this.emit("init");
};

Base.prototype = {
    constructor: Base,
    on(eventName, eventCallback) {
        this.$el.on(`${eventName}.${this.name}.patterns`, eventCallback);
    },
    one(eventName, eventCallback) {
        this.$el.one(`${eventName}.${this.name}.patterns`, eventCallback);
    },
    emit(eventName, args) {
        // args should be a list
        if (args === undefined) {
            args = [];
        }
        this.$el.trigger(`${eventName}.${this.name}.patterns`, args);
    },
};

Base.extend = function (patternProps) {
    /* Helper function to correctly set up the prototype chain for new patterns.
     */
    const parent = this;
    let child;

    // Check that the required configuration properties are given.
    if (!patternProps) {
        throw new Error(
            "Pattern configuration properties required when calling Base.extend"
        );
    }

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (Object.hasOwnProperty.call(patternProps, "constructor")) {
        child = patternProps.constructor;
    } else {
        child = function () {
            parent.apply(this, arguments);
        };
    }

    // Allow patterns to be extended indefinitely
    child.extend = Base.extend;

    // Static properties required by the Patternslib registry
    child.init = initBasePattern;
    child.jquery_plugin = true;
    child.trigger = patternProps.trigger;
    child.parser = patternProps?.parser || null;

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function () {
        this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add pattern's configuration properties (instance properties) to the subclass,
    $.extend(true, child.prototype, patternProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    // Register the pattern in the Patternslib registry.
    if (!patternProps.name) {
        log.warn("This pattern without a name attribute will not be registered!");
    } else if (!patternProps.trigger) {
        log.warn(
            `The pattern ${patternProps.name} does not have a trigger attribute, it will not be registered.`
        );
    } else if (patternProps.autoregister !== false) {
        Registry.register(child, patternProps.name);
    }
    return child;
};

export default Base;
