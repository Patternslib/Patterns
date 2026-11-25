# 0001 - Reload content on events with pat-reload instead of a pat-inject trigger

Status: Accepted (2026-11-09)

## Context

A toolbar - a plain `<div>`, not an `<a>` or `<form>` - needs to be reloaded
whenever the browser navigates to another URL without a full page load (via
`history.pushState`, e.g. in Plone's folder contents).

The first approach was a new pat-inject trigger `autoload-navigate`, as
pat-inject is already good at fetching and injecting content. While
implementing and reviewing it, it turned out that it required:

-   changing pat-inject's general contract for this one trigger:
    -   resolving `url` relative to the current location (appending to it)
        instead of like a normal link,
    -   allowing elements other than `<a>` and `<form>`, if they have a `url`,
-   about 70 lines of navigation handling: excluding `history: record`
    (which would cause an infinite loop, as recording history fires a
    navigation event again), filtering URL changes, cleaning up listeners of
    removed elements, debouncing and re-triggering after a running
    injection.

None of that is about injection. It is about _when_ and _from which URL_ to
reload. pat-inject is already the most complex pattern in Patternslib.

Mockup's `pat-toolbar` shows the same split: it listens to an
application-specific event and builds the URL from application knowledge,
but implements fetching and replacing itself with `$.ajax` - duplicating
what pat-inject does better (source/target selection, error handling,
loading classes, injection events, scanning for new patterns).

## Decision

-   Remove the `autoload-navigate` trigger from pat-inject again.
-   Add a generic pattern `pat-reload`, configured via `data-pat-reload`:
    -   `url` (required): the URL to reload from. See ADR 0002.
    -   `trigger-event` (default `navigatesuccess`): the event which triggers
        a reload. See ADR 0003.
    -   `delay` (default `0`): debounce time for successive events.
-   pat-reload decides _when_ and _from which URL_ to reload. _What_ is
    fetched and _where_ it goes is delegated to pat-inject via its JavaScript
    API (`inject.extractConfig` and `inject.execute`) and configured with
    `data-pat-inject` on the same element. The element must not have the
    `pat-inject` class.
-   Unlike pat-inject, which injects into `body` by default, pat-reload
    injects into the element itself if no target is configured.
-   Events which arrive while a reload is running lead to exactly one more
    reload after it has finished, so that the latest state is shown.
-   When the element was removed from the DOM, the event listener is removed.
-   The names `url` and `trigger-event` were chosen over `reload-view` (Zope
    jargon, and the `reload-` prefix is redundant within `data-pat-reload`)
    and `event-trigger` (Patternslib already uses `trigger` and
    `trigger-element`).

## Consequences

-   pat-inject's contract stays unchanged.
-   pat-reload can be used for anything which needs to be reloaded on a
    configurable event - toolbars, breadcrumbs, sidebars, portlets.
-   pat-reload depends on pat-inject's JavaScript API, which expects jQuery
    objects. To interact with it without jQuery events and data, pat-inject
    got a native Promise based API. See ADR 0004.
-   pat-push already does "reload this element on an event", but only for
    push messages and with its own `fetch` and `innerHTML`. It could be built
    upon pat-reload later.
-   Events triggered via jQuery's `.trigger()` - like pat-structure's
    `structure-url-changed` - cannot be used as `trigger-event`, as native
    event listeners don't receive them.
