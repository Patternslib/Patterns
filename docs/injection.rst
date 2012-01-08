Hiding elements for javascript-disabled browsers
================================================

HTML has a ``<noscript>`` element to facilitate markup changes for browsers
that do not support javascript. Often the reverse is useful as well: markup
elements which are only used to trigger javascript-managed behaviour should
not be visible on browsers that do not support javascript. For these cases
you can use the ``jsOnly`` class:

.. code-block:: html

   <button class="jsOnly" type="button" id="popupButton">More magic</button>

This button will only be shown in browsers that have javascript enabled. This 
behaviour requires a simple CSS rule to be present::

   .jsOnly { display: none; }
