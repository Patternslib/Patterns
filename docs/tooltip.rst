Dynamically positioned tooltips
=========================================================

Tooltips are intended to display contextual information and function about the trigger element. 

The default content displayed in the tooltip is the element's title attribute value. Populating the tooltip by means of module-injection is also possible.

The tooltip is automatically positioned and tries to position itself in the most optimal way within the browser's viewport.

Disply trigger
--------------

The tooltip is by default triggered when the user hovers over the trigger element. When the cursor is moved away from the trigger element, the tooltip will disappear again. 

There is also the option to display the tooltip on click by adding an extra class `click`. 

``<a href="#" class="tooltip click">``

Positioning
-----------

Tooltips automatically point at the centre of the trigger element. The 'balloon' will follow the tip in positioning itself.
There are eight possible positions:

- bottom-left, ;bottom-middle, bottom-right,
- left-top, left-middle, left-bottom,
- top-right, top-middle, top-left,
- right-bottom, right-middle, right-top

Position determines tip-position on the balloon. Balloon-position follows tip: 

When the balloon doesn't fit inside the viewport, it will move itself just enough to fit. When there is not enough room to point at the centre of the element, it will position itself in the next-preferred position. This will continue until it finds a position that fits. If no position fits, it will be placed where it finds the most space. Example:

``<a href="#" class="tooltip position-lt-lm-rt-rm">``

This tooltip will first try to position itself at the 'left-top' position, then in the 'left-middle', then in the 'right-top' position and finally in the 'right-middle' position.

Forced  positioning
-------------------

If automatic positioning is not desired, the position may be forced with the `force-position` class.

``<a href="#" class="tooltip position-rt force-position">``

Sticky
------

By default, the tooltip disappears when the cursor is moved off the element. If this is not desired behaviour, there is the option to have a 'sticky' tooltip. This only disapears when a closebutton on the tooltip is clicked. When the sticky option is chosen, the closebutton will be inserted for you automatically.

``<a href="#" class="tooltip sticky">``

Injection
---------

Tooltips can also be used with Module Injection. This works like any other panel.

``<a href="myModule.html" data-injection="#myPanel.tooltip">``