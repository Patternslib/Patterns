Toggling element attributes
===========================

The *toggle* pattern can be used to toggle attribute values for objects. It is most commonly
used to toggle a CSS class.

.. code-block:: html

   <a href="#" data-toggle="selector: #work; attr: class; value: active">Start working</a>
   </a>
   <div id="work">
     Working..
   </div>

If a user clicks on the *Start working* link the ``active`` class is added to the div. If the
link is clicked again the ``active`` class is removed again. You can also use shorthand notation
for this pattern:

.. code-block:: html

   <a href="#" data-toggle="#work; class; active">Start working</a>
   </a>
   <div id="work">
     Working..
   </div>

The default attribute is *class*, so you do not need to specify that manually.

When updating attributes the value is set if the attribute does not exist or has
a different value, or removed if the attribute already has the provided value. This
can be used to check the selected state of a checkbox:

.. code-block:: html

  <input type="checkbox" id="toCheck" />
  <button data-toggle="#toCheck; checked; checked">toggle checkbox</button>

If you are manipulating the ``class`` attribute you can specify multiple classes separated
by spaces to toggle multiple classes.

.. code-block:: html

   <a href="#" data-toggle="#work; class; active inactive">Start working</a>
   </a>
   <div id="work" class="inactive">
     Working..
   </div>

On the first click the ``inactive`` class will be removed and ``active`` will be added. On
the next click ``active`` will be removed again and ``active`` restored.
