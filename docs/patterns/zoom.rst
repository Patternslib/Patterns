Zoom
====

Pattern provides a very simple way to make an item zoomable: just add a
``pat-zoom`` class. Here is a simple example:

.. code-block:: html

    <img class="pat-zoom" src="image.jpg"/>

When seeing this Patterns will prepend a range input. Modifying the input will
update the *zoom* style for the element.

.. code-block:: html

    <input type="range" min="0" max="2" value="1" step="any"/>
    <img class="pat-zoom" src="image.jpg" style="zoom: 1"/>

