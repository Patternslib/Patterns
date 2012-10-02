Pluggable patterns
==================

The library now includes the ability to be extended to handle the syntax:

.. code-block:: html

   <a href="/url/to/load#source1#source2" rel=".pattern">

which will trigger ``pattern`` in the code. The actions over the source IDs
is dependent on each individual pattern. Also, each pattern can receive
parameters after the pattern name by delimiting them with any non-alphanumeric
character. 

The available patterns are:

.. toctree::
   :maxdepth: 1

   autosubmit
   checklist
   fancybox
   modal
   selfhealing
   switch
   toggle
   tooltip
