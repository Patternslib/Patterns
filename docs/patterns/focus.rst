Focus classes
=============

It is frequently useful to change the styling for labels or fieldsets if they
contain an input element that has the focus. Patterns facilitate that by
automatically adding a ``pat-focus`` class.

Lets look at a simple form:

.. code-block:: html
   :linenos:

   <form>
     <fieldset>
       <legend>Generic info</legend>
       <label>Title <input type="text" name="title"/></label>
       <label>Keywords <input type="text" name="keywords"/></label>
     </fieldset>

     <fieldset>
       <legend>Details</legend>
       ...
     </fieldset>
   </form>

If the focus changes to the keywords input Patterns will add the ``pat-focus``
class to the input element, its label and fieldset:


.. code-block:: html
   :linenos:
   :emphasize-lines: 2,4

   <form>
     <fieldset class="pat-focus">
       <legend>Generic info</legend>
       <label>Title <input type="text" name="title"/></label>
       <label class="pat-focus">Keywords <input class="pat-focus"type="text" name="keywords"/></label>
     </fieldset>

     <fieldset>
       <legend>Details</legend>
       ...
     </fieldset>
   </form>

It is not required to put the input element inside a label: labels will
automatically be scanned for relevant ``for`` attributes.

.. code-block:: html

   <label for="title">Title</label>
   <input id="title" type="text" name="title"/>

