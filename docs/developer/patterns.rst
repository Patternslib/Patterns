The structure of a pattern
==========================

Patterns are implemented as JavaScript classes that are registered with the patterns registry.
Below is a minimalistic skeleton for a pattern with explanations as inline comments.

.. code-block:: javascript
   :linenos:

    import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
    import Parser from "@patternslib/patternslib/src/core/parser";
    import registry from "@patternslib/patternslib/src/core/registry";

    export const parser = new Parser("test-pattern");
    // Define an argument with a default value. You can configure the value via
    // data-attributes.
    parser.addArgument("example-option", "Hollareidulio");

    class Pattern extends BasePattern {

        // Define a name for the pattern which is used as key in the pattern
        // registry.
        static name = "test-pattern";
        
        // Define a CSS selector. The pattern will be initialized on elements
        // matching this selector.
        static trigger = ".pat-test-pattern";

        // The parser instance from above.
        static parser = parser;

        init() {
            import("./test-pattern.scss");

            // Try to avoid jQuery, but here is how to import it, asynchronously.
            // eslint-disable-next-line no-unused-vars
            const $ = (await import("jquery")).default;

            // The options are automatically created, if parser is defined.
            const example_option = this.options.exampleOption;
            this.el.innerHTML = `
                <p>${example_option}, this is the ${this.name} pattern!</p>
            `;
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



Pattern configuration
---------------------

The configuration of a pattern is generally based on three components: the
default settings, configuration set on a DOM element via a data-attribute.
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
