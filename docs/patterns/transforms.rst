Markup transformations
======================

Patterns will perform some markup transformations automatically to work around
several styling bugs in browsers.

Form legends
------------

``legend`` elements are rewritten as ``p`` elements with a ``question`` class.
This is needed for browsers (XXX list which ones) which can not properly style
legend elements.

.. code-block:: html
   :emphasize-lines: 2

   <fieldset>
     <legend>Personal information</legend>
     ...
    </fieldset>


is changed to:

.. code-block:: html
   :emphasize-lines: 2

   <fieldset>
     <p class="question">Personal information</p>
     ...
    </fieldset>

This transform can be skipped by adding a ``cant-touch-this`` class to the
legend.


HTML objects
------------

HTML supports ``object`` elements with a ``text/html`` type as an alternative
to iframes. Unfortunately Internet Explorer 8 and older do not support the
DOM methods for those objects for some common tasks. As a workaround Patterns
replaces those objects with iframes on those browsers.

.. code-block:: html

   <code type="text/html" data="/path/content.html" id="myid" class="myclasses">
     ...
   </code>

is changed to:

.. code-block:: html

   <iframe allowtransparency="true" style="background-color:transparent"
     src="/path/content.html" id="myid" class="myclasses"/>

