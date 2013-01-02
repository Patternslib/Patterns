Autoscale
=========

The script scales an element with the `.pat-auto-scale` class by the ratio of
its parent width and its own. If the pattern is applied to the body, the
element is scaled with respect to the viewport's width. Elements are
automatically updated on window resize.

.. code-block:: html

   <div class="column">
     <img class="pat-auto-scale" src="header.png" alt=""/>
     <p>Lorem ipsum</p>
   </div>

Scaling is done by setting the `transform: scale(ratio)` css property on the
element. For IE versions older than 10 the `zoom` property is used instead.
