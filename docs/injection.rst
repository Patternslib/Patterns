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


PLUGGABLE PATTERNS
==================

The library now includes the ability to be extended to handle the syntax:

.. code-block:: html
   <a href="/url/to/load#source1#source2" rel=".pattern">

which will trigger ``pattern`` in the code. The actions over the source IDs
is dependent on each individual pattern. Also, each pattern can receive
parameters after the pattern name by delimiting them with any non-alphanumeric
character. 

The following patterns are available by default:


Modal panels
============

Panels, perhaps better (but incorrectly) known as dialogs or popups, can be
created using standard links or buttons using the ``openPanel`` class. An
example:

.. code-block:: html

   <a href="/status/server1#content" rel=".modal">Show server status</a>

This will load the page at ``/status/server1``, extract the element with id
``content`` and show that in a panel.

Forms in panels
---------------

Forms inside panels are automatically handled, but require some support from
the backend server. If a form inside a panel is submitted and the response from
the backend has a HTTP status 202 the result will be shown inside the panel. If
the form action URL has a fragment, it will be used to extract part of the
response. If the form action URL has no fragment, the same fragment as used to
initially open the panel will be used. For all other HTTP status codes the
panel will be closed and no further action is taken.

Requirements
------------

In order to use modal panels you need to include the following jQuery extensions
in your page:


``jQuery Tools``
	http://www.jquerytools.org/

``jQuery Form Plugin``
	http://jquery.malsup.com/form/


SelfHealing
===========

This is triggered with the ``selfHealing`` pattern id, as such:

.. code-block:: html

   <a href="/to/show#source" rel=".selfHealing">Heal!</a>

This will load the page /to/show, extract the element with ``source`` id and insert
it's contents (which are wrapped in a div) in the "selfhealing-messages" div. The
wrapping div will display for some time and disappear afterwards. If the mouse hovers
over the #source element while it is visible, it will stay visible until the mouse
pointer moves out of it.

Multiple self-healing messages can be called one after the other, and their contents
will be stacked in the ``selfhealing-messages`` container.


Requirements
------------

None.


Fancybox
========

If no form handling is required, fancybox offers more eye-candy and
functionality than the modal panels described above. The pattern id is
``fancybox``, used as:

.. code-block:: html
  <a href="/to/load" rel=".fancy!type">Make it fancy!</a>
	
where ``type`` can be any of the types supported by fancybox. More
common are:

``ajax``
  Makes an ajax call and displays the resulting content into
  fancybox. If the modified version of fancybox is used, single
  element injection can be specified in the ``href`` atrribute.
	
``iframe``
  The page pointed to by ``href`` is opened in an iframe inside fancybox.
	
``image``
  The image pointed to by ``href`` is opened in fancybox.
	
If no type is specified, the type dimmed most appropriate for the
given ``href`` is displayed by fancybox.


Requirements
------------

``Fancybox``

In order to have selective injection (injection of a single element
from the page), you need the modified version of fancybox that's
currently on SVN.
