Javascript API
==============

.. js:function:: mapal.registerWidthClass(class, minimum, maximum)

   :param string class: class to set to the document body
   :param int minimum: minimum window width in pixels
   :param int maximum: maximum window width in pixels

   This function registers a *width class*. These are classes that are
   automatically set and removed on the document body based on the window
   width. This can be used to implement responsive designs.


.. js:function:: patterns.register(name, definition)

   :param string name: short name for the pattern
   :param object definition: Object specifying how pattern interfaces

   The available options in the definition object are:

   * ``markup_trigger``: a jQuery selector which specifies elements that should
     be initialised by this pattern.
   * ``init``: a function which is called for every element matching
     ``markup_trigger`` which should be initialised.

   Any other keys are ignored.


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


Pattern initialisation
----------------------

After a pattern has been registered the system will use it to initialise
content. There are two reasons for having patterns drive the initialisation
over initialisting elements manually: patterns will make sure that any new
content that is added to the DOM later will be initialised correctly, and
it will make sure content is never initialised more than once.



Logging
=======

Patterns uses `log4javascript <http://log4javascript.org/>`_ to provide logging
facilities. To use this you will need to load the logging module and use
its `getLogger` method to get a log utility. This is typically done as part
of the pattern definition: 

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 4,6,7

   define([
       'require'
       '../patterns',
       '../logging',
   ], function(require, patterns, logging) {
      var log = logging.getLogger("mypattern");
      log.info("Hello, world");
   });


The logging object (`log` in the code example) exposes several methods to log
information at various log levels: 

* `debug` is used to log debug messages. There are normally not shown.
* `info` is used to log informational messages. These are normally not shown.
* `warn` is used to log warnings. These are normally shown.
* `error` is used to log errors. There are normally shown.

