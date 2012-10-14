Autosubmit forms
================

.. code-block:: html

  <form>
    <input name="q" data-pat-autosubmit=""/>
  </form>

This will autosubmit the form as soon as the *q* input field is changed. This
may not be desirable: often you want to delay a little bit to allow a user to
finish typing or making changes. You can configure this by adding a delay:

.. code-block:: html

  <form>
    <input name="q" data-pat-autosubmit="delay"/>
  </form>
 
You can also configure the delay explicitly by specifying a timeout in milliseconds:

.. code-block:: html

  <form>
    <input name="q" data-pat-autosubmit="500"/>
  </form>


If you want to trigger form submission for multiple, or even all, elements in a
form you can do so by setting ``data-pat-autosubmit`` on grouping element.

.. code-block:: html

  <form>
    <fieldset data-submit="delay">
     <input type="text" name="q" placeholder="Search query"/>
     <label><input type="checkbox" name="local"/> Only search in this section</label>
   </fieldset>
  </form>


Combining with injection
------------------------

Autosubmit is most useful when combining with injection. This makes it trivial
to create a form that automatically loads content and displays it on the page.
Here is a minimal search page:

.. code-block:: html
   :linenos:

   <form data-pat-autosubmit="delay" action="/search" data-injection="#results:content">
     <input type="text" name="q" placeholder="Search query"/>
     <label><input type="checkbox" name="local"/> Only search in this section</label>
   </form>

   <section id="results">
     ... present search results here
   </section>

As soon as the user starts entering text in the search field or changes the
local-search toggle search requests will send to the server and the results
will be inserted into the existing page by replacing the content of the
*results* section.


Javascript API
--------------

The javascript API is entirely optional since patterns already autmoatically
enables the autosubmit behaviour for all elements with a ``data-pat-autosubmit``
attribute.


.. js:function:: jQuery.patternAutosubmit([options])

   :param options: one or more objects describing triggers to execute

   Setup switching behaviour for the selected elements. If no options are
   provided they are taken from the ``data-pat-autosubmit`` attributes. Options
   can be provided as a (array of) javascript object(s) with he following
   keys:

   * ``delay``: how long to delay submissions (in milliseconds). If not
      provided no delay will be used.


   .. code-block:: javascript

      $("form").patternAutosubmit({delay: 500});


.. js:function:: jQuery.patternAutosubmit("destroy")

   Disable all autosubmit behaviour for the matched elements.
