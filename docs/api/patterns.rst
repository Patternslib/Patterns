Creating new pattern
====================

Patterns are implemented as javascript objects that are registered with the
patterns library. Below is a minimal skeleton for a pattern.

.. code-block:: javascript
   :linenos:

   define([
       'require'
       '../patterns'
   ], function(require, patterns) {
       var mypattern = {
           markup_trigger: "CSS selector",
           init: function($el) { ... }
       };

       patterns.register(mypattern);
       return mypattern;
   });

This skeleton does two things:

* lines 1-4 use `RequireJS <http://requirejs.org/>`_ to load the core patterns
  logic.
* lines 5-8 create an object which defines this pattern.
* line 10 registers the pattern.

The pattern also returns the pattern object itself. While not required this
is recommended behaviour: it makes it easier to write tests for patterns and
can be used to expose a pattern-specific API that other javascript routines can
use.

.. js:function:: patterns.register(name, definition)

   :param string name: short name for the pattern
   :param object definition: Object specifying how pattern interfaces

   The available options in the definition object are:

   * ``markup_trigger``: a jQuery selector which specifies elements that should
     be initialised by this pattern.
   * ``init``: a function which is called for every element matching
     ``markup_trigger`` which should be initialised.

   Any other keys are ignored.



Pattern initialisation
----------------------

After a pattern has been registered the system will use it to initialise
content. There are two reasons for having patterns drive the initialisation
over initialisting elements manually: patterns will make sure that any new
content that is added to the DOM later will be initialised correctly, and
it will make sure content is never initialised more than once.
