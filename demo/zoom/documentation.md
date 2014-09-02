# Documentation

Patterns provides a very simple way to make an item zoomable: just add a
`pat-zoom` class. Here is a simple example:

    <img class="pat-zoom" src="image.jpg"/>

Upon seeing this, Patterns will prepend a range input. Modifying this
will update the *zoom* style for the element.

    <input type="range" min="0" max="2" value="1" step="any"/>
    <img class="pat-zoom" src="image.jpg" style="zoom: 1"/>
    
* * *

Please note that due to the lack of support for the CSS `zoom: x` property in the Gecko render engine, Firefox is not supported for this pattern. 