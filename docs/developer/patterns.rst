Creating a new pattern
======================

Patterns are implemented as JavaScript classes that are registered with the patterns library.
Below is a minimal skeleton for a pattern.

.. code-block:: javascript
   :linenos:

    import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
    import registry from "@patternslib/patternslib/src/core/registry";

    class Pattern extends BasePattern {
        static name = "test-pattern";
        static trigger = ".pat-test-pattern";

        init() {
        }
    }

    // Register Pattern class in the global pattern registry and make it usable there.
    registry.register(Pattern);

    // Export Pattern as default export.
    // You can import it as ``import AnyName from "./{{{ pattern.name }}}";``
    export default Pattern;
    // Export BasePattern as named export.
    // You can import it as ``import { Pattern } from "./{{{ pattern.name }}}";``
    export { Pattern };
   define([
       'require'
       '../registry'
   ], function(require, registry) {
       var pattern_spec = {
           name: "mypattern",
       };

       registry.register(pattern_spec);
   });

This skeleton does several things:

* lines 1-4 use `RequireJS <http://requirejs.org/>`_ to load the patterns
  registry.
* lines 5-7 create an object which defines this pattern's specifications.
* line 9 registers the pattern.


Markup patterns
---------------

Most patterns deal with markup: they are activated for content that matches
a specific CSS selector. This is handled by adding two items to the
pattern specification: a ``trigger`` and an ``init`` function.

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

The trigger specified on line 3 is a CSS selector which tells the pattern
framework which elements this pattern is interested in. If new items are
discovered in the DOM that match this pattern, the ``init`` function will be
called with a jQuery wrapper around the element.

While not required patterns are encouraged to include a ``destroy`` function
that undos the pattern initialisation.  After calling ``destroy`` it should be
possible to call ``init`` again to reactivate the pattern.

Methods must always return ``this`` to facilitate their use as jQuery widgets.


Pattern configuration
---------------------

The configuration of a pattern is generally based on three components: the
default settings, configuration set on a DOM element via a data-attribute, and,
if the jQuery API is used, via options passed in via the jQuery plugin API.
The init method for patterns should combine these settings. Let's update our
example pattern to do this:

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 3,6,7,8,12

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

The first step is loading the parser. In lines 6 to 8 we proceed to create a
parser instance and add our options with their default values. In the init
method we use the parser to parse the ``data-mypattern`` attribute for the
element. Finally we combine that with the options that might have been
provided through the jQuery plugin API.
