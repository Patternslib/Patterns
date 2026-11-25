# 0005 - pat-ajax handles the latest request per element

Status: Accepted (2026-11-09)

## Context

Since 2016, pat-ajax only handles the result of the latest request: "if this
url is requested multiple time, only return the last result". The intention
is that, e.g. for a search form submitted multiple times in a row, an
outdated response does not overwrite a newer one.

The requests were counted per URL, globally for the whole page. When two
different elements requested the same URL at the same time, the first
element never received a `pat-ajax-success` event:

-   pat-inject's "injection in progress" state of that element was never
    reset, so it could never inject again.
-   The Promise returned by `inject.execute` (ADR 0004) never settled, so
    e.g. pat-reload (ADR 0001) would stop reloading.

## Decision

-   Requests are counted per element, using a `WeakMap`.
-   The latest request of an element wins - regardless of its URL. Counting
    per element _and_ URL was rejected, as then an outdated response of the
    same element requesting different URLs (e.g. different `formaction`
    buttons) could still overwrite a newer one.

## Consequences

-   Different elements requesting the same URL at the same time each get
    their response.
-   The original behavior for repeated requests of the same element is kept.
-   Errors are still not filtered: a failed outdated request still triggers
    `pat-ajax-error` while a newer request is running. Through pat-inject
    this cannot happen, as an element cannot have two injections running at
    the same time. It only affects bare `.pat-ajax` elements.
