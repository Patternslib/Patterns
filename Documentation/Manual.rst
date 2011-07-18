===============
Pattern library
===============

The markup pattern library supports many different patterns. This chapter
documents all currently supported patterns.


Hiding elements for javascript-disabled browsers
================================================

HTML has a ``<noscript>`` element to facilitate markup changes for browsers
that do not support javascript. Often the reverse is useful as well: markup
elements which are only used to trigger javascript-managed behaviour should
not be visible on browsers that do not support javascript. For these cases
you can use the ``jsOnly`` class:

.. code-block:: html

   <button class="jsOnly" type="button" id="popupButton">More magic</button>

This button will only be shown in browsers that have javascript enabled. This 
behaviour requires a simple CSS rule to be present::

   .jsOnly { display: none; }

Autofocus
=========

When generating forms it is practical to automatically set the focus on
the first input element. This can be done using an ``autofocus`` class.

.. code-block:: html

   <form>
     <label>Email address
       <input type="text" name="login" class="autofocus" /></label>
     <label>Password
       <input type="password" name="password" /></label>
   </form>

With the above markup the ``login`` input field will automatically get the
focus, so users can start the login process immediately. If multiple
input elements have the ``autofocus`` class the first element without a
value is focused. For example:

.. code-block:: html

   <form>
     <label>Email address
       <input type="text" name="login" class="autofocus" value="john"/></label>
     <label>Password
       <input type="password" name="password" class="autofocus"/></label>
   </form>

in this login form the login field is already filled in so the focus will
be given to the password field instead.


Dynamically inserting/replacing markup
======================================

Occasionally it may be useful to be able to insert content in a page,
or replacing existing content with something else, if a user clicks on
something. This can be down with using a standard ``<a>`` tag. As an example
here is a link that could be used to replace a tip-of-the-day with
another tip:

.. code-block:: html

   <a href="http://localhost/tip-of-the-day#tip" rel="#tip">Another tip</a>


Clicking on this link will fetch ``http://localhost/tip-of-the-day``, 
extract the element with id ``tip``, and insert into the current page, 
replacing the element with id ``'tip``. If no such element exists the loaded
content is appended to the document. This trick also works well for
non-javascript browsers: users will be redirected to the page showing the
desired data.


Creating modal panels
=====================

A common task is to load some markup and display it in a modal overlay on
the current page. Similar to dynamic insertion of markup this is also done
via a simple ``<a>`` tag:

.. code-block:: html

   <a href="http://localhost/login#login-form">  rel="#form" class="openPanel">Login</a>

The ``openPanel`` class indicates that the loaded markup should be displayed
in a panel instead of only inserted into the page. Non-javascript users (and
search engines) will see the full login-page, so it is important to make sure
that that is proper page.


Forms inside panels
-------------------

Forms in panels are fully supported. Forms in panels are submitted using an
AJAX request, and the result is scanned to determine how to handle the result.
The rules are:

1. if the HTTP status code of the response is not `202` or if the response
   has a content type of ``application/json`` the panel is closed and an
   ``ajaxFormResult`` event is triggered for the link that caused to overlay
   to be originally opened. Data from JSON responses is parsed and
   passed on to the ``ajaxFormResult`` event handler as an extra parameter.

2. the fragment ofthe action URL for the form, or the fragment of
   the link which was used to open the overlay, is used to extract the 
   part of the response that should be shown.

3. standard content intilisation is done on the response, and a ``newContent``
   event is triggered on the root of the new content, allowing further changes
   or setup to be done if required.

4. the contents of the panel is replaced with the new content.



Dynamically hiding/showing or enabling/disabling elements
=========================================================

In forms it is often useful to show or hide parts of a form depending on how
form elements. This can be accomplished by specifying dependency information
on elements. Here is a simple example:

.. code-block:: html

   <label><input type="checkbox" name="details" value="on"/>Show details</label>

   <div class="dependsOn-details">
     ...
   </div>

The ``div`` element will only be shown if *Show details* is selected. For
more complex situations you can use multiple ``dependsOn-`` classes.

The format of the class name is ``dependsOn-<name>[-condition]``. ``name`` is
the name of an input field. The condition is optional and can be used to
check the value of an input field. The supported options are:

``on``
    For checkbox fields check if the checkbox is checked. For radio buttons
    check if an empty is selected. For other input elements check if they
    have a value or are empty. This is the default test if no condition is
    specified.

``off``
    The opposite of ``on``: test if a checkbox is not checked, or an input
    element is empty.

``equals``-*value*
    Test if an inputs value is exactly equal to *value*.

``notEquals``-*value*
    Test if an inputs value is not equal to *value*.

If multiple ``dependsOn`` classes are specified all of them have to be true.
You can change this behaviour using ``dependsType-or`` class: if this class
is present only one of the requirements has to be met.

Normally ``dependsOn`` manages visibility for objects. You can also use
dependencies to enable or disable items. To do this add the
``dependsAction-enable`` class.




Inserting or replacing content
==============================

Inserting of new content or replacing existing content with remote data is
supported via normal ``<a>`` elements:

.. code-block:: html

  <a href="/tip-of-the-day/123#tip" rel="#tip">Next tip</a>

The ``rel`` must be formatted as ``#<id>``, and indicated which element in
the current document will be replaced. If no element with the given id
exists a new ``<div>`` will be added to the end of the body. The ``href``
attribute indicates which content should be loaded, with the fragment
allowing selection of a single item in a loaded document.

This can also be done with multiple ids at once, as follows:

.. code-block:: html
	<a href="/url/to/load#source1#source2#sourceN" rel="#target1#target2#targetN">Some Action</a>

In this case, #target1 in the current document will be replaced by #source1 from the loaded
document, #target2 will be replaced by #source2, and #targetN by #sourceN. 

You can have more sources than targets, as such:

.. code-block:: html
	<a href="/url/to/load#source1#source2" rel="#target1">Some Action</a>

In that case, #target1 is replaced by #source1, and #source2 will replace an element with
the same ID in the current document. The same idea follows when there are more targets than
sources. If you want this automatic behaviour for all targets, you still need to set ``#`` as
the value for the ``rel`` attribute.

You may use the ``data-injection`` attribute instead of ``rel``, but if both are present, ``rel``
will take precedence.




Injection modifiers
===================

For each of the targets specified in the ``rel`` or ``data-injection`` attribute, you can have a modifier
that selects how the data is injected into the page. The syntax is:

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

As stated above, the default behaviour if no modifier is specified is that of ``replace``.



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

This will load the page at ``/status/server1``, extract the element with it
``content`` and show that in a panel.

Forms in panels
---------------

Forms inside panels are automatically handled, but require some support from
the backend server. If a form inside a panel is submitted and the response from
the backend has a HTTP status 202 the result will be shown inside the panel. If
the form action URL has a fragment that will be used to extract part of the
response. If the form action URL has no fragment the same fragment as used to
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

If no form handling is required, fancybox offers more eye-candy and functionality than the
modal panels described above. The pattern id is ``fancybox``, used as:

.. code-block:: html
	<a href="/to/load" rel=".fancy!type">Make it fancy!</a>
	
where ``type`` can be any of the types supported by fancybox. More common are:

``ajax``
	Makes an ajax call and displays the resulting content into fancybox. If the modified
	version of fancybox is used, single element injection can be specified in the ``href`` atrribute.
	
``iframe``
	The page pointed to by ``href`` is opened in an iframe inside fancybox.
	
``image``
	The image pointed to by ``href`` is opened in fancybox.
	
If no type is specified, the type dimmed most appropriate for the given ``href`` is displayed by fancybox.


Requirements
------------

``Fancybox``

In order to have selective injection (injection of a single element from the page), you
need the modified version of fancybox that's currently on SVN.