# BasePattern base pattern class.

A Base pattern for creating scoped patterns.

Each instance of a pattern has its own local scope.
A new instance is created for each DOM element on which a pattern applies.

## Pattern initialization order

The order of patterns in the patterns registry can be modified using the order
property. Lower values will sort and initialize those patterns earlier than
others with higher numbers. The default is 1000 - if you don't have any special
needs, just leave out the `order` property from your Pattern class.
**pat-validation** needs to be initialized early before other patterns can handle
`submit` events - it has a sort order of 100.
**pat-clone-code** needs to copy the Pattern markup before it is eventually
modified - it has a sort order of 200.

## Usage:

Also see: https://github.com/Patternslib/pat-PATTERN_TEMPLATE

```javascript
import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";

export const parser = new Parser("test-pattern");
parser.addArgument("example-option", "Stranger");

class Pattern extends BasePattern {
    static name = "test-pattern";
    static trigger = ".pat-test-pattern";
    static parser = parser;
    static order = 1000; // Optional. Leave out for the default value of 1000.

    async init() {
        import("./test-pattern.scss");

        // Try to avoid jQuery, but here is how to import it.
        // eslint-disable-next-line no-unused-vars
        const $ = (await import("jquery")).default;

        // The options are automatically created, if parser is defined.
        const example_option = this.options.exampleOption;
        this.el.innerHTML = `
            <p>hello, ${example_option}, this is pattern ${this.name} speaking.</p>
        `;
    }
}

// Register Pattern class in the global pattern registry
registry.register(Pattern);

// Make it available
export default Pattern;
```

## Instance scoped event listeners

Use ``this.add_event_listener`` to register event listeners which belong to a
pattern instance, e.g. on ``document`` or ``window``:

```javascript
class Pattern extends BasePattern {
    static name = "test-pattern";
    static trigger = ".pat-test-pattern";

    async init() {
        this.add_event_listener(document, "keydown", "close-on-escape", (e) => {
            if (e.key === "Escape") {
                this.close();
            }
        });
    }
}
```

The listener is registered with ``events.add_event_listener`` under the id
``<pattern name>--<instance uuid>--<name>``. Registering again under the same
name replaces the previous listener. ``destroy()`` removes all listeners of
the instance, but not those of other instances of the same pattern. If you
override ``destroy()``, call ``super.destroy()``.

## Automatic destroy

``destroy()`` is called automatically when the pattern's element is removed
from the document — either directly or by removing or replacing one of its
ancestors. A single ``MutationObserver`` on the document checks all live
pattern instances whenever nodes are removed (see ``src/core/lifecycle.js``).

-   Only instances whose element is part of the document after ``init()`` are
    tracked. Patterns initialized on detached DOM are not destroyed
    automatically.
-   Moving an element within the same task (e.g. ``appendChild`` of an
    existing node, or ``remove()`` followed by re-inserting it) does not
    destroy the pattern. Detaching an element and re-inserting it in a later
    task (e.g. after an ``await``) destroys the pattern.
-   Destruction happens asynchronously in a microtask after the removal. In
    tests, wait a tick after removing an element, e.g. ``await utils.timeout(1)``.
-   A pattern which is destroyed before its initialization starts is not
    initialized and throws ``not-init`` instead of ``init``. A pattern whose
    element is removed while ``init()`` runs is destroyed after ``init()``.
-   ``destroy()`` can be called multiple times, only the first call has an
    effect. Afterwards ``this.destroyed`` is ``true``. Asynchronous code in
    your pattern should check ``this.destroyed`` after an ``await`` and stop
    if the pattern was destroyed in the meantime.
-   If you override ``destroy()``, call ``super.destroy()``.
-   Only class based patterns (``BasePattern``) are destroyed automatically,
    not patterns based on ``src/core/base.js``.
-   Removals inside shadow roots are not observed.

## Replacing a registered pattern

The first registration of a pattern name wins — registering another pattern
under an already used name is refused. To override a pattern, e.g. a core
pattern from an add-on bundle, pass ``replace: true``:

```javascript
import registry from "@patternslib/patternslib/src/core/registry";
import { Pattern as OriginalPattern } from "some-bundle/src/pat/example/example";

class Pattern extends OriginalPattern {
    // Keep the original name and trigger, so that existing markup and
    // options (``data-pat-example``) keep working.
    static name = "example";
    static trigger = ".pat-example";

    async init() {
        // Customize, then let the original do the rest.
        await super.init();
    }
}

registry.register(Pattern, Pattern.name, { replace: true });
```

For old-style ``Base.extend`` patterns pass ``replace: true`` along with the
pattern properties.

The registry waits for Module Federation remote bundles before its initial
DOM scan, so a replacement registered by a remote bundle is in place for the
initial scan no matter whether the remote or the core bundle registered
first. Elements which were already initialized with the previous pattern
keep it; only elements initialized afterwards get the replacement.
