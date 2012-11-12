Parameter syntax
================

You can change the bevaiour for some patterns by configuring them using
``data-pat-<pattern name>`` attributes in your markup. In these attributes
you can change settings using either *extended notation* or *shorthand
notation*.


Extended notation
-----------------

The simplest notation you can use for parameters is the *extended notation*.
When using this notation you always specify the argument name and its value,
separated by a colon.

.. code-block:: html

    <div class="pat-collapsible" pat-data-toggle="store: session">...</div>
    <ul class="pat-carousel" data-pat-carousel="loop: false">...</ul>

Multiple arguments can be provided by separating them with a semicolon.

.. code-block:: html

    <ul class="pat-carousel" data-pat-carousel="store: session; loop: false">...</ul>
    <div class="pat-carousel" data-pat-carousel="delay: 15: easing: bounce">...</div>


Shorthand notation
------------------

The extended syntax can be a bit verbose. In order to keep your markup short
you can also use a simpler short notation. In this notation you specify all
arguments using a pre-defined order. For example the toggle pattern takes
three arguments: the selector, an attribute and a value. Using shorthand
notation you can specify all three values directly separated by a space. For
example we can rewrite this extended notation:

.. code-block:: html

   <button class="tag-toggle"
           data-pat-toggle="selector: .myClass; attribute: class; value: active">
     ...
   </button>

as this simpler version:

.. code-block:: html

   <button class="tag-toggle" data-pat-toggle=".myClass class active">
     ...
   </button>

.. attention::

   This also reveals a limitation in shorthand notation: a value can not
   contain a space. If your value contains whitespace you must use the
   extended notation.

Boolean values can be referenced directly by name. For example this extended
notation for the carousel pattern:

.. code-block:: html

   <ul class="data-carousel" data-pat-carousel="loop: true; expand: true">
      ...
   </ul>

can be written like this:

.. code-block:: html

   <ul class="data-carousel" data-pat-carousel="loop expand">
      ...
   </ul>

If you prefix the name with ``no-`` the argument will be set to false. If we
want to use the same carousel as above but without expand we can write this:

.. code-block:: html

   <ul class="data-carousel" data-pat-carousel="loop no-expand">
      ...
   </ul>

Enum values can also be used directly. For example the toggle pattern has a
``store`` argument which can the take three values ``none``, ``local`` and
``store``. You can mention those directly:

.. code-block:: html

    <button class="pat-toggle" data-pat-toggle=":input.myClass checked session">
      ...
    </button>

In very rare situations it might happen that a a known boolean argument
has the exact same name as a enum value for another argument. In that case it
will be treated as a boolean option.


Cascading configuration
-----------------------

Sometimes you want to have several items with a similar configuration. To
support this you can use set parameters at a parent element so you do not
need to repeat them everywhere.

.. code-block:: html

   <nav data-pat-inject="source: #main; target: #content">
     <a class="pat-inject" href="status.html">Status</a>
     <a class="pat-inject" href="blog.html">Blog</a>
     <a class="pat-inject" href="about.html">About</a>
   </nav>

   <section id="content">
     ...
   </section>

The above example uses this mechanism to indicate that all ``#main`` is to
be extracted and placed into ``#content`` for all links.


Multiple values
---------------

Some parameters take a list of values instead of a single value. An example is
the tooltip pattern where you can specify multiple locations where the tooltip
should be positioned. In these cases you specify multiple values by separating
them with a comma.

.. code-block:: html

  <a class="tooltip" data-pat-tooltip="position: tl,tm,tr" title="Tooltip content">
    ...
  </a>



Multiple parameters
-------------------

Some patterns (for example toggle) accept multiple parameters. This can be
done by separating them with ``&&``.

.. code-block:: html

    <button class="pat-toggle"
          data-pat-toggle="myClass class active && :input.myClass checked">
      Click me to check inputs and add active class.
    </button>

