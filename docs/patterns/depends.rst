Dependencies
============

The *depends* pattern makes it possible to make visibility of content
conditional on form data. A common use case is to only show parts of a form
when relevant. Here is an example from a hypothetical pizza order form:

.. code-block:: html

   <form>
     <label><input type="checkbox" name="custom"/> Add extra toppings</label>

     <fieldset class="dependsOn-custom">
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
     <li class="dependsOn-paid">A paid invoice</li>
     <li class="dependsOn-paid">Another paid invoiceli>
     <li class="dependsOn-overdue">An overdue invoiceli>
     <li class="dependsOn-draft">A draft invoice</li>
     ....
   </ul>


Specifying dependencies
-----------------------

Dependencies are specified via one or more ``dependsOn-*`` classes on an
element. In the simplest form these take a ``dependsOn-<input name>`` form
which indicates that an input element with the given name must have a value
(or if it is a checkbox must be checked). Other conditions are possible
by specifying extra conditions:

* ``dependsOn-<input name>-on``: indicates that an element name must have
  a value, or if it is a checkbox must be checked. This is the default
  behaviour.
* ``dependsOn-<input name>-off``: indicates that an element name must *not*
  have a value, or if it is a checkbox must be unchecked.
* ``dependsOn-<input name>-equals-<value>``: indicates that an input element
  must have a specific value. This is most useful when used to check with
  radio button is selected.
* ``dependsOn-<input name>-notEquals-<value>``: indicates that an input element
  must have a not specific value. This is most useful when used to check with
  radio button is selected.


If you specify multiple dependencies for an element they must all be made. This
can be changed with a ``dependsType-*`` class. The support values are:

* ``and``: all dependencies must be met (default).
* ``or``: only one of the specified dependencies needs to be fullfilled

.. code-block:: html

   <button class="dependsOn-title dependsOn-id dependsType-or">Submit</button>

This creates a button which is only visible if either a title or an id has
been provided.


Actions
-------

Two types of actions can be taken by the pattern: changing visibility and
disabling elements. The action can be specified using a ``dependsAction-*``
class.

.. code-block:: html

   <button class="dependsOn-title dependsAction-enable">Submit</button>

This example shows a submit button which is disabled if the title input
has no value.

The available actions are:

* ``show``: make an items visibility conditional on the dependencies. If the
  dependencies are not met the item will be invisible.
* ``enable``: disables items and adds a ``disabled`` class if the dependencies
  are not met.
