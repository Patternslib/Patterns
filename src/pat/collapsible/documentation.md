## Description

A _collapsible_ is an element where content is can be shown or visible by clicking on a triggering element.

## Documentation

A _collapsible_ is an element inside which content can be shown or hidden
by clicking on a triggering element. One way to use this is to implement
a very minimal accordion.

    <section class="pat-collapsible">
      <h3>About us</h3>
      <p>Sed ut perspiciatis unde omnis iste natus error sit...</p>
      <p>Neque porro quisquam est, qui dolorem ipsum quia...</p>
    </section>

In the above example clicking on the _About us_ header will hide or
show the remainder of the section content. Another possible use case is
to create a simple contextual menu.

    <div class="pat-collapsible">
      <h3><i class="icon-wrench"></i> Settings</h3>
      <ul>
        <li><a href="...">Edit</a></li>
        <li><a href="...">Rename</a></li>
        <li><a href="...">Move</a></li>
        <li><a href="...">Delete</a></li>
      </ul>
    </div>

Collapsibles default to being open. You can change this by adding a
`closed` class to the collapsible.

### Custom triggers

The standard behaviour is to use the first element as the trigger to open or
close a collapsible. You can also use the `trigger` option to specify a
different element.

    <button id="trigger">About us</button>

    <aside class="pat-collapsible" data-pat-collapsible="trigger: #trigger">
      <h3>About us</h3>
      <p>Sed ut perspiciatis unde omnis iste natus error sit...</p>
      <p>Neque porro quisquam est, qui dolorem ipsum quia...</p>
    </aside>

You can also specify triggers specifically for _closing_ or _opening_ a
collapsible.

The options for doing so are **open-trigger** and **close-trigger**.

    <button id="open-trigger">About us</button>

    <aside class="pat-collapsible" data-pat-collapsible="open-trigger: #open-trigger">
      <h3>About us</h3>
      <p>Sed ut perspiciatis unde omnis iste natus error sit...</p>
      <p>Neque porro quisquam est, qui dolorem ipsum quia...</p>
    </aside>

## Markup structure

The markup structure for a collapsible is very simple: the first child
of an element with the `pat-collapsible` class will be used as the
triggering element (unless otherwise configured) and will always be visible.

All further children will be part of the content that collapses.

The containing element will get a `open` or `closed` class which indicates if
the collapsible is currently open (content is visible) or closed (content is
not visible). Likewise the triggering element will get a `collapsible-open` or
`collapsible-closed` class. the content of the collapsible is wrapped in a new
`div` element with class `panel-content`.

Post-processing our first example will look like this after the
collapsible pattern has initialised:

    <section class="pat-collapsible open">
      <h3 class="collapsible-open">About us</h3>
      <div class="panel-content">
        <p>Sed ut perspiciatis unde omnis iste natus error sit...</p>
        <p>Neque porro quisquam est, qui dolorem ipsum quia...</p>
      </div>
    </section>

### AJAX loading of content

Occasionally you may want to display content in a collapsible that
should be loaded on demand. This is supported through the `load-content`
option. Using this option you can provide a URL for content that should
be loaded and shown in a collapsible when it is opened.

    <section class="pat-collapsible"
        data-pat-collapsible="load-content: /status.html#summary">
      <h3>System status</h3>
    </section>

This example will load the system status from `/status.html`, extract
the element with the id `summary` and use that as the panel content.
When the collapsible is closed and reopened the content is reloaded.

### Remembering the state

Sometimes you need to remember the toggle state of an collapsible. This
can be done by telling the collapsible pattern to store the state of an
element using the `store` parameter.

    <section id="about-us" class="pat-collapsible"
            data-pat-collapsible="store: session">
      <h3>About us</h3>
      ...
    </section>

To use this you requirements must be met:

1.  the element must have an `id`
2.  The browser must support [Web Storage](http://www.w3.org/TR/webstorage/)

The possible values for the `store` parameter are:

- `none`: do not remember the toggle state (default).
- `local`: remember the state as part of the local storage.
- `session`: remember the status as part of the session storage.

### Transitions

You can specify the transition effect to use when a collapsible
is opened or closed. The default behaviour is to not use a slide transition.
If you prefer to control the effect completely with CSS you can use the `css`
transition.

    <style>
      .pat-collapsible {
          transition-property: opacity;
          transition-duration: 1s;
      }
      .open {
          opacity: 1;
      }

      .closed {
          opacity: 0;
      }
    </style>

    <section class="pat-collapsible" data-pat-depends="transition: css">
      <h3>System status</h3>
      ...
    </section>

This allow full control in CSS, including the use of animation for
browsers supporting CSS animation. Two non-CSS based animation options
are also included: `fade` will fade the element in and out, and `slide`
uses a vertical sliding effect. During a transition an `in-progress`
class will be set on the element.

### Option reference

The collapsible can be configured through a `data-pat-collapsible`
attribute. The available options are:

| Field             | Default   | Description                                                                                                                                                          |
| ----------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `load-content`    |           | A URL (possibly including a fragment id) for content which must be loaded and used as content for the collapsible.                                                   |
| `trigger`         | `::first` | Selector used to identify the open/close trigger for the collapsible.                                                                                                |
| `close-trigger`   |           | Selector used to identify a trigger for closing the collapsible.                                                                                                     |
| `open-trigger`    |           | Selector used to identify a trigger for opening the collapsible.                                                                                                     |
| `store`           | `none`    | How to remember the state of a collapsible. Must be one of `none`, `session` or `local`.                                                                             |
| `transition`      | `slide`   | Transition effect when opening or closing a collapsinble. Must be one of `none`, `css`, `fade`, `slide` or `slide-horizontal`.                                       |
| `effect-duration` | `fast`    | Duration of transition. This is ignored if the transition is `none` or `css`.                                                                                        |
| `effect-easing`   | `swing`   | Easing to use for the open/close animation. This must be a known jQuery easing method. jQuery includes `swing` and `linear`, but more can be included via jQuery UI. |
