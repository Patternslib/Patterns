Creating new pattern
====================

Patterns are implemented as javascript objects that are registered with the
patterns library. Below is a minimal skeleton for a pattern.

.. code-block:: javascript
   :linenos:

   define([
       'require'
       '../registry'
   ], function(require, registry) {
       var pattern_spec = {
           name: "mypattern",
       };

       patterns.register(mypattern);
   });

This skeleton does two things:

* lines 1-4 use `RequireJS <http://requirejs.org/>`_ to load the patterns
  registry.
* lines 5-8 create an object which defines this pattern.
* line 10 registers the pattern.


.. js:function:: patterns.register(specification)

   :param object specification: Object specifying how pattern interfaces

   The required options in the definition object are:

   * ``name``:: short (one-word) name of the pattern.

   Any other keys are ignored.


Markup patterns
---------------

Most patterns deal with markup: they are activated for content that matches
a specific CSS selector. This is handled by adding two items to the
pattern specification: ``trigger`` and an ``init`` function.

.. code-block:: javascript
   :linenos:

   var pattern_spec = {
       name: "mypattern",
       trigger: ".tooltip, [data-tooltip]",

       init: function($el) {
           ...
       },

       destroy: function($el) {
           ...
       }
   };

The trigger specified on line 3 is a CSS selector to tells the pattern framework
which elements this pattern is interested in. If new items are discovered in the
DOM that match this pattern the ``init`` function will be called with a jQuery
wrapper around the element.

While not encouraged patterns are encouraged to include a ``destroy`` function
that undos the pattern initialisation.  After calling ``destroy`` it should be
possible to call ``init`` again to reactivate the pattern.

Methods must always return ``this`` to facilitate their use as jQuery widgets.

jQuery plugins
--------------

Patterns can also act as jQuery plugins. This can be done by providing a
``jquery_plugin`` option in the pattern specification.

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 4

   var pattern_spec = {
       name: "mypattern",
       trigger: ".tooltip, [data-tooltip]",
       jquery_plugin: true,

       init: function($el) {
           ...
       },

       destroy: function($el) {
           ...
       },

       othermethod: function($el, options) {
           ...
       }
   };


Line 4 tells the patterns framework that this pattern can also be used as a
jQuery plugin. In order to prevent conflicts the name of the jQuery function
will be created by combining the word ``pattern`` with the capitalized name
of the pattern. You can then interact with it using the standard jQuery API:

.. code-block:: javascript

   // Initialize mypattern for #title
   $("#title").patternMypattern();

   // Invoke othermethod for the pattern 
   $("#title").patternMypattern("othermethod", {option: "value"});


Pattern configuration
---------------------

The configuration of a pattern is generally based on three components: the
default settings, configuration set on a DOM element via a data-attribute, and,
if the jQuery API is used, via options passed in via the jQuery plugin API.
The init method for patterns should combine these settings. Lets update our
example pattern to do this.

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 3,7,8,9,13

   define([
       'require',
       'core/parser',
       '../registry'
   ], function(require, Parser, registry) {
       var Parser = new Parser();

       parser.add_argument("delay", 500);
       parser.add_argument("auto-play", true);

       var pattern_spec = {
           init: function($el, opts) {
               var options = $.extend({}, parser.parse($el.data("mypattern")), opts);
               ...
           };
       };

   });

The first step is loading the parser. In lines 7 to 9 we proceed to create a
parser instance and add our options with their default values. In the init
method we use the parser to parse the ``data-mypattern`` attribute for the
element. Finally we combine that with the options might have been provided
through the jQuery plugin API.
