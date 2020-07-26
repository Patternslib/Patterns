## Description

A bumper is an element that, when the user starts scrolling, stays within view when a viewport border touches it.

## Documentation

Below is a simple example of a bumper.

    <div class="pat-bumper">
       Bumper content
    </div>

When the user starts scrolling the page and the top edge of the above div reaches the top
edge of the viewport, a `bumped` class will be added. For this to work the pattern
will automatically set the `position` of the div to `relative`.

### Bumpers in scrolling containers

You can also put a bumper in a scrolling container. Here is an example:

    <div class="container">
      <em class="pat-bumper">Hello!</em>
      <p>...</p>
    </div>

If the container has its overflow style set to `auto` or `scroll` and its
contents do not fit in the available space the browser will automatically
add scrollbars. The bumper pattern will detect this and _stick_ the bumped
element so it is always visible in its container.

To implement this the bumper pattern will set the `position` of both the
bumper and its scrolling container to `relative`.

### Class specification

You can configure which classes must be set or removed on the element when it
is bumped, or no longer bumped. For example if you want to add an extra
`floating` class if the element not bumped you can do this:

    <div class="pat-bumper" data-pat-bumper="bump-remove: floating; unbump-add: floating">
       Bumper content
    </div>

This will add a `floating` class when the element is no longer bumped, and
remove it when the element becomes bumped. See the option reference below
for the full list of options that are available to configure the class
management.

Please note that classes will only be changed when the bump-status of the element
changes. Classes _not_ be modified on page load.

### Option reference

The bumped pattern can be configured through a `data-pat-bumper` attribute.
The available options are:

| Property        | Default value | Description                                                                                                               | Type         |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `margin`        | 0             | The distance (in pixels) from the edge of the element from which the 'bumped' behaviour will be activated.                | Number       |
| `selector`      | _unset_       | CSS selector for elements whose classes must be updated.                                                                  | CSS selector |
| `bump-add`      | `bumped`      | CSS class(es) to add when an element is bumped.                                                                           | String       |
| `bump-remove`   | _unset_       | CSS class(es) to removed when an element is bumped.                                                                       | String       |
| `unbump-add`    | _unset_       | CSS class(es) to add when an element is no longer bumped.                                                                 | String       |
| `unbump-remove` | `bumped`      | CSS class(es) to removed when an element is no longer bumped.                                                             | String       |
| `side`          | `top`         | The side which should bump. A combination of `all top right bottom left`. `all` is equivalent to `top right bottom left`. | String       |
