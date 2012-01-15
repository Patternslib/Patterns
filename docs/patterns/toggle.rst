Toggling element attributes
===========================

The *toggle* pattern can be used to toggle attribute values for objects. It is most commonly
used to toggle a CSS class.

.. code-block:: html

   <a href="#" data-toggle="id=work|attr=class|values=active">Start working</a>
   </a>
   <div id="work">
     Working..
   </div>

If a user clicks on the *Start working* link the ``active`` class is added to the div. If the
link is clicked again the ``active`` class is removed again.

When updating attributes the value is replaced directly. When updating the ``class`` attribute
special care is taken to only toggle the selected classes.

For CSS classes it is also possible to specify a class to be removed by adding it to the value
parameter, prefixed by a colon.

.. code-block:: html

   <a href="#" data-toggle="id=work|attr=class|values=active:inactive">Start working</a>
   </a>
   <div id="work" class="inactive">
     Working..
   </div>

On the first click the ``inactive`` class will be removed and ``active`` will be added. On
the next click ``active`` will be removed again and ``active`` restored.
