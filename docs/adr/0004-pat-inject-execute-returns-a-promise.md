# 0004 - pat-inject's execute returns a Promise

Status: Accepted (2026-11-09)

## Context

Code which starts injections via pat-inject's JavaScript API - like
pat-reload (ADR 0001) - needs to know when an injection has finished and
whether it succeeded, e.g. to reload once more after a running injection.

The injection state was only available via jQuery:

-   pat-ajax triggers `pat-ajax-success` and `pat-ajax-error` with jQuery's
    `.trigger()`. Native event listeners - including
    `events.add_event_listener` - don't receive jQuery-triggered custom
    events.
-   The "injection in progress" flag is stored as jQuery data
    (`pat-inject-triggered`).

`execute` started the request and returned `undefined`. Errors were handled
by pat-inject itself (error pages, error message), with no way for the
calling code to react.

A first step returned a boolean "started" from `execute` and added a native
`pat-inject-finished` event. Listening to an event after calling a method
needs filtering of events bubbling up from nested injections and still does
not allow `async`/`await`. `events.await_event` does not filter by target and
never settles if the event never comes.

## Decision

`inject.execute(cfgs, $el)` returns a Promise which settles when the
injection has finished:

-   It resolves to `true` if the content was injected.
-   It resolves to `false` if the injection was not started - invalid
    configuration, denied confirmation or an injection already in progress -
    or if there was nothing to inject.
-   It rejects with an `Error` if the request failed with a network error or
    an HTTP error status. The error's `cause` is the jqXHR object.
    pat-inject's own error handling is done before.
-   It also waits for injections with a `process-delay`.

Additionally, a native `pat-inject-finished` event is dispatched on the
element right before the Promise settles, for code which did not call
`execute` itself.

Usage:

```javascript
try {
    const injected = await inject.execute(cfgs, $el);
} catch (error) {
    log.warn("Could not load.", error);
}
```

## Consequences

-   This is a breaking change: code which calls `execute` and ignores the
    return value now gets unhandled Promise rejections ("Uncaught (in
    promise)") for failed requests. The internal callers in pat-inject,
    pat-collapsible and pat-expandable-tree catch them. No callers were found
    in Mockup or the add-ons in `REPOS-pat`.
-   pat-reload uses `async`/`await` with `try`/`catch` and does not need any
    jQuery events or data. It still needs jQuery objects to call pat-inject's
    API.
-   The Promise only settles if pat-ajax reports the result of the request.
    pat-ajax silently dropped results of concurrent requests to the same URL
    from different elements, which would leave the Promise unsettled forever.
    This was fixed, see ADR 0005.
