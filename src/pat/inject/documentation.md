## Description

Injection makes it trivial to load content from a server and display it on a web page with a rich, modern web experience without any page reloads. Pat-inject works on existing infra structures, is designed with respect for accessibility and follows the principles of progressive enhancement.

## Documentation

### Concept

Injection is an enhancement on regular HTML links that point from one HTML page to another. Without JavaScript and injection, you would keep this standard behaviour. With JavaScript and pat-inject, a richer experience is created for modern graphical browsers.

Pat-inject intercepts the page refresh, invisibly collects the remote page, extracts parts out of it that you're interested in and replaces the content somewhere on the currently visible page without refreshing the browser window.

The principle is illustrated in the following graphic.

![image](/src/pat/inject/injection-single.svg)

This typical example illustrates how in this case the content of the main content region is replaced by the content of the same region of another page. One could for instance create a series of links styled as tabs this way, which would each refresh the content area of the page, without refreshing the browser window.

A slightly more complex case is illustrated below. You see how multiple regions are extracted out of one page and injected into similar areas on another page. It doesn't matter if the regions on the remote page are differently named or styled.

![image](/src/pat/inject/injection-multiple.svg)

It's also possible to inject content from another page into a modal panel:

![image](/src/pat/inject/injection-modal.svg)

The possibilities don't stop here. Other applications of injection include injection in tooltips (pat-tooltip) and injection in 'self healing messages' (Similar to Mac OS banners or Growl) (pat-notification). Those ways of working with injection are explained in the respective documentation sections of the components pat-tooltip and pat-notification.

### Code examples

The most simple form of injection is a link which loads content when clicked:

    <a href="demos/frobber.html#demo-content" class="pat-inject">Demo the frobber</a>

    <section id="demo-content">
      …
    </section>

When a user clicks this link `demos/frobber.html` will be fetched via AJAX, the element with id `demo-content` is extracted and used to replace the content of `#demo-content` on the current page.

In another situation you may not want to replace content but add new content. You can easily do that by using a modifier:

    <a href="latest-news.html#demo-content" class="pat-inject"
       data-pat-inject="target: #news::before">Tell me more</a>

    <section id="news">
      …
    </section>

In this example clicking on the _Tell me more_ link will load the latest news content and inject it before the content of `#news`.

Perhaps inserting a single block of content is not enough for your needs? Don't worry! Let's give you another example:

    <section id="section">
      <form action="/my/form" class="pat-inject"
       data-pat-inject="#demo-content #section && #notice #notices::after">
        …
      </form>
    </section>

When you submit this form two things happen: `#demo-content` from the
response is used to replace `#section`'s content of the page, replacing the current form with a new form or a feedback message. In addition a `#notice` element is extracted from the response and added at the bottom
of `#notices`.

### Where and what to inject

The most simple injection fetches a source via AJAX, extracts its body's content and replaces the current body's content with it:

    <a href="news.html" class="pat-inject">
      Display news content in body content
    </a>

Admittedly, this is a rare use case. However, it is ideal for understanding the defaults:

> Default selector and source and target selector
>
> The default selector is `body` and will be used as target and source
> selector, unless one or both of them are overridden.

> By default we work with/on content
>
> For `target` and `source` by default the content is selected and
> worked on.

In the next section you learn how to use element ids as `source` and `target` selectors, which covers most use cases. These can be combined with modifiers and finally the full injection power is unleashed with arbitrary jQuery selectors.

XXX: add references to the sections.

### Select individual elements via `#id`

The simple injections replace the content of an element in `target` with the content of an element in `source`. There is a one-to-one relation between elements in source and target:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src1; target: #tgt1 &&
                        source: #src2; target: #tgt2">
      Multi-injection with a one-to-one mapping.
    </a>

In case one source element is to be used for both targets, it can be specified as part of the `href` (or `action` in case of forms):

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src; target: #tgt1 &&
                        source: #src; target: #tgt2">
      One source element for two targets.
    </a>

    <a class="pat-inject" href="sources.html#src"
       data-pat-inject="target: #tgt1 &&
                        target: #tgt2">
      One source element for two targets, source specified via href.
    </a>

The source id specified as part of `href`/`action` is the default source selector and can be overriden for one or more injections:

    <a class="pat-inject" href="sources.html#src"
       data-pat-inject="target: #tgt1 &&
                        target: #tgt2 &&
                        source: #other; target: #tgt3">
      One injection overrides the default source element.
    </a>

Sometimes it is useful to use the triggering element itself as a target.

This can be done by using the special _self_ target:

    <a class="pat-inject" href="sources.html" data-pat-inject="target: #self">
      Replace me with sources.html.
    </a>

### Modifiers

So far you can replace the target element's content with the source element's content.
In order to work on the actual elements, or to place things relative to theselected elements, we have three modifiers:

`::element`
Select the element, instead of the content.

Can be used for `source` and `target`, and in case of the latter be combined with `::before`/`::after`.

`::before`
Like in CSS, the pseudo-element (a position) right before the content of the target element. The so far non-existing, but soon-to-be first child of the target element.

Can be used for `target` and combined with `::element`.

`::after`
Like in CSS, the pseudo-element (a position) right before the content of the selected element. It can be used for the `target` and combined with `::element`.

Let's see these in action and combination:

#### Still working on content

Replace target content with source content (default, just a reminder):

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src; target:  #tgt">

Put source content before target content:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src; target: #tgt::before">

Put source content after target content:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src; target: #tgt::after">

#### Elements instead of content

Replace target element with source element:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src::element; target: #tgt::element">

Put source element before target element:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src::element; target: #tgt::element::before">

Put source element after target element:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src::element; target: #tgt::element::after">

#### Mixing element and content

Replace target element with source content:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src; target: #tgt::element">

Replace target content with source element:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src::element; target: #tgt">

Source content before target element:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src; target: #tgt::element::before">

Source content after target element:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src; target: #tgt::element::after">

Source element before target content:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src::element; target: #tgt::before">

Source element after target content:

    <a class="pat-inject" href="sources.html"
       data-pat-inject="source: #src::element; target: #tgt::after">

### Using full-blown jQuery selectors

For both selectors every conceivable jQuery selector is allowed. If multiple elements match, all will be replaced.

    <a class="pat-inject" href="sources.html"
       data-pat-inject="target: #parentid > .childrensclass">
    ...
    <div id="parentid">
      <div class="childrensclass">
        to be replaced by sources.html's body
      </div>
      <div class="childrensclass">
        to be replaced by sources.html's body
      </div>
      <div>to stay untouched</div>
    </div>

### Non-existing targets

In case the target selector returns no elements, we will attempt to create a matching element for you.

So far we are able to handle 'target' selectors that consist of only an id: A `div` with that id will be created and injected as the last child of `body`:

    <a class="pat-inject" href="sources.html" data-pat-inject="target: #non-existing">
    …
    </body>

After the injection:

    <a class="pat-inject" href="sources.html" data-pat-inject="target: #non-existing">
    …
    <div id="non-existing">
      Content of body of sources.html
    </div>
    </body>

## Trigger

By default injection is triggered on click for anchors and on submit for forms. Further, it can be triggered upon initialisation (`autoload`) and when coming into view (`autoload-visible`). `autoload` injection is useful to deliver a page skeleton, where e.g. header, body, and sidebar load their content in parallel. `autoload-visible` injection is useful
to build infinite lists, where the injection element replaces itself with the next 10 entries and a new `autoload-visible` injection link.

A `autoload` may be delayed, by providing a `delay` argument in `data-pat-inject`. The delay is specified in milliseconds. This is useful to build a polling loop. Note that using this in combination with other injections may create race conditions with weird effects. This `delay` is only supported for `autoload`, not for `autoload-visible` or for click triggers).

    <a href="sources.html#id" class="pat-inject"
       data-pat-inject="trigger: autoload">Autoloads as soon as initialised</a>

    <a href="sources.html#id" class="pat-inject"
       data-pat-inject="trigger: autoload-visible">Autoloads as soon as visible</a>

    <a href="sources.html#id" class="pat-inject"
       data-pat-inject="trigger: autoload; delay: 2000">Autoloads 2 seconds after the page is initialised.</a>

<!--
XXX: example infinite list
-->

### Change href after injection

_Note: This feature is experimental_

For anchors, you can specify an href to point to, after the injection was triggered. If that element exists already during initialisation, the injection is not initialised and the href changed to next-href.

before:

    <a class="next-month pat-inject" ref="calendar.html#2012-05"
       data-pat-inject="post: #2012-04; next-href: 2012-05">Next month</a>
    …
    <div class="month" id="2012-04">
      …
    </div>

after:

    <a class="next-month" href="#2012-05" data-pat-inject="">Next month</a>
    …
    <div class="month" id="2012-04">
        …
    </div>
    <a class="next-month pat-inject" ref="calendar.html#2012-06"
       data-pat-inject="post: #2012-05; next-href: #2012-06">Next month</a>
    	…
    <div class="month" id="2012-05">
    	…
    </div>

### Modals

Inject a modal panel: modal-source.html is fetched, its body's content is wrapped into a `div#modal.modal`, any existing such modal is removed and the new modal injected as last element of the body:

    <a class="pat-inject" href="modal-source.html" data-pat-inject="type: modal">
      …
    </body>

It corresponds and is shorthand notation for:

    <a class="pat-inject" href="modal-source.html" data-pat-inject="target: div#modal.modal">
    …
    </body>

After injection was triggered:

    <a class="pat-inject" href="modal-source.html" data-pat-inject="type: modal">

    <div id="modal" class="pat-modal">
      Content from modal-source.html's ``body``.
    </div>
    </body>

    <a class="pat-inject" href="modal-source.html" data-pat-inject="type: modal">

### Options reference

You can customise the behaviour of injection through options in the `data-pat-inject` attribute.

    <a href="#" class="pat-inject" data-pat-inject="type: modal">
      …
    </a>

| Property          | Default value                               | Values                                  | Description                                                                                                                                                                                                                                                                                                                                                                                     | Type                                         |
| ----------------- | ------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `confirm`         | `class`                                     | class, always, never, form-data         | Should a confirmation prompt be shown to the user before injection happens? Setting this to `form-data` means a prompt will be shown if there are form fields with values that will be replaced with the injected content. A value of `class` means that the pattern will check for the `is-dirty` CSS class on the target element. If the class is there, a confirmation prompt will be shown. | One of the allowable values.                 |
| `confirm-message` | `Are you sure you want to leave this page?` |                                         | What message should be shown to the user in the confirmation prompt?                                                                                                                                                                                                                                                                                                                            |                                              |
| `selector`        | `body`                                      |                                         | Selector identifying which section of the loaded document to inject.                                                                                                                                                                                                                                                                                                                            | Selector string                              |
| `target`          | `body`                                      |                                         | Selector identifying where to inject the loaded content.                                                                                                                                                                                                                                                                                                                                        | Selector string                              |
| `data-type`       | `html`                                      | `html` `markdown`                       | The type of content that is loaded. This is normally detected automatically.                                                                                                                                                                                                                                                                                                                    | One of the mutually exclusive string values. |
| `next-href`       |                                             |                                         | For anchors, you can specify an href to point to after injection was triggered. If that element exists already during initialisation, the injection is not initialised and the href changed to next-href.                                                                                                                                                                                       |                                              |
| `trigger`         | `default`                                   | `default` `autoload` `autoload-visible` | Determines when injection happens: on manual click (`default`), directly on page load (`autoload`) or when the trigger becomes visible (`autoload-visible`)                                                                                                                                                                                                                                     | One of the mutually exclusive values.        |
| `url`             |                                             | _href attribute_                        | URL to load content from.                                                                                                                                                                                                                                                                                                                                                                       | URI string.                                  |
| `class`           |                                             |                                         | A class which will be added to the injected content. Multiple classes can be specified (separated with spaces).                                                                                                                                                                                                                                                                                 | String                                       |
| `loading-class`   | 'injecting'                                 |                                         | A class which will be added to the injection target while content is still being loaded. Multiple classes can be specified (separated with spaces), or leave empty if no class should be added.                                                                                                                                                                                                 | String                                       |
| `history`         | `record`                                    | `none` `record`                         | If set to `record` (default) then injection will update the URL history and the title tag of the HTML page.                                                                                                                                                                                                                                                                                     | One of the mutually exclusive string values. |
| `hooks`           | `[]`                                        | `["raptor"]`                            | Once injection has completed successfully, pat-inject will trigger an event for each hook: pat-inject-hook-\$(hook). Useful for other patterns which need to know whether injection relevant to them has finished, for example `pat-raptor`.                                                                                                                                                    | String.                                      |
