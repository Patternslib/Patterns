Argument parser
===============

Many patterns can be configured to change their behaviour. This is done by
passing arguments to the parser in data-pat-* attributes or when using an
internal javascript API. All processing of arguments is done by the argument
parser.  Using the parser is easy:

.. code-block:: javascript
   :linenos:

   var parser = new ArgumentParser("tooltip");
   parser.add_argument("delay", 150);
   parser.add_argument("loop", false);
   parser.add_argument("next-label", "Next");

   $("[data-pat-tooltip]").each(function() {
       var options = parser.parse($(this));
       ...
   });

Lines 1-4 show how to create a new argument parser instance for our
pattern, tell it about the options we want to handle and provide some default
values. The code then finds all elements in the document with a
``data-pat-tooltip`` attribute and uses the argument parser to parse the value.

The parser combines values from multiple sources. In order of priority they are:

1. options passed in to the parse() call
2. options for the ``data-pat-<name>`` attribute of the parsed element
3. options for the ``data-pat-<name>`` attribute of all parent elements
4. default values provided in the add_argument() call


Parser API
-----------

.. js:class:: ArgumentParser(name)

   :param string name: name of the pattern

   Create a new argument parser instance. The pattern name is used to find the
   right attribute to parse for elements.


.. js:function:: ArgumentParser.add_argument(name[, default[, choices[, multiple]]])

   :param string name: argument name
   :param default: default value
   :param array choice: list of acceptable values
   :param multiple: boolean flag indicating if argument is a list of values

   Register a new argument. The default value will be used if no value was
   found during parsing, and is used to determine what data type should be
   used.

   As a special feature you can define an *argument-alias* as default value by
   using a ```$<argument name>``` as default value. In that case if no value
   for the argument was provided a copy of the referenced argument will be
   used.

   The default value can also be a function taking a jQuery wrapped element
   and the parameter name as arguments and which returns a default value.

   .. code-block:: javascript

      parser.add_argument("delay", function($el, name) {
          return 500;
      });


.. js:function:: ArgumentParser.parse($el [, options][, multiple])

   :param $el: jQuery object for element to parse
   :param object defaults: default values to use
   :param boolean multiple: flag indicating if multiple values should
     be returned.
   :returns: object with parsed values, or list of objects if multiple
     is true.

   This method returns the configuration for a pattern from an object. You can
   optionally provide options that will override default values and values
   found on the element.

   If you use argument groups (multiple parameters that share a prefix) their
   options will be returned as a sub-object. For example a parser with
   these arguments:

   .. code-block:: javascript

       parser.add_argument("selector", ".pattern");
       parser.add_argument("control-arrows", false);
       parser.add_argument("control-links", true);
       parser.add_argument("control-index", false);

   will return an object like this:

   .. code-block:: javascript

       {selector: ".pattern",
        control: {arrows: false,
                  links: true,
                  index: false}}
