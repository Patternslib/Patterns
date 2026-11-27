# 0002 Self managed containers for the pattern lifecycle

Status: Accepted (2026-11-27)

## Context

With ADR 0001, patterns are destroyed when their element is not part of the
document anymore. Some components detach and re-attach their own DOM over an
arbitrary period of time. Tippy, used by pat-tooltip, removes the popper from
the document while the tooltip is hidden and re-inserts it on show.

Patterns in static tooltip content would be destroyed on hide. On the next
show pat-tooltip re-scans the popper and initializes them again on DOM which
the first initialization already changed. Not every pattern supports that.

A delay before destroying does not help, because the tooltip can be hidden
for any amount of time.

## Decision

Components can mark a container with the ``data-pat-lifecycle-managed``
attribute (``lifecycle.MANAGED_ATTRIBUTE``) and manage the lifecycle of the
patterns in it themselves.

-   The observer skips disconnected instances for which
    ``el.closest("[data-pat-lifecycle-managed]")`` finds a container.
    ``closest`` only walks the element's current tree: if the whole container
    is detached the instances are kept, if an element is removed from within
    the container its patterns are destroyed as usual.
-   ``lifecycle.destroy_patterns(root)`` destroys all tracked instances
    within ``root``, connected or not. It also sweeps instances which were
    removed from a detached managed container, since those removals are not
    observed.
-   pat-tooltip marks its popper, destroys the patterns in it in
    ``destroy()`` and, for ``source: ajax``, on hide before the content is
    replaced.

## Consequences

-   Patterns in static tooltip content are initialized once and survive
    hiding and showing.
-   Components using the attribute must call ``destroy_patterns`` for their
    container, otherwise those patterns are only destroyed if they are
    removed from the container.
-   If a pat-tooltip popper is appended to a ``target`` element which is
    removed while the tooltip trigger stays, the patterns in the tooltip
    content stay alive until the tooltip is destroyed.
