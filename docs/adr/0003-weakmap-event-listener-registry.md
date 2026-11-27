# 0003 WeakMap based event listener registry

Status: Accepted (2026-11-27)

## Context

``events.add_event_listener`` stores the registered listeners in
``event_listener_map``, keyed by element, so that they can be removed by id
later. This was a ``Map``, which kept every element with registered
listeners in memory until its listeners were removed explicitly - even
after the element was removed from the DOM. Old style patterns
(``src/core/base.js``) and other code which do not remove their listeners
leaked the removed DOM this way.

A ``Map`` was needed for removing listeners from all elements at once:
``remove_event_listener(null, id)`` and ``remove_event_listener()``. Within
Patternslib this was only used by ``BasePattern.destroy()`` (added with
ADR 0001) and by tests.

## Decision

``event_listener_map`` is a ``WeakMap<element, Map<id, listener>>``.

-   The registry does not keep elements alive anymore. Elements which are
    not referenced otherwise are garbage collected together with their
    listeners.
-   Listeners can only be removed per element. ``remove_event_listener``
    without an element logs a warning and removes nothing.
-   Removing by exact id, by wildcard id (e.g. ``<namespace>--*``) and all
    listeners of an element keeps working, as the per element registry is
    still an iterable ``Map``.
-   ``BasePattern`` remembers the elements it registered listeners on via
    ``this.add_event_listener`` and removes its listeners per element on
    ``destroy()``. An element is forgotten when the instance's last
    listener on it is removed with ``this.remove_event_listener``.

This is released as a feature, not as a breaking change: removing listeners
from all elements at once is not used outside of Patternslib's own code and
tests.

## Consequences

-   No more leaks via the event listener registry.
-   Code which wants to remove a namespace of listeners has to know the
    elements it registered them on, e.g.
    ``events.remove_event_listener(document, "plone-modal-3--*")``. A
    planned migration of Mockup's plone-modal from jQuery namespaced
    handlers to ``events.add_event_listener`` has to remove its listeners
    this way.
-   The outer registry cannot be inspected or cleared as a whole anymore,
    e.g. in tests.
-   Keeping element-less removal would need an additional, iterable
    registry of ``WeakRef`` objects to the elements. This was not done for now.
