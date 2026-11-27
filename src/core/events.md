# Events

``src/core/events.js`` contains helpers for event listeners and factories for
common events.

## Registering event listeners

``events.add_event_listener(el, event_type, id, cb, opts)`` registers an event
listener under an id. Registering again under the same id on the same element
replaces the previous listener.

``events.remove_event_listener(el, id)`` removes listeners from an element:

-   With an id, the listener with that id is removed. The id can be a wildcard
    string, e.g. ``my-namespace--*`` or ``test-*-event``.
-   Without an id, all listeners of the element are removed.
-   Without an element, nothing is removed and a warning is logged.

```javascript
import events from "@patternslib/patternslib/src/core/events";

events.add_event_listener(document, "keydown", "my-modal--close", on_keydown);
events.remove_event_listener(document, "my-modal--close");
```

The registry is a ``WeakMap`` and does not keep the elements alive. Elements
which are removed from the DOM and not referenced otherwise are garbage
collected together with their listeners. As a ``WeakMap`` cannot be iterated,
listeners can only be removed per element.

## Listener scopes

To remove all listeners of a component on all elements at once, use a
listener scope. A scope registers listeners under the id
``<namespace>--<name>`` and remembers their elements and names.

```javascript
import events from "@patternslib/patternslib/src/core/events";

const listeners = events.listener_scope("my-modal-3");

listeners.add(document, "keydown", "close", on_keydown);
listeners.add(window, "resize", "position", on_resize, { passive: true });

// Remove a single listener, listeners matching a wildcard name or all
// listeners of the scope on an element.
listeners.remove(document, "close");
listeners.remove(window, "pos*");
listeners.remove(window);

// Remove all listeners of the scope on all elements.
listeners.remove_all();
```

-   Without a namespace, ``listener_scope()`` generates a unique one.
-   The namespace must not contain the wildcard character ``*``.
-   A scope only removes listeners it registered itself. Scopes with
    overlapping namespaces, e.g. ``a`` and ``a--b``, do not interfere.
-   A scope keeps its elements referenced until their listeners are removed
    via the scope. Give it the lifetime of its owner and call
    ``remove_all()`` when the owner is destroyed.

``BasePattern`` uses a listener scope for ``this.add_event_listener`` and
removes its listeners on ``destroy()``, see ``basepattern.md``.
