/**
 * Patternslib helpers backed by the TC39 Signals proposal's official polyfill.
 * Computed values are lazy; effects run immediately, then in microtask batches.
 */
import { Signal } from "signal-polyfill";
import logging from "./logging";

const log = logging.getLogger("signals");
const pending_effects = new Set();
const MAX_RUNS_PER_EFFECT = 1000;
let flush_scheduled = false;
let batch_depth = 0;

function schedule_flush() {
    if (flush_scheduled || batch_depth > 0 || !pending_effects.size) {
        return;
    }
    flush_scheduled = true;
    queueMicrotask(flush_effects);
}

function flush_effects() {
    const run_counts = new Map();
    try {
        for (const eff of pending_effects) {
            pending_effects.delete(eff);
            const runs = (run_counts.get(eff) || 0) + 1;
            if (runs > MAX_RUNS_PER_EFFECT) {
                pending_effects.clear();
                log.error(
                    "Aborting effect flush after too many iterations - likely a cyclic dependency."
                );
                return;
            }
            run_counts.set(eff, runs);
            eff.run();
        }
    } finally {
        flush_scheduled = false;
    }
}

/** Create a writable value with tracked reads and untracked peek(). */
function signal(initial_value) {
    const state = new Signal.State(initial_value);
    return {
        get value() {
            return state.get();
        },
        set value(value) {
            state.set(value);
        },
        peek() {
            return untracked(() => state.get());
        },
    };
}

/**
 * Create a lazy, cached derivation. Reads always return the current value.
 * dispose() freezes the last evaluated value (undefined if never evaluated).
 * Disposal is optional for unused computeds, which are not kept live by sources.
 */
function computed(fn) {
    const active = new Signal.State(true);
    let value;
    const derived = new Signal.Computed(() => {
        if (active.get()) {
            value = fn();
        }
        return value;
    });
    return {
        get value() {
            return derived.get();
        },
        peek() {
            return untracked(() => derived.get());
        },
        dispose() {
            active.set(false);
            fn = null;
            // Drop source dependencies now, even if nobody reads again.
            untracked(() => derived.get());
        },
    };
}

/** Run immediately and after dependency changes; return a dispose function. */
function effect(fn) {
    let disposed = false;
    const derived = new Signal.Computed(() => {
        try {
            fn();
        } catch (e) {
            log.error("Error while running effect.", e);
        }
    });
    const eff = {
        run() {
            if (disposed) return;
            // Re-arm before evaluation so writes can schedule other effects.
            watcher.watch();
            derived.get();
        },
    };
    const watcher = new Signal.subtle.Watcher(() => {
        // Watcher callbacks must not read or write signals.
        pending_effects.add(eff);
        schedule_flush();
    });
    watcher.watch(derived);
    // Creating an effect inside another computation must not subscribe it.
    untracked(() => eff.run());
    return () => {
        disposed = true;
        watcher.unwatch(derived);
        pending_effects.delete(eff);
    };
}

/** Group synchronous writes, deferring effect scheduling until the end. */
function batch(fn) {
    batch_depth++;
    try {
        return fn();
    } finally {
        batch_depth--;
        schedule_flush();
    }
}

/** Run without subscribing the surrounding computation to signal reads. */
function untracked(fn) {
    return Signal.subtle.untrack(fn);
}

export { signal, computed, effect, batch, untracked };
export default { signal, computed, effect, batch, untracked };
