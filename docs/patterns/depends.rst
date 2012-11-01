Dependencies
============

The *depends* pattern makes it possible to make visibility of content
conditional on form data. A common use case is to only show parts of a form
when relevant. Here is an example from a hypothetical pizza order form:

.. code-block:: html

   <form>
     <label><input type="checkbox" name="custom"/> Add extra toppings</label>

     <fieldset data-pat-depends="custom">
       <legend>Extra toppings</legend>
       <label><input type="checkbox" name="pineapple"/> Pineapple</label>
       <label><input type="checkbox" name="gorgonzola"/> Gorgonzola</label>
       <label><input type="checkbox" name="peanuts"/> Peanuts</label>
       <label><input type="checkbox" name="redonion"/> Red onions</label>
     </fieldset>
   </form>

In this example the fieldset with options for extra toppings is only shown when
the user indicates he wants to add extra toppings.

Another common use case is filtering a list based on some options:

.. code-block:: html

   <label><input type="checkbox" name="paid"/> Show paid invoiceslabel>
   <label><input type="checkbox" name="draft"/> Show draft invoices</label>
   <label><input type="checkbox" name="overdue" checked="checked"/> Show overdue invoices</label>

   <ul>
     <li data-pat-depends="paid">A paid invoice</li>
     <li data-pat-depends="paid">Another paid invoiceli>
     <li data-pat-depends="overdue">An overdue invoiceli>
     <li data-pat-depends="draft">A draft invoice</li>
     ....
   </ul>


Dependency expressions
----------------------

Dependencies are specified via *dependency expression*. These are expressions
that specify when an item should be visible or not.

The simplest form of a dependency expression is ``<input name>`` which
indicates that an input element with the given name (or id) must have a value
(if it is a checkbox must be checked). You can also test for a specifyc value:

* ``<input name>=<value>``: indicates that an input element must have a
  specific value. This is most useful when used to check which radio button is
  checked.
* ``<input name>!=<value>``: indicates that an input element must have a not
  specific value. This is most useful when used to check if a specific radio
  button is not checked.
* ``<input name> <= <value>``: indicates that an input element must have a value
  less than or equal than the given value. This is most useful for number and range
  inputs.
* ``<input name> < <value>``: indicates that an input element must have a value
  less than the given value. This is most useful for number and range inputs.
  inputs.
* ``<input name> > <value>``: indicates that an input element must have a value
  greater than the given value. This is most useful for number and range
  inputs.  inputs.
* ``<input name> >= <value>``: indicates that an input element must have a value
  greater than or equal than the given value. This is most useful for number
  and range inputs.

You can also revert a test by putting the ``not`` keyword in front of it. Here
are some examples:

.. code-block:: html

   <input type="checkbox" name="hidden"/>
   <p class="pat-depends" data-pat-depends="condition:hidden">Hidden items will be included.</p>
   <p class="pat-depends" data-pat-depends="condition:not hidden">Not showing hidden items.</p>

   <input type="range" name="price" value="50"/>
   <p class="pat-depends" data-pat-depends="price<100">Showing cheap options.</p>

You can also combine multiple tests using ``and`` and ``or``, optionally using
parenthesis to specify the desired grouping. Here is a more complex example that
showing use of ``and``.

.. code-block:: html

   <fieldset>
     <legend>Select your flavour</legend>
     <label><input type="radio" name="flavour" value="hawaii"/> Hawaii</label>
     <label><input type="radio" name="flavour" value="meat"/> Meatfest </label>
     <label><input type="radio" name="flavour" value="veg"/> Vegeration </label>
     <label><input type="checkbox" name="custom"/> Add extra ingredients</label>
   </fieldset>

   <fieldset class="pat-depends" data-pat-depends="custom">
     <legend>Select custom ingredients</legend>
     <label><input type="checkbox" name="cheese"/> Extra cheese</label>
     <label><input type="checkbox" name="bacon"/> Bacon</label>
   </fieldset>

   <em class="warning pat-depends"
       data-pata-depends="condition:flavour=veg and custom and bacon">
     Adding bacon means your pizza is no longer vegetarian!</em> 

This pizza menu will show a warning if the user selects a vegetarian pizza
but then also adds extra bacon to it.


Actions
-------

Two types of actions can be taken by the pattern: changing visibility and
disabling elements. The action can be specified using an ``action``
parameter.

.. code-block:: html

   <button data-pat-depends="title enable">Submit</button>

This example shows a submit button which is disabled if the title input
has no value.

The available actions are:

* ``show``: make an items visibility conditional on the dependencies. If the
  dependencies are not met the item will be invisible.
* ``enable``: disables items and adds a ``disabled`` class if the dependencies
  are not met.


Option reference
----------------

The depends can be configured through a ``data-pat-depends`` attribute.
The available options are:

+---------------------+------------+-----------------------------------------------+
| Field               | default    | Description                                   |
+=====================+============+===============================================+
| ``condition``       |            | The dependency condition.                     |
+---------------------+------------+-----------------------------------------------+
| ``action``          | ``show``   | Action to perform. One of ``show`` or         |
|                     |            | ``enable``.                                   |
+---------------------+------------+-----------------------------------------------+
| ``transition``      | ``show``   | Transition effect to use if the action is     |
|                     |            | ``show``. Must be one of ``none``, ``css``    |
|                     |            | ``fade`` or ``slide``.                        |
+---------------------+------------+-----------------------------------------------+
| ``effect-duration`` | ``fast``   | Duration of transition. This is ignored if    |
|                     |            | the transition is ``none`` or ``css``.        |
+---------------------+------------+-----------------------------------------------+
