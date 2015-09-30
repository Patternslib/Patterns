## Description

The zoom pattern provides a simple way to enlarge an item in your page.

## Documentation

It's easy to make an element zoomable with Patternslib. Just add a `pat-zoom` class to it.

Here is a simple example:

    <img class="pat-zoom" src="image.jpg"/>

Upon seeing the `pat-zoom` class, Patternslib will prepend an input element with type `"range"`.

The user can use this range input to change the *zoom* CSS property for the zoomable element.

For example:

    <input type="range" min="0" max="2" value="1" step="any"/>
    <img class="pat-zoom" src="image.jpg" style="zoom: 1"/>
    
* * *

Please be aware that not all browsers support the `zoom: x` CSS property.
