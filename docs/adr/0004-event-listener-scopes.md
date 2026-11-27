# 0004 Event listener scopes

Status: Accepted (2026-11-27)

## Context

With ADR 0003 the event listener registry is a ``WeakMap``, and listeners
can only be removed per element. Removing a namespace of listeners on all
elements at once, e.g. ``remove_event_listener(null, "plone-modal-3--*")``,
is not possible anymore. Mockup plans to replace jQuery namespaced handlers
(``.on("keydown.plone-modal-3")`` / ``.off(".plone-modal-3")``) with
``events.add_event_listener`` and needs such a namespace wide cleanup.

``BasePattern`` already solved this for its instances: it remembers the
elements it registered listeners on and removes its listeners from them on
destroy.

Two options were considered:

1.  A global, iterable registry of ``WeakRef`` objects to all elements with
    listeners, cleaned up via a ``FinalizationRegistry``. This restores
    element-less removal, but adds subtle code depending on garbage
    collection timing, costs a ``WeakRef`` per registered element and every
    namespace removal iterates all registered elements of the page.
2.  A listener scope which tracks the elements of one namespace, generalizing
    what ``BasePattern`` does.

## Decision

``events.listener_scope(namespace)`` returns a ``ListenerScope``:

-   ``add(el, event_type, name, cb, opts)`` registers a listener via
    ``events.add_event_listener`` under the id ``<namespace>--<name>`` and
    remembers the element and the name.
-   ``remove(el, name)`` removes a listener of the scope from an element.
    ``name`` can be a wildcard, which is matched against the scope's own
    listener names. Without a name, all listeners of the scope on that
    element are removed. An element is forgotten when the scope has no more
    listeners on it.
-   The scope only removes the ids it registered itself, instead of removing
    ``<namespace>--*``. A prefix wildcard would also remove listeners of
    scopes whose namespace starts with the same prefix, e.g. ``a`` and
    ``a--b``.
-   ``remove_all()`` removes all listeners of the scope on all of its
    elements.
-   Without a namespace, a unique one is generated.

``BasePattern`` uses a listener scope with the namespace
``<pattern name>--<instance uuid>`` instead of its own element tracking.
The listener ids stay the same.

The global ``WeakRef`` registry is not implemented.

## Consequences

-   Code which needs namespace wide cleanup creates a scope and calls
    ``remove_all()``, instead of relying on a global registry.
-   The cost of ``remove_all()`` depends only on the scope's own elements.
-   No dependency on garbage collection; the behavior is deterministic and
    testable.
-   A scope keeps its elements referenced until their listeners are removed
    via the scope or ``remove_all()`` is called. Listeners removed otherwise,
    e.g. ``once`` listeners after firing, keep their element in the scope
    until then. Scopes should therefore have the lifetime of their owner,
    e.g. a pattern instance.
-   The namespace must not contain the wildcard character ``*``.
