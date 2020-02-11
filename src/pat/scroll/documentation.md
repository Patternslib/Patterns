## Description

The _scroll_ pattern allows you to implement smooth scrolling towards an anchor in the page.

## Documentation

The _scroll_ pattern makes it possible to configure when and how elements
should be scrolled in your page.

### Examples

Scrolling when the user clicks on the link

    <ul class="mainnav">
    <li>
        <a href="#p1" class="pat-scroll">
            <!-- The default trigger is "click" -->
            Jump to the paragraph
        </a>
    </li>
    </ul>

    <p id="p1">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco.
        Duis aute irure dolor in reprehenderit in voluptate velit.
    </p>

Automatically scrolling once the page loads

    <ul class="mainnav">
    <li>
        <a href="#p1" class="pat-scroll"  data-pat-scroll="trigger: auto">
            Jump to the paragraph
        </a>
    </li>
    </ul>

    <p id="p1">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco.
        Duis aute irure dolor in reprehenderit in voluptate velit.
    </p>

### Option reference

Scrolling can be configured through a `data-pat-scroll` attribute.
The available options are:

| Field       | Default | Options                          | Description                                                                                                                                                                                                                                                                                                                                            |
| ----------- | ------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `trigger`   | `click` | `click`, `auto`                  | `auto` means that the scrolling will happen as soon as the page loads. `click` means that the configured element needs to be clicked first.                                                                                                                                                                                                            |
| `direction` | `top`   | `top`, `left`                    | The direction in which the scrolling happens.                                                                                                                                                                                                                                                                                                          |
| `selector`  |         | A CSS or jQuery selector string. | A selector for the element which will be scrolled by a number of pixels equal to `offset`. By default it will be the element on which the pattern is declared. Ignored unless `offset` is specified.                                                                                                                                                   |
| `offset`    |         | A number                         | `offset` can only be used with scrollable elements. (An element is "scrollable" if it has scrollbars, i.e. when the CSS property `overflow` is either `auto` or `scroll`.) The element scrolled by `offset` can be specified with the `selector` option. If `selector` is not present, the element on which `pat-scroll` is declared will be scrolled. |
