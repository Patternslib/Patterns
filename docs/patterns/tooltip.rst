Tooltip
=======

Markup structure
----------------

.. code-block:: html

   <label>Website address
     <a href="#" rel=".tooltip!click">More information</a>
   </label>
   <div id="tip">
     <p>
       Please enter the full URL for the website. Please note that only HTTP
       and HTTPS addresses are supported.
     </p>
   </div>

Display
-------
Tooltips are shown when the mouse hovers over the triggering element, and
are hidden when the mouse leaves the triggering element.


Positioning
-----------
Tooltips will be positioned close to the element that triggered them, with
an arrowtip pointing to the center of the triggering item. The placement
of the tip on the tooltip determines the positioning of the tooltip. For
example if the tip is placed at the right side of the tooltip, it naturally
follows that the tooltip itself will be placed to the left of the triggering
element.

The position of the tip within the tooltip can be specified with a
*position hint*: a CSS class which specifies the preferred positions. This
is formatted as ``position-<preference>[-preference]*``. The possible
preferences are:

* ``tl``: tip placed at the leftmost corner of the top side of the tooltip
* ``tm``: tip placed at the middle of the top side tooltip
* ``tr``: tip placed at the rightmost corner of the top side of the tooltip
* ``rt``: tip placed at the top corner of the right side of the tooltip
* ``rm``: tip placed at the middle of the right side tooltip
* ``rb``: tip placed at the bottom corner of the right side of the tooltip
* ``bl``: tip placed at the leftmost corner of the bottom side of the tooltip
* ``bm``: tip placed at the middle of the bottom side tooltip
* ``br``: tip placed at the rightmost corner of the bottom side of the tooltip
* ``lt``: tip placed at the top corner of the left side of the tooltip
* ``lm``: tip placed at the middle of the left side tooltip
* ``lb``: tip placed at the bottom corner of the left side of the tooltip

An example:

.. code-block:: html

   <a href="#" rel=".tooltip!position=lt-lm-rt-rm">
     ...
   </a>

This specifies that the preferred position of the tooltip is at the top
left side of the tooltip. If the tooltip does not fit at that position
the left-middle positition should be tried, than the right-top or if
all previous options failed the middle of the right side. If the tooltip does
not fit at any none of the prefererred positions the tooltip will be
positioned at the location that has the most space, even if this is not
one of the preferred positions.

It is possible to force a specific tooltip position by adding the
``forcePosition`` hint.

.. code-block::  html

   <a href="#" rel=".tooltip!position-lt!forcePosition">
     ...
   </a>
