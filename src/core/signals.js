/**
 * A minimal reactive signals implementation.
 *
 * Provides ``signal``, ``computed``, ``effect``, ``batch`` and ``untracked``
 * primitives with automatic dependency tracking.
 *
 * The public API is intentionally shaped after the TC39 signals proposal
 * (https://github.com/tc39/proposal-signals) so that this module can be swapped
 * for a native implementation once that lands in browsers.
 *
 * Effects are flushed in a microtask, so a burst of synchronous signal writes
 * only re-runs each dependent effect once.
 */
import logging from "./logging";

const log = logging.getLogger("signals");

// The effect which is currently running and collecting dependencies.
let current_effect = null;

// Effects scheduled to re-run on the next microtask flush.
const pending_effects = new Set();
let flush_scheduled = false;

// While > 0, effect flushing is deferred (see ``batch``).
let batch_depth = 0;

function schedule_flush() {
    if (flush_scheduled || batch_depth > 0) {
        return;
    }
    flush_scheduled = true;
    queueMicrotask(flush_effects);
}

// Safety net against cyclic derivations that never settle.
const MAX_FLUSH_ITERATIONS = 1000;

function flush_effects() {
    flush_scheduled = false;
    // Drain the queue within this microtask so cascades (e.g. a computed
    // updating a downstream effect) settle in one flush instead of lagging a
    // tick. Effects scheduled while running are picked up by the next iteration.
    let iterations = 0;
    while (pending_effects.size > 0) {
        if (++iterations > MAX_FLUSH_ITERATIONS) {
            pending_effects.clear();
            log.error(
                "Aborting effect flush after too many iterations - likely a cyclic dependency."
            );
            return;
        }
        const effects = [...pending_effects];
        pending_effects.clear();
        for (const eff of effects) {
            eff._run();
        }
    }
}

class Signal {
    constructor(value) {
        this._value = value;
        this._subscribers = new Set(); // effects depending on this signal
    }

    get value() {
        if (current_effect) {
            // Track the dependency in both directions for cleanup.
            this._subscribers.add(current_effect);
            current_effect._deps.add(this);
        }
        return this._value;
    }

    set value(new_value) {
        if (Object.is(new_value, this._value)) {
            // No change → no notification. This is the central loop-breaker for
            // two-way bindings: a write-back of an equal value is a no-op.
            return;
        }
        this._value = new_value;
        // Copy the subscribers as the set may be mutated while scheduling.
        for (const eff of [...this._subscribers]) {
            pending_effects.add(eff);
        }
        schedule_flush();
    }

    // Read the current value without subscribing the running effect.
    peek() {
        return this._value;
    }
}

class Effect {
    constructor(fn) {
        this._fn = fn;
        this._deps = new Set();
        this._disposed = false;
        this._run();
    }

    _run() {
        if (this._disposed) {
            return;
        }
        this._cleanup();
        const previous = current_effect;
        current_effect = this;
        try {
            this._fn();
        } catch (e) {
            log.error("Error while running effect.", e);
        } finally {
            current_effect = previous;
        }
    }

    _cleanup() {
        // Unsubscribe from all current dependencies before re-tracking.
        for (const dep of this._deps) {
            dep._subscribers.delete(this);
        }
        this._deps.clear();
    }

    dispose() {
        this._disposed = true;
        this._cleanup();
        pending_effects.delete(this);
    }
}

class Computed {
    constructor(fn) {
        this._signal = new Signal(undefined);
        // An effect keeps the derived value up to date and propagates changes to
        // anything reading the computed signal.
        // NOTE: This is an eager computed - it recomputes whenever a dependency
        // changes, even when nobody reads it. Good enough for v1; the TC39
        // proposal computeds are lazy.
        this._effect = new Effect(() => {
            this._signal.value = fn();
        });
    }

    get value() {
        return this._signal.value;
    }

    peek() {
        return this._signal.peek();
    }

    dispose() {
        this._effect.dispose();
    }
}

/**
 * Create a writable reactive value.
 * @param {*} initial_value - The initial value of the signal.
 * @returns {Signal} A signal with a ``value`` getter/setter and ``peek()``.
 */
function signal(initial_value) {
    return new Signal(initial_value);
}

/**
 * Create a read-only signal derived from other signals.
 * @param {function} fn - Function computing the derived value.
 * @returns {Computed} A read-only signal with a ``value`` getter, ``peek()``
 *                     and ``dispose()``.
 */
function computed(fn) {
    return new Computed(fn);
}

/**
 * Run ``fn`` and re-run it whenever any signal read during it changes.
 * @param {function} fn - The effect callback.
 * @returns {function} A dispose function which stops the effect.
 */
function effect(fn) {
    const eff = new Effect(fn);
    return () => eff.dispose();
}

/**
 * Coalesce all signal writes performed in ``fn`` into a single effect flush.
 * @param {function} fn - The callback performing the writes.
 * @returns {*} The return value of ``fn``.
 */
function batch(fn) {
    batch_depth++;
    try {
        return fn();
    } finally {
        batch_depth--;
        schedule_flush();
    }
}

/**
 * Run ``fn`` without subscribing the currently running effect to any signal
 * read inside it.
 * @param {function} fn - The callback to run untracked.
 * @returns {*} The return value of ``fn``.
 */
function untracked(fn) {
    const previous = current_effect;
    current_effect = null;
    try {
        return fn();
    } finally {
        current_effect = previous;
    }
}

export { signal, computed, effect, batch, untracked };
export default { signal, computed, effect, batch, untracked };
