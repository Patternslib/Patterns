Detect selected radio buttons and checked checkboxes
====================================================

You may want to style labels different depending on the state of their
checkbox or radio button. Patterns supports this by automatically adding
a ``pat-checked`` or ``pat-unchecked`` class to labels to reflect the
state of the input element.

As a simple example lets take this part of a sandwich order form:

.. code-block:: html
   :linenos:

   <fieldset class="condensed">
     <legend>Type of bread</legend>
     <label><input type="radio" name="radio"/> Brown</label>
     <label><input type="radio" name="radio" checked="checked"/> Wheat</label>
     <label><input type="radio" name="radio"/> White</label>
   </fieldset>

Patterns will modify this to look like this:

.. code-block:: html
   :linenos:
   :emphasize-lines: 3,4,5

   <fieldset class="condensed">
     <legend>Type of bread</legend>
     <label class="pat-unchecked"><input type="radio" name="radio"/> Brown</label>
     <label class="pat-checked"><input type="radio" name="radio" checked="checked"/> Wheat</label>
     <label class="pat-unchecked"><input type="radio" name="radio"/> White</label>
   </fieldset>

As you can see the labels have gotten a new class attribute which matches
the selection state of the radio button.

