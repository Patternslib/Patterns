Inserting or replacing content
==============================

Inserting new content or replacing existing content with remote data is
supported via normal ``<a>`` elements:

.. code-block:: html

  <a href="/tip-of-the-day/123#tip" rel="#tip">Next tip</a>

The ``rel`` attribute must be formatted as ``#<id>``, and indicates which element in
the current document will be replaced. If no element with the given id
exists a new ``<div>`` will be added to the end of the body. The ``href``
attribute indicates which content should be loaded, with the fragment
allowing selection of a single item in a loaded document.

This can also be done with multiple ids at once, as follows:

.. code-block:: html

   <a href="/url/to/load#source1#source2#sourceN"
      rel="#target1#target2#targetN">Some Action</a>

In this case, #target1 in the current document will be replaced by
#source1 from the loaded document, #target2 will be replaced by
#source2, and #targetN by #sourceN.

You can have more sources than targets, as such:

.. code-block:: html

   <a href="/url/to/load#source1#source2" rel="#target1">Some Action</a>

In that case, #target1 is replaced by #source1, and #source2 will
replace an element with the same ID in the current document. The same
idea follows when there are more targets than sources. If you want
this automatic behaviour for all targets, you still need to set ``#``
as the value for the ``rel`` attribute.

You may use the ``data-injection`` attribute instead of ``rel``, but
if both are present, ``rel`` will take precedence.


Injection modifiers
===================

For each of the targets specified in the ``rel`` or ``data-injection``
attribute, you can have a modifier that selects how the data is
injected into the page. The syntax is:

.. code-block:: html

   <a href="/url/to/load#source" rel="#target:modifier">Some Action</a>
	
``modifier`` can be any of:

``replace``:
  The element with ``source`` id will be replaced with the element with 
  ``target`` id. This is the default behaviour if no modifier is specified.

``content``:
  The content of the element with ``source`` id will be replaced with the
  content of element with ``target`` id.

``after``:
  The children of the element with ``target`` id will be inserted after the
  last child of the element with ``source`` id.

``before``:
  The children of the element with ``target`` id will be inserted before the
  last child of the element with ``source`` id.

``append``:
  The element with ``source`` id is inserted after the element with ``target`` id.

``prepend``:
  The element with ``source`` id is inserted before the element with ``target`` id.

As stated above, the default behaviour if no modifier is specified is
that of ``replace``.
