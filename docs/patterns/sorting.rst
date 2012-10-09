Sortable lists
==============

You can make any list sortable by adding a ``sorting`` class to it. The new
order will automatically be send to the server via a POST to the URL specified
in a ``data-injection`` attribute.

.. code-block:: html

   <ul class="sorting" data-injection="/update-order">
     <li id="one" >One</li>
     <li id="two">Two</li>
   </ul>
