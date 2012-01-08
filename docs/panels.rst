Creating modal panels
=====================

A common task is to load some markup and display it in a modal overlay on
the current page. Similar to dynamic insertion of markup this is also done
via a simple ``<a>`` tag:

.. code-block:: html

   <a href="http://localhost/login#login-form">  rel="#form" class="openPanel">Login</a>

The ``openPanel`` class indicates that the loaded markup should be displayed
in a panel instead of only inserted into the page. Non-javascript users (and
search engines) will see the full login-page, so it is important to make sure
that that is proper page.


Forms inside panels
-------------------

Forms in panels are fully supported. Forms in panels are submitted using an
AJAX request, and the result is scanned to determine how to handle the result.
The rules are:

1. if the HTTP status code of the response is not `202` or if the response
   has a content type of ``application/json`` the panel is closed and an
   ``ajaxFormResult`` event is triggered for the link that caused to overlay
   to be originally opened. Data from JSON responses is parsed and
   passed on to the ``ajaxFormResult`` event handler as an extra parameter.

2. the fragment ofthe action URL for the form, or the fragment of
   the link which was used to open the overlay, is used to extract the 
   part of the response that should be shown.

3. standard content intilisation is done on the response, and a ``newContent``
   event is triggered on the root of the new content, allowing further changes
   or setup to be done if required.

4. the contents of the panel is replaced with the new content.
