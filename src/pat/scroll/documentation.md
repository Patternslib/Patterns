## Description

The *scroll* pattern allows you to implement smooth scrolling towards an anchor in the page.

## Documentation

The *scroll* pattern makes it possible to configure when and how elements
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

| Field | Default | Options | Description |
| ----- | ------- | ----------- | ----------- | 
| `trigger`   | `click` | `click`, `auto` | `auto` means that the scrolling will happen as soon as the page loads. `click` means that the configured element needs to be clicked first. |
| `direction` | `top`   | `top`, `left`   |  The direction in which the scrolling happens. |
| `selector`  |         | A CSS or jQuery selector string. | A selector for the element which will be scrolled. By default it will be the element on which the pattern is declared.|
| `offset`    |         | A number   | If an offset is given, then the element will be scrolled relative to that. Otherwise, an anchor to scroll to is determined from the href attribute of the element on which pat-scroll is declared. |
