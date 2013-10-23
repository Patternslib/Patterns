# Bumper

## Description
A bumper is an element that, when the user starts scrolling, stays within view when a viewport border touches it.

## Documentation
Below is a simple example of a bumper.

    <div class="pat-bumper">
       Bumper content
    </div>

When the user starts scrolling the page and an edge of the above DIV
reaches an edge of the viewport, a `bumped` class will be added.
Additionally, it will be assigned a `bumped-{top|left|right|bottom}`
class depending on which edge of the element was touched by the
viewport. The default classes should look like

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

Please note that classes `bumped-left` and `bumped-right` will not be
assigned at the same time. The same is true for `bumped-top` and
`bumped-bottom`.


Option Reference
----------------

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
