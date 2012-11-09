Bumper
======

A *bumper* is an element that, when the user starts scrolling, stays at the top of 
the viewport when it touches it.

Below is a simple example.

.. code-block:: html

   <div class="pat-bumper">
      Bumper content
   </div>

When the user starts scrolling down the page and the top of the above DIV reaches
the top of the viewport, it will be assigned a *bumped* class. The default class
should look like

.. code-block:: css

   .bumped {
      position: fixed;
      top: 0;
   }

Option Reference
----------------

The collapsible can be configured through a ``data-pat-bumper`` attribute.
The available options are:

+------------------+------------+-----------------------------------------------+
| Field            | default    | Description                                   |
+==================+============+===============================================+
| ``margin``       |   0        | The distance from the top edge of the element |
|                  |            | from which the 'bumped' behavior will be      |
|                  |            | activated                                     |
+------------------+------------+-----------------------------------------------+
