Argument parser
===============

Many patterns can be configured to change their behaviour. This is done by
passing arguments to the parser in data-* attributes or when using an internal
javascript API. All processing of arguments is done by the argument parser.
Using the parser is easy:

.. code-block:: javascript
   :linenos:

   var parser = new ArgumentParser();
   parser.add_argument("delay", 150);
   parser.add_argument("loop", false);
   parser.add_argument("next-label", "Next");

   $("[data-tooltip]").each(function() {
       var options = parser.parse(this.dataset.tooltip);
       ...
   });

Lines 1-4 show how to create a new argument parser instance and tell it about
the options we want to handle and provide some default values. The code
then finds all elements in the document with a data-tooltip attribute and
uses the argument parser to parse the value.


Parser API
-----------

.. js:class:: ArgumentParser()

   Create a new argument parser instance.


.. js:function:: ArgumentParser.add_argument(name[, default])

   :param string name: argument name
   :param default: default value

   Register a new argument. The default value will be used if no value was
   found during parsing, and is used to determine what data type should be
   used.


.. js:function:: ArgumentParser.parse(data[, defaults])

   :param string data: data to parse
   :param object defaults: default values to use
   :returns: object with parsed values, or list of objects 

   Parse a string with parameters and return the parsed data. You can
   optionally provide default values that will supplement (and override) the
   defaults registered with add_argument.

   If a the input data uses the ``&&`` operator to indicate multiple parameters
   are present this method will return a list of results instead of a single
   object.

