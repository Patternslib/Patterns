Injection
=========

Injection is one of the most powerful features of Patterns. It makes it trivial
to load content from a server and include it on a web page. This can be used
to do on-demand loading of content, do in-page form submission, perform AJAX
requests with results shown notifications and many other things.

The simplest form of injection is a link which loads content when clicked:

.. code-block:: html

   <a href="demos/frobber.html#content" class="pat-inject">Demo the frobber</a>

   <section id="content">
     ...
   </section>

When a user clicks this link ``demos/frobber.html`` will be fetched, the
element with id ``content`` is extracted and used to replace the content of
``#content`` on the current page.

In another situation you may not want to replace content but add new
content. You can easily do that by specifying the *injection method*.

.. code-block:: html

   <a href="latest-news.html#content" class="pat-inject"
      data-pat-inject="method: prepend">Tell me more</a>

   <section id="content">
     ...
   </section>

In this example clicking on the *Tell me more* link will load the latest news
content and prepend it to ``#content``.

Perhaps inserting a single block of content is not enough for your needs? Don't
worry! Lets give you another example:

.. code-block:: html

   <section id="content">
     <form action="/my/form" class="pat-inject" data-pat-inject="#content && source: #notice; method: notification">
       ...
     </form>
   </section>

When you submit this form two things happen: ``#content`` from the response is
used to replace the ``#content`` of the page, replacing the current form with
a new form or a feedback message. In addition a ``#notice`` element is extracted
from the response and shown as a selfhealing notification message.


Injection methods
-----------------


