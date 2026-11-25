# 0003 - React to navigations on navigatesuccess, not navigate

Status: Accepted (2026-11-09)

## Context

The Navigation API's `navigate` event fires _before_ a navigation is
committed:

-   `window.location` still has the old URL.
-   The navigation might still be cancelled.
-   It also fires for navigations which unload the page (link clicks to other
    pages, form submissions, reloads). Starting a request there is wasted.
-   Passing the event on to code which calls `preventDefault()` - like
    pat-inject's `onTrigger` - cancels the navigation.

Patternslib's basic Navigation API polyfill (`src/core/polyfills.js`) for
browsers without the API only fired `navigate`, and - unlike the native
implementation - only _after_ `pushState` and `replaceState` changed the URL.
Native and polyfilled timing differed.

pat-inject also calls `replaceState` without changing the URL to mark
history entries: `"pageload"` at module load and `"anchor"` on hash
navigations. These fire navigation events too.

## Decision

-   Code reacting to navigations listens to `navigatesuccess`. Then the
    navigation is committed and `window.location` is up to date.
-   The polyfill also fires `navigatesuccess` after `pushState` and
    `replaceState`. So `navigatesuccess` has the same timing natively and
    polyfilled.
-   Navigation-triggered reloads only happen if the URL without the hash has
    changed. This ignores hash changes and same-URL `replaceState` calls.

## Consequences

-   pat-reload uses `navigatesuccess` by default (ADR 0001).
-   `navigatesuccess` carries no destination; the new URL is read from
    `window.location`.
-   Back/forward navigations after pat-inject `history: record` injections
    trigger a full page reload by pat-inject's `popstate` handler anyway. A
    navigation-triggered request might still be started right before that.
-   The Navigation API is supported in all major browsers by now. Whether the
    polyfill is still needed should be re-evaluated.
