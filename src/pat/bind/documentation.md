## Description

The _bind_ pattern provides declarative data binding between DOM elements.
Select a value in one place and have a label, attribute or another field update
elsewhere - without writing any JavaScript.

## Documentation

Binding works through named _channels_. Every `pat-bind` element ties one of its
_accessors_ (a form value, an attribute, its text or its HTML) to a channel.
Elements sharing a channel stay in sync.

A minimal example - a select drives a label:

    <select class="pat-bind" data-pat-bind="key: color">
      <option value="red">Red</option>
      <option value="green">Green</option>
    </select>

    <span class="pat-bind" data-pat-bind="key: color; value: ::text"></span>

When the select changes, the span's text follows.

### Configuration options

Each binding is configured through `data-pat-bind` with the following keys:

-   `key` (**required**): the channel name. Elements with the same `key` (within
    the same scope, see below) are bound together.
-   `value`: the _accessor_ - which part of this element is bound. One of:
    -   `[<attribute>]`: an attribute value, e.g. `[value]`, `[href]`,
        `[class]`, `[aria-pressed]`. For form controls, `[value]` and
        `[checked]` bind to the live form state (and react to `input` /
        `change`), not to the static HTML attribute.
    -   `::text`: the element's text content (`textContent`).
    -   `::html`: the element's HTML content (`innerHTML`). Values are sanitized
        with DOMPurify on write.
    -   _omitted_: inferred from the element. Form controls bind to their value
        (or `checked` for checkboxes and radios); everything else binds to
        `::text`.
-   `direction`: the data-flow direction. One of:
    -   `source`: the element writes into the channel (it is an input).
    -   `target`: the channel writes into the element (it is a display).
    -   `both`: two-way binding.
    -   _omitted_: inferred. Form controls bound to their value/checked default
        to `both`; everything else defaults to `target`.

### Multiple bindings on one element

Separate several bindings with `&&`, just like _pat-inject_:

    <div class="pat-bind"
         data-pat-bind="key: user_name; value: ::text &&
                        key: theme; value: [class]"></div>

This element shows the `user_name` channel as its text and mirrors the `theme`
channel onto its `class` attribute.

### Two-way binding

Form controls are two-way by default, so two fields on the same channel mirror
each other:

    <input class="pat-bind" data-pat-bind="key: name" />
    <input class="pat-bind" data-pat-bind="key: name" />

Typing in either input updates the other.

To bind a non-form element two-way - for example a `contenteditable` region -
request it explicitly:

    <div contenteditable class="pat-bind"
         data-pat-bind="key: note; value: ::text; direction: both"></div>

### Scope

By default all channels live in a single, document-wide namespace. To reuse the
same channel name in independent regions - the typical case being repeated
content such as a list of cards - mark a container with `data-pat-bind-scope`.
Channel lookups resolve to the nearest scope ancestor, falling back to the
document.

    <div class="card" data-pat-bind-scope>
      <input class="pat-bind" data-pat-bind="key: price" />
      <span  class="pat-bind" data-pat-bind="key: price; value: ::text"></span>
    </div>
    <!-- repeated; each card keeps its own `price` channel -->

### Notes

-   Channel values are strings, except `[checked]` which is a boolean.
-   Targets are only written once a channel has a value, so server-rendered
    content is left untouched until a source provides data.
-   Two-way binding on `::text` / `::html` relies on a `MutationObserver` and is
    intended for editable elements; for plain displays prefer a `target`
    binding.

### Relation to other patterns

_pat-bind_ is built on the reactive primitives in `core/signals` (a small
`signal` / `computed` / `effect` implementation shaped after the TC39 signals
proposal). The signals are an implementation detail - the page author only ever
writes markup.
