# 0002 - pat-reload URL resolution relative to the current location

Status: Accepted (2026-11-09)

## Context

pat-reload (ADR 0001) needs a URL which depends on the current location, e.g.
`<current URL>/@@render-toolbar` in Plone.

A fixed URL is wrong after a navigation. Standard relative URL resolution
does not work either: `@@render-toolbar` resolved against `/folder/page`
results in `/folder/@@render-toolbar` - the wrong context.

When the `navigate` event fires, the new URL is not yet committed. After
`navigatesuccess`, `window.location` is up to date (ADR 0003).

Hints in the DOM about the actual context - `<base href>`,
`link[rel=canonical]`, Plone's `data-base-url` on `<body>` - are not updated
on same-document navigations. After `pushState`, they still describe the
initially loaded page.

## Decision

-   Relative URLs are appended to the current location: the current URL
    without query string and hash, with a trailing slash ensured. So
    `@@render-toolbar` on `/folder/page?a=1#x` reloads from
    `/folder/page/@@render-toolbar`.
-   Absolute URLs - with a scheme like `https:`, starting with `//` or with
    `/` - are used as-is.
-   Resolution is done with the standard `new URL(url, base)`, which already
    distinguishes relative and absolute URLs. No custom check, e.g. "starts
    with `http` or `/`", which would miss other schemes and `//`.
-   Like in pat-inject, a `#selector` appended to the URL defines the
    injection source.
-   The base URL is computed in a single method, `get_base_url`, so that it
    can be made configurable later.

## Consequences

-   Relative URLs in pat-reload behave differently from relative URLs in
    links. This is documented.
-   Plone default pages are not handled yet: there, the actual context is a
    content item within the path shown in the URL bar. A configurable base
    URL is to be designed separately. Considerations so far:
    -   An option like `base-url-selector` with a CSS selector, e.g.
        `[data-base-url], link[rel=canonical]`. Other standard sources are
        `<base href>` (reflected in `document.baseURI`); `og:url` is for
        social media and not suitable.
    -   `querySelector` with a selector list returns the first match in
        document order, not in the order of the list. Fallbacks would have
        to be tried one by one - and selectors can contain commas themselves.
    -   The URL is stored in different attributes (`href` vs.
        `data-base-url`), so the attribute to read needs a rule.
    -   The DOM hints are stale after same-document navigations. For
        navigation events, the new location or the event itself (e.g.
        pat-structure's `path`) are the only up-to-date sources - unless the
        navigating code updates the hints.
-   Changing pat-inject's `url` handling the same way was rejected. It would
    have changed the result for every existing relative `url` and `href`
    (ADR 0001).
