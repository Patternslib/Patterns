Pluggable patterns
==================

The library now includes the ability to be extended to handle the syntax:

.. code-block:: html

   <a href="/url/to/load#source1#source2" rel=".pattern">

which will trigger ``pattern`` in the code. The actions over the source IDs
is dependent on each individual pattern. Also, each pattern can receive
parameters after the pattern name by delimiting them with any non-alphanumeric
character. 

Markup patterns
---------------

Markup patterns never add or change any behaviour: their only purpose is to
add some convenience facilities over standard HTML to help with styling.

.. toctree::
   :maxdepth: 1

   autofocus
   checkedflag
   focus
   transforms


Behavioural patterns
--------------------

Behavioural patterns add extra behaviour to a page. This can be anything from
changing classes in a click, to doing complex AJAX injection of content.

.. toctree::
   :maxdepth: 1

   autosubmit
   carousel
   checklist
   collapsible
   depends
   inject
   menu
   modal
   selfhealing
   sortable
   sorting
   switch
   toggle
   tooltip
   zoom
