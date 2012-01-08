SelfHealing
===========

This is triggered with the ``selfHealing`` pattern id, as such:

.. code-block:: html

   <a href="/to/show#source" rel=".selfHealing">Heal!</a>

This will load the page /to/show, extract the element with ``source`` id and
insert it's contents (which are wrapped in a div) in the "selfhealing-messages"
div. The wrapping div will display for some time and disappear afterwards. If
the mouse hovers over the #source element while it is visible, it will stay
visible until the mouse pointer moves out of it.

Multiple self-healing messages can be called one after the other, and their
contents will be stacked in the ``selfhealing-messages`` container.

