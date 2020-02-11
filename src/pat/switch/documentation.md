## Description

Add and remove classes from elements when a user clicks on a switch.

## Documentation

It is possible to add or remove classes when a user clicks on an item.
This is done by adding a `pat-switch` class along with a
`data-pat-switch` attribute to the triggering element.

    <button class="pat-switch" data-pat-switch="#status off on">Power on</button>
    <span id="status" class="off"/>

If a user clicks on the _Power on_ button, the `off` class will be
removed and the `on` class will be added. Note that this is similar to
the toggle pattern. This pattern only triggers once though, while the
toggle pattern toggles between two states.

This pattern takes three properties:

- `selector`: the CSS selector identifying the elements that must be
  updated
- `remove`: the class that should be added
- `add`: a class that should be removed

You must provide the selector and at least one of _remove_ or _add_.

You can use wildcards to identify classes that should be removed by
using a wildcard (the `*` character) in the class name:

    <button class="pat-switch" data-pat-switch=".toolbar icon-*">Remove icons</button>

Multiple changes can be provided if desired by separating them using the
`&&` separator. The example below uses this to remove all icon classes
in both the toolbar and the navigation tree:

    <button class="pat-switch" data-pat-switch=".toolbar icon-* && .navtree; icon-*">Remove icons</button>

### Options reference

You can customise the behaviour of a switches through options in the
`data-pat-switch` attribute.

| Property   | Default value | Values                   | Description                                                                                                                                                                                          | Type               |
| ---------- | ------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `selector` |               |                          | jQuery selector matching elements that should be updated.                                                                                                                                            |                    |
| `remove`   |               |                          | Space-separated list of classes to remove.                                                                                                                                                           |                    |
| `add`      |               |                          | Space-separated list of classes to add.                                                                                                                                                              |                    |
| `store`    | `none`        | `none` `session` `local` | How to store the state of a toggle. `none` does not remember the toggle state, `local` stores the state as part of the local storage and `session` stores the status as part of the session storage. | Mutually exclusive |
