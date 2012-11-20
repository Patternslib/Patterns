Bumper
======

A *bumper* is an element that, when the user starts scrolling, stays in view when 
a viewport border touches it.

Below is a simple example.

.. code-block:: html

   <div class="pat-bumper">
      Bumper content
   </div>

When the user starts scrolling the page and an edge of the above DIV reaches
an edge of the viewport, a *bumped* class will be added. Additionally,
it will be assigned a *bumped-{top|left|right|bottom}* class depending on 
which edge of the element was touched by the viewport. The default classes
should look like

.. code-block:: css

   .bumped {
      position: fixed;
   }
   
   .bumped-top {
      top: 0;
   }

   .bumped-bottom {
      bottom: 0;
   }
   
   .bumped-left {
      left: 0;
   }
   
   .bumped-right {
      right: 0;
   }

Please note that classes *bumped-left* and *bumped-right* will not be assigned
at the same time. The same is true for *bumped-top* and *bumped-bottom*.

Option Reference
----------------

The collapsible can be configured through a ``data-pat-bumper`` attribute.
The available options are:

+------------------+------------+-----------------------------------------------+
| Field            | default    | Description                                   |
+==================+============+===============================================+
| ``margin``       |   0        | The distance from the edge of the element     |
|                  |            | from which the 'bumped' behavior will be      |
|                  |            | activated                                     |
+------------------+------------+-----------------------------------------------+
