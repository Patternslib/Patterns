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

| Field       | Default                               | Options                                   | Description                                                                                                                                                                                                                          |
| ----------- | ------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `trigger`   | `click`                               | `click`, `auto`, `manual`                 | `auto` means that the scrolling will happen as soon as the page loads, additional to `click` events. `click` means that the configured element needs to be clicked first. `manual` does only scroll when initialized via JavaScript. |
| `direction` | `top`                                 | `top`, `left`                             | The direction in which the scrolling happens.                                                                                                                                                                                        |
| `selector`  |                                       | CSS selector, `top`, `bottom` or `self`   | A CSS selector for the element which will be scrolled into view. `self` if it is the pat-scoll element itself. `top` to scroll to the very top of the scroll container, `bottom` to scroll to the very bottom.                       |
| `offset`    |                                       | A number                                  | `offset` in pixels to stop scrolling before the target position. Can also be a negative number.                                                                                                                                      |
