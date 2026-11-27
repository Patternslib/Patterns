# 0001 Destroy patterns automatically when removed from the DOM

Status: Accepted (2026-11-27)

## Context

``BasePattern`` has a ``destroy()`` method which removes the instance scoped
event listeners and the pattern reference on the element. It was never called
automatically. Patterns whose elements were removed from the DOM — e.g. by
pat-inject replacing content — kept their listeners on ``window`` and
``document``, which also kept the pattern instance and its detached element
in memory.

There is no usable "element removed" event:

-   Mutation events (``DOMNodeRemoved``, ``DOMNodeRemovedFromDocument``) are
    deprecated and are being removed from browsers.
-   ``disconnectedCallback`` only exists for custom elements. Patterns are
    initialized on arbitrary elements.
-   ``FinalizationRegistry`` / ``WeakRef`` are non-deterministic and cannot
    work while listeners on ``window`` or ``document`` keep the instance alive.

Explicitly destroying patterns in the code which removes DOM (e.g.
pat-inject) would miss removals by third-party code like Mockup, Vue or
custom JavaScript.

## Decision

A single ``MutationObserver`` on ``document.documentElement`` with
``{ childList: true, subtree: true }`` (``src/core/lifecycle.js``) destroys
patterns whose elements are removed from the document.

-   ``BasePattern`` instances are tracked in a ``Set`` after ``init()``, if
    their element is part of the document. Instances on detached DOM are not
    tracked.
-   For each mutation batch with removed nodes, the tracked instances are
    checked once and those with ``el.isConnected === false`` are destroyed.
    Removed subtrees are not searched.
-   Checking ``isConnected`` at callback time keeps patterns whose elements
    are moved within the same task (removed and re-inserted before the
    microtask runs).
-   Elements which are detached and re-inserted in a later task are
    destroyed. No delay is used: a delay only helps if the element comes back
    within the delay, and we know of no case where this matters.
-   ``destroy()`` is idempotent and sets ``this.destroyed``. The observer
    untracks an instance before calling ``destroy()``, so subclasses not
    calling ``super.destroy()`` are not destroyed repeatedly.
-   A pattern destroyed before its initialization starts is not initialized
    and throws ``not-init``. A pattern whose element is removed during
    ``init()`` is destroyed after ``init()``.
-   ``destroy()`` only removes the ``pattern-<name>`` reference on the
    element if it points to the destroyed instance.
-   The root element is observed instead of ``document.body``, so that
    replacing the body element is noticed too. The cost is the same.

## Consequences

-   Instance scoped listeners and patterns are cleaned up without patterns
    or callers having to do anything.
-   The cost is one pass over the live instances per mutation batch with
    removals. Observing ``childList`` only keeps the number of records low.
-   Destruction is asynchronous (microtask). Tests need to wait a tick after
    removing elements.
-   Asynchronous code in patterns must check ``this.destroyed`` after
    ``await`` and stop if the pattern was destroyed in the meantime. This
    revealed such a bug in pat-tooltip, which accessed the destroyed Tippy
    instance after fetching content.
-   Components which detach and re-attach their own DOM need an opt-out, see
    ADR 0002.
-   Only class based patterns (``BasePattern``) are destroyed automatically,
    not patterns based on ``src/core/base.js``.
-   Removals inside shadow roots are not observed.
