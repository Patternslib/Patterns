## Description

The Zoom pattern creates a zoom slider for any (group of) object the user should be able to change size of.
A very typical application of this pattern is a group of thumbnails that the user may change in size.
Please note that some browsers (for example Firefox) don't support the `zoom: x` CSS property required for this
pattern to work.

## Documentation

It's easy to make an element zoomable with Patternslib. Just add a `pat-zoom` class to it.

Here is a simple example:

    <img class="pat-zoom" src="image.jpg"/>

Upon seeing the `pat-zoom` class, Patternslib will prepend an input element with type `"range"`.

The user can use this range input to change the _zoom_ CSS property for the zoomable element.

For example:

    <input type="range" min="0" max="2" value="1" step="any"/>
    <img class="pat-zoom" src="image.jpg" style="zoom: 1"/>
