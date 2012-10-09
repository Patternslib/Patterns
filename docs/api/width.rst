Width classes
=============

The width pattern can be accessed through ``patterns/width``

.. code-block:: javascript

   var width = require("patterns/width");
   width.register("wide", 1200, null);


.. js:function:: width.register(class, minimum, maximum)

   :param string class: class to set to the document body
   :param int minimum: minimum window width in pixels
   :param int maximum: maximum window width in pixels

   This function registers a *width class*. These are classes that are
   automatically set and removed on the document body based on the window
   width. This can be used to implement responsive designs.



