Self healing messages
=====================

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

Options
-------

You can specify options that modify the default behaviour as extra parameters
for the ``rel`` attribute. These follow the standard parameter syntax: parameters
are separated by an exclamation mark, and are formtted as ``parameter=value``.

The ``confirm`` option can used to ask a user for confirmation before triggering
the self healing message. The option parameter is a string which is shown to the
user.

.. code-block:: html
  
   <a href="/to/show#source" rel=".selfHealing!confirm=Are you sure?">Heal!</a>

If the ``disable`` option is set the element that triggers a self healing message
is disabled after the first click.

.. code-block:: html
  
   <a href="/to/show#source" rel=".selfHealing!disable">Heal!</a>

The ``remove`` option can be used to remove an element from the DOM after a self
healing message is shown. Its value is the id of the element to be removed.

.. code-block:: html
  
   <a href="/to/show#source" rel=".selfHealing!remove=message">Heal!</a>
   <p id="message">Please wait</p>

The ``show`` option can be used to make an existing element visible after a self
healing message is shown. Its value is the id of the element to be shown. It
will be shown with a slide-down effect.

.. code-block:: html
  
   <a href="/to/show#source" rel=".selfHealing!show=message">Heal!</a>
   <p id="message" style="display: none">You have been healed!</p>
