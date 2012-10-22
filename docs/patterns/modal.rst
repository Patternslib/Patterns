Modal panels
============

Panels, perhaps better (but incorrectly) known as dialogs or popups, can be
created using standard links or buttons using the ``openPanel`` class. An
example:

.. code-block:: html

   <a href="/status/server1#content" rel=".modal">Show server status</a>

This will load the page at ``/status/server1``, extract the element with it
``content`` and show that in a panel.

Forms in panels
---------------

Forms inside panels are automatically handled, but require some support from
the backend server. If a form inside a panel is submitted and the response from
the backend has a HTTP status 202 the result will be shown inside the panel. If
the form action URL has a fragment that will be used to extract part of the
response. If the form action URL has no fragment the same fragment as used to
initially open the panel will be used. For all other HTTP status codes the
panel will be closed and no further action is taken.
