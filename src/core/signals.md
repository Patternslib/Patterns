# Signals

Reactive values backed by the official [TC39 Signals polyfill](https://github.com/proposal-signals/signal-polyfill),
with automatic dependency tracking. Used by
[pat-bind](../pat/bind/documentation.md) to keep DOM elements in sync.

## Usage

```javascript
import {
    signal,
    computed,
    effect,
    batch,
} from "@patternslib/patternslib/src/core/signals";

const price = signal(10);
const quantity = signal(2);
const total = computed(() => price.value * quantity.value);
const dispose = effect(() => console.log(total.value)); // Logs 20 immediately.

batch(() => {
    price.value = 12;
    quantity.value = 3;
});

await Promise.resolve(); // The queued update logs 36 once.

// In a pattern, perform this cleanup in destroy().
dispose();
// Unused computed values need no disposal.
```

## API

-   `signal(value)` creates a writable value. Read and assign through `.value`.
    Assigning an equal value (`Object.is`) does not trigger updates.
-   `computed(fn)` creates a lazy, cached, read-only derived value. Keep `fn`
    free of side effects. Unused computeds need no disposal. For compatibility,
    `.dispose()` freezes the last evaluated value and releases its dependencies;
    disposing before the first read freezes `undefined`. Computation errors are
    thrown on reads and cached until a dependency changes.
-   `effect(fn)` runs immediately and tracks signals read synchronously by `fn`.
    It runs again when its dependencies change. The returned function stops it.
-   `batch(fn)` groups synchronous writes, deferring scheduling until it returns.
    Synchronous writes are also batched automatically.
-   `untracked(fn)` reads without collecting dependencies. Signals and computed
    values also provide `.peek()` for a single untracked read.

Effects are batched in a microtask. Computed values evaluate only when read,
and both `.value` and `.peek()` return an up-to-date result immediately after
a write, including inside `batch()`. Computed reads update their dependencies
before returning, so consumers see consistent derived values.

Effects may write signals, but should not rely on repeatedly writing their own
dependencies to schedule themselves. Use computed values for derivations.

## Specifications

This module wraps `signal-polyfill`, the official implementation of the
[TC39 Signals proposal](https://github.com/tc39/proposal-signals).
`signal()` and `computed()` adapt `Signal.State` and `Signal.Computed` to the
Patternslib `.value` / `.peek()` API. `untracked()` delegates to
`Signal.subtle.untrack()`. Effects use `Signal.subtle.Watcher`; their microtask
scheduling and the `batch()` helper are Patternslib APIs.

Scheduling uses `queueMicrotask`, defined by the
[HTML Standard](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#microtask-queuing).
