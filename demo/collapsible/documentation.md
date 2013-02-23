# Documentation

A *collapsible* is an element where content is can be shown or visible
by clicking on a triggering element. One way to use this is to implement
a very minimal accordeon.

    <section class="pat-collapsible">
      <h3>About us</h3>
      <p>Sed ut perspiciatis unde omnis iste natus error sit...</p>
      <p>Neque porro quisquam est, qui dolorem ipsum quia...</p>
    </section>

In the above example clicking on the *About us* header will hide or
shown the remainder of the section content. Another possible use case is
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

Markup structure
----------------

The markup structure for a collapsible is very simple: the first child
of an element with the `pat-collapsible` class will be used as the
triggering element and will always be visible. All further children will be
part of the content.

The trigger element will get a `open` or `closed` class which indicates
if the collapsible is currently open (content is visible) or closed
(content is not visible). Second the content of the collapsible is
wrapped in a new `div` element with class `panel-content`.

Post-processing our first example will look like this after the
collapsible pattern has initialised:

    <section class="pat-collapsible open">
      <h3>About us</h3>
      <div class="panel-content">
        <p>Sed ut perspiciatis unde omnis iste natus error sit...</p>
        <p>Neque porro quisquam est, qui dolorem ipsum quia...</p>
      </div>
    </section>

AJAX loading of content
-----------------------

Occasionally you may want to display content in a collapsible that
should be loaded on demand. This is supported through the `load-content`
option. Using this option you can provide a URL for content that should
be loaded and shown in a collapsibnle when it is opened.

    <section class="pat-collapsible"
        data-pat-collapsible="load-content: /status.html#summary">
      <h3>System status</h3>
    </section>

This example will load the system status from `/status.html`, extract
the element with the id `summary` and use that as the panel content.
When the collapsible is closed and reopened the content is reloaded.

Remembering the state
---------------------

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
2.  The browser must support [Web
    Storage](http://www.w3.org/TR/webstorage/)

The possible values for the `store` parameter are:

-   `none`: do not remember the toggle state (default).
-   `local`: remember the state as part of the local storage.
-   `session`: remember the status as part of the session storage.

Option reference
----------------

The collapsible can be configured through a `data-pat-collapsible`
attribute. The available options are:

| Field          | Default | Description                               |
| -------------- | ------- | ----------------------------------------- |
| `load-content` |         | A URL (possibly including a fragment id) for content which must be loaded and used as content for the collapsible. |
| `store`        | `none`  | How to remember the state of a collapsible. Must be one of `none`, `session` or `local`. |
| `duration`     | `0.4s`  | Duration of the open/close animation. |
| `easing` 		 | `swing` | Easing to use for the open/close animation. This must be a known jQuery easing method. jQuery includes `swing` and `linear`, but more can be included via jQuery UI. |
