Creating a new pattern
======================

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

jQuery plugins
--------------

Patterns can also act as jQuery plugins. This can be done by providing a
``jquery_plugin`` option in the pattern specification.

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 3

   var pattern_spec = {
       name: "mypattern",
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


Line 3 tells the patterns framework that this pattern can be used as a jQuery
plugin named ``patMypattern``. You can then interact with it using the
standard jQuery API:

.. code-block:: javascript

   // Initialize mypattern for #title
   $("#title").patMypattern();

   // Invoke othermethod for the pattern 
   $("#title").patMypattern("othermethod", {option: "value"});


Injection actions
-----------------

The injection mechanism supports invoking arbitrary actions after loading new
content. This is handled through *injection actions*. These are handled by an
``inject`` method on a pattern.

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 3

   var pattern_spec = {
       name: "mypattern",

       inject: function($trigger, content) {
           ...
       }
   };

The inject methods gets a number of parameters:

* ``$trigger`` is the element that triggered the injection. 
* ``content`` is an array containing the loaded content.



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

Creating a JavaScript API
-------------------------

Sometimes you may want to create a JavaScript API that is not tied to DOM
elements, so exposing it as a jQuery plugin does not make sense. This can
be done using the standard RequireJS mechanism by creating and returning an
API object.

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 13-17

   define([
       'require',
       '../registry'
   ], function(require, registry) {
       var pattern_spec = {
           init: function($el) {
               ...
           };
       };

       registry.register(pattern_spec);

       var public_api = {
           method1: function() { .... },
           method2: function() { .... }
       };
       return public_api;
   });


You can then use the API by using require to retrieve the API object for
the pattern:

.. code-block:: javascript

  var pattern_api = require("patterns/mypattern");
  pattern_api.method1();
