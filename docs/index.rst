Welcome to Patterns's documentation!
====================================

Patterns is a JavaScript library that enables designers to build rich
interactive prototypes without needing to write any JavaScript. All events
are triggered by classes and other attributes in the HTML, without abusing the
HTML as a programming language. Accessibility, SEO and well structured HTML are
core values of Patterns.

Using Patterns
--------------

There are two ways to use Patterns in your project: loading it using
RequireJS, or loading it directly. In both cases you will need to
make sure jQuery is included first.

If you want to load Patterns directly you will need to include these two lines
in your markup:

.. code-block:: html

   <script type="text/javascript"
     src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
   <script type="text/javascript"
     src="https://raw.github.com/Patternslib/Patterns/master/bundles/require-patterns.min.js"></script>

This will load jQuery and the single-file version of Patterns.

If your project is using RequireJS you can use that to load Patterns. You will
need to either load jQuery first or use `require-jquery
<http://requirejs.org/docs/jquery.html#get>`_. You can then load Patterns using
a standard ``define`` call.


.. code-block:: javascript

   requirejs.config({
       patterns: "https://raw.github.com/Patternslib/Patterns/master/bundles/patterns.js"
   });

   define(["patterns"], function() {
     ....
   });



Table of Contents
-----------------

.. toctree::
   :maxdepth: 2

   parameters
   patterns/index
   api/index

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
