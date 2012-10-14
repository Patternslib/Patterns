Checklist
=========

The checklist pattern provides a convenient method to add options to select and
deselect all checkboxes in a block. This requires two changes in your markup:

1. add a ``pat-checklist`` class to the containing element
2. add a select and deselect buttons

Here is a simple example.

.. code-block:: html

   <fieldset class="pat-checklist">
     <div class="functions">
       <button class="select-all">Select all</button>
       <button class="deselect-all">Deselect all</button>
     </div>

     <label><input type="checkbox" checked="checked"/> Option one</label>
     <label><input type="checkbox"/> Option two</label>
     <label><input type="checkbox"/> Option three</label>
     <label><input type="checkbox"/> Option four</label>
   </fieldset>

The selectors used to find the select-all and deselect-all buttons are
configurable. The default values are ``.functions .select-all`` and
``.functions .dselect-all``. You can configure them using shorthand notation:

.. code-block:: html

   <fieldset class="pat-checklist" data-pat-checklist=".selectAll; .deselectAll">

or using the extended notation:

.. code-block:: html

   <fieldset class="pat-checklist" data-pat-checklist="select: .selectAll; deselect: .deselectAll">

The buttons will be disabled if they would not make any changes. That is: if
all checkboxes are already checked the select-all button will be disabled. And
if no checkboxes are checked the dselect-all button will be disabled.


Javascript API
--------------

The javascript API is entirely optional since patterns already autmoatically
enables the switching behaviour for all elements with a ``data-pat-checklist``
attribute. 

.. js:function:: jQuery.patternChecklist([options])

   :param options: one or more objects describing triggers to execute

   Setup checkbox management for the selected elements. If no options are
   provided they are taken from the ``data-pat-checklist`` attributes. Options
   can be provided as a javascript object with the following
   keys:

   * ``dselect``: the CSS selector identifying the deselect-all button(s)
   * ``select``: the CSS selector identifying the select-all button(s)

   .. code-block:: javascript

      $("button").patternChecklist({select: ".selectAll});


.. js:function:: jQuery.patternChecklist("destroy")

   Disable all checkbox management for the matched elements.
