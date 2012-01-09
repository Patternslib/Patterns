Dynamically positioned tooltips
===============================

Tooltips are intended to display contextual information and function about the trigger element. 

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
an arrow tip pointing to the centre of the triggering item. The placement
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

An example::

   <a href="#" rel=".tooltip!position=lt-lm-rt-rm">
     …
   </a>

This specifies that the preferred position of the tooltip is at the top
left side of the tooltip. If the tooltip does not fit at that position
the left-middle position should be tried, than the right-top or if
all previous options failed the middle of the right side. If the tooltip does
not fit at any none of the preferred positions the tooltip will be
positioned at the location that has the most space, even if this is not
one of the preferred positions.

It is possible to force a specific tooltip position by adding the
``force-position`` hint::

   <a href="#" rel=".tooltip!position-lt!force-position">
     …
   </a>
   
Display trigger
--------------

The tooltip is by default triggered when the user hovers over the trigger element. When the cursor is moved away from the trigger element, the tooltip will disappear again. 

There is also the option to display the tooltip on click by adding an extra class `click`::

   <a href="#" class="tooltip click">
     …
   </a>

Positioning
-----------

Tooltips automatically point at the centre of the trigger element. The 'balloon' will follow the tip in positioning itself.
There are eight possible positions:

- bottom-left, ;bottom-middle, bottom-right,
- left-top, left-middle, left-bottom,
- top-right, top-middle, top-left,
- right-bottom, right-middle, right-top

Position determines tip-position on the balloon. Balloon-position follows tip: 

When the balloon doesn't fit inside the viewport, it will move itself just enough to fit. When there is not enough room to point at the centre of the element, it will position itself in the next-preferred position. This will continue until it finds a position that fits. If no position fits, it will be placed where it finds the most space. Example::

   <a href="#" class="tooltip position-lt-lm-rt-rm">
    …
   </a>

This tooltip will first try to position itself at the 'left-top' position, then in the 'left-middle', then in the 'right-top' position and finally in the 'right-middle' position.

Forced  positioning
-------------------

If automatic positioning is not desired, the position may be forced with the `force-position` class::

   <a href="#" class="tooltip position-rt force-position">
    …
   </a>

Sticky
------

By default, the tooltip disappears when the cursor is moved off the element. If this is not desired behaviour, there is the option to have a 'sticky' tooltip. This only disappears when a close button on the tooltip is clicked. When the sticky option is chosen, the close button will be inserted for you automatically::

   <a href="#" class="tooltip sticky">
    …
   </a>

Injection
---------

Tooltips can also be used with Injection. This works like any other panel::

   <a href="myModule.html" data-injection="#myPanel.tooltip">
    …
   </a>