## Description

Reload the content of an element when an event is fired - by default, when
the browser navigated to another URL without a full page load.

This is useful for parts of a page which depend on the current location but
are not part of the content which changes, like toolbars, breadcrumbs or
sidebars.

## Documentation

`pat-reload` defines _when_ and _from which URL_ to reload. The actual
injection - _what_ is fetched and _where_ it goes - is done by `pat-inject`,
configured via a `data-pat-inject` attribute on the same element.

### Reload on navigation

    <div
        class="pat-reload"
        data-pat-reload="url: @@render-toolbar#toolbar"
    >
        …
    </div>

After each same-document navigation, which changed the URL (e.g. via
`history.pushState`), the element's content is replaced with the content of
the `#toolbar` element from `<current URL>/@@render-toolbar`.

Hash changes and `replaceState` calls which do not change the URL do not
trigger a reload.

### URL resolution

-   Relative URLs are appended to the current URL (without query string and
    hash): `@@render-toolbar` on `/folder/page?a=1` reloads from
    `/folder/page/@@render-toolbar`.
-   Absolute URLs - starting with a scheme like `https:`, with `//` or with `/`
    \- are used as-is.

Note: This is different from relative URLs in links, where `@@view` on
`/folder/page` resolves to `/folder/@@view`.

Like in `pat-inject`, a selector can be appended to the URL after a `#`.

### Injection configuration

By default, the content is injected into the element itself. Use
`data-pat-inject` for other targets, sources or multiple injections:

    <div
        class="pat-reload"
        data-pat-reload="url: @@render-toolbar"
        data-pat-inject="source: #toolbar-main; target: #toolbar-main &&
                         source: #personal-tools; target: #personal-tools"
    >
        …
    </div>

Do not add the `pat-inject` class to the element. `pat-reload` uses only
`pat-inject`'s configuration and injection logic.

### Reload on other events

    <div
        class="pat-reload"
        data-pat-reload="url: @@render-toolbar#toolbar; trigger-event: toolbar-changed"
    >
        …
    </div>

Navigation API events (`navigate`, `navigatesuccess`, `navigateerror`,
`currententrychange`) are listened to on `window.navigation`, all other events
on `document`. So any event which bubbles up to the document can be used. For
non-navigation events the reload happens on every event, regardless of URL
changes.

Note: Events which are triggered via jQuery's `.trigger()` cannot be listened
to with native event listeners.

### Rapid successive events

Use `delay` to debounce rapid successive events. Only one reload is done after
no event was fired for the given time.

If an event is fired while a reload is still in progress, one more reload is
done after the running one has finished.

### Option reference

| Property        | Default value     | Description                                                                                                                  | Type   |
| --------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------ |
| `url`           |                   | Required. The URL to reload from. Relative URLs are appended to the current URL. A `#selector` defines the injection source. | String |
| `trigger-event` | `navigatesuccess` | The event which triggers a reload.                                                                                           | String |
| `delay`         | `0`               | Debounce time in milliseconds, or with unit (`ms`, `s`, `m`), between successive events.                                     | String |
