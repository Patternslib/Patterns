# Bumper

## Description
A bumper is an element that, when the user starts scrolling, stays within view when a viewport border touches it.

## Documentation

Below is a simple example of a bumper.

    <div class="pat-bumper">
       Bumper content
    </div>

When the user starts scrolling the page and an edge of the above div reaches an
edge of the viewport, a `bumped` class will be added. Additionally, it will be
assigned a `bumped-{top|left|right|bottom}` class depending on which edge(s) of
the element was touched by the viewport. If you want the item to stick at the
edge of the viewport you can use this CSS:

    .bumped {
       position: fixed;
    }

    .bumped-top {
       top: 0;
    }

    .bumped-bottom {
       bottom: 0;
    }

    .bumped-left {
       left: 0;
    }

    .bumped-right {
       right: 0;
    }

Please note that classes `bumped-left` and `bumped-right` will not be assigned
at the same time. The same is true for `bumped-top` and `bumped-bottom`.

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
changes. Classes *not* be modified on page load.

### Option reference

The bumped pattern can be configured through a `data-pat-bumper` attribute.
The available options are:

| Property | Default value | Description | Type |
| ----- | ------- | ----------- |
| `margin` | 0| The distance from the edge of the element from which the 'bumped' behaviour will be activated. | Size |
| `selector` | *unset* | CSS selector for elements whose classes must be updated. | CSS selector |
| `bump-add` | `bumped` | CSS class(es) to add when an element is bumped. | String |
| `bump-remove` | *unset* | CSS class(es) to removed when an element is bumped. | String |
| `unbump-add` | *unset* | CSS class(es) to add when an element is no longer bumped. | String |
| `unbump-remove` | `bumped` | CSS class(es) to removed when an element is no longer bumped. | String |
