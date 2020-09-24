## Description

The _scroll box_ pattern adds some CSS classes to the element depending on it's scrolling position.

The element where it is invoked upon has to be scrollable.
Therefore the eleme must have set the `overflow` or `overflowY` CSS property set to `auto` or `scroll`.
Ho(horizontal scrolling is not yet supported.

The classes are:

-   `scroll-up`: when scrolling upwards,
-   `scroll-down`: when scrolling downwards,
-   `scroll-position-top`: when the scrolling container is scrolled to the top,
-   `scroll-position-bottom`: when the scrolling container is scrolled to the bottom.
