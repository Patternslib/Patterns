## Description

Pumber Pattern - Add bumping classes for sticky elements.

A bumper is an element that, when the user starts scrolling, stays within view when a viewport border touches it.

## Documentation

Below is a simple example of a bumper.

    <div class="pat-bumper">
       Bumper content
    </div>

When the user starts scrolling the page and the top edge of the above div
reaches the top edge of the viewport, a `bumped` class and - depending on the
bumping edges - `bumped-top`, `bumped-right`, `bumped-botton` or `bumped-left`
classes will be added.

It's up to you to style the element with the help of these classes. You might
also want to set the element to `position: sticky`, so that it keeps it's
position relative to the viewport while scrolling.

### Bumpers in scrolling containers

You can also put a bumper in a scrolling container. Here is an example:

    <div class="container">
      <em class="pat-bumper">Hello!</em>
      <p>...</p>
    </div>

If the container has its `overflow` style set to `auto` or `scroll` and its
contents do not fit in the available space the browser will automatically add
scrollbars. When the `pat-bumper` element touches any edge of the scrolling
container the bumper classes will be added.

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
| `selector`      | _unset_       | CSS selector for elements whose classes must be updated.                                                                  | CSS selector |
| `bump-add`      | `bumped`      | CSS class(es) to add when an element is bumped.                                                                           | String       |
| `bump-remove`   | _unset_       | CSS class(es) to removed when an element is bumped.                                                                       | String       |
| `unbump-add`    | _unset_       | CSS class(es) to add when an element is no longer bumped.                                                                 | String       |
| `unbump-remove` | `bumped`      | CSS class(es) to removed when an element is no longer bumped.                                                             | String       |
