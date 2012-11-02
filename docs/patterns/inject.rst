Injection
=========

Injection is one of the most powerful features of Patterns. It makes
it trivial to load content from a server and include it on a web page.
This can be used to do on-demand loading of content, do in-page form
submission, perform AJAX requests with results shown as notifications
and many other things.

The simplest form of injection is a link which loads content when
clicked:

.. code-block:: html

   <a href="demos/frobber.html#content" class="pat-inject">Demo the frobber</a>

   <section id="content">
     ...
   </section>

When a user clicks this link ``demos/frobber.html`` will be fetched
via AJAX, the element with id ``content`` is extracted and used to
replace the content of ``#content`` on the current page.

In another situation you may not want to replace content but add new
content. You can easily do that by using a modifier.

.. code-block:: html

   <a href="latest-news.html#content" class="pat-inject"
      data-pat-inject="target: #news::before">Tell me more</a>

   <section id="content">
     ...
   </section>

In this example clicking on the *Tell me more* link will load the
latest news content and inject it before the content of ``#news``.

Perhaps inserting a single block of content is not enough for your
needs? Don't worry! Lets give you another example:

.. code-block:: html

   <section id="section">
     <form action="/my/form" class="pat-inject"
      data-pat-inject="#content && selector: #notice; type: notification">
       ...
     </form>
   </section>

When you submit this form two things happen: ``#content`` from the
response is used to replace ``#section``'s content of the page,
replacing the current form with a new form or a feedback message. In
addition a ``#notice`` element is extracted from the response and
shown as a selfhealing notification message.

XXX: adjust to the correct type

XXX: cross references for above

XXX: give an overview of sections with cross references


Where and what to inject
------------------------

The most simple injection fetches a source via ajax, extracts its
body's content and replaces the current body's content with it:

.. code-block:: html

   <a href="news.html" class="pat-inject">
     Display news content in body content
   </a>

Admittedly, this is a rare use case. However, it is ideal to
understand the defaults:

.. note:: Default source and target selector

   The default source selector is ``body`` and if no target selector
   is specified, the source selector will als be used as target
   selector.

.. note:: By default we work with/on content

   For ``target`` and ``source`` by default the content is selected
   and worked on.

In the next section you learn how to use element ids as ``source`` and
``target`` selectors, which covers most use cases. These can be
combined with modifiers and finally the full injection power is
unleashed with arbitrary jquery selectors.

XXX: add references to the sections.


Select individual elements via ``#id``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The simple injections replace the content of an element in ``target``
with the content of an element in ``source``. There is a one-to-one
relation between elements in source and target:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src1; target: #tgt1 &&
                       source: #src2; target: #tgt2">
     Multi-injection with a one-to-one mapping.
   </a>


In case one source element is to be used for both targets, it can be
specified as part of the ``href`` (or ``action`` in case of forms):

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src; target: #tgt1 &&
                       source: #src; target: #tgt2">
     One source element for two targets.
   </a>

   <a class="pat-inject" href="sources.html#src"
      data-pat-inject="target: #tgt1 &&
                       target: #tgt2">
     One source element for two targets, source specified via href.
   </a>


The source id specified as part of ``href``/``action`` is the default
source selector and can be overriden for one or more injections:

.. code-block:: html

   <a class="pat-inject" href="sources.html#src"
      data-pat-inject="target: #tgt1 &&
                       target: #tgt2 &&
                       source: #other; target: #tgt3">
     One injection overrides the default source element.
   </a>


Modifiers
~~~~~~~~~

So far you can replace target element content with source element
content. In order to work on the elements instead of their content,
and to put things relative to selected elements, we introduce three
modifiers:

``:element``
    Select the element, instead of the content.

    Can be used for ``source`` and ``target``, and in case of the
    latter be combined with ``::before``/``::after``.

``::before``
    Like in CSS, the pseudo-element (a position) right before the
    content of the target element. The so far non-existing, but
    soon-to-be first child of the target element.

    Can be used for ``target`` and combined with ``:element``.

``::after``
    Like in CSS, the pseudo-element (a position) right before the
    content of the selected element.

    Can be used for ``target`` and combined with ``:element``.

Let's see these in action and combination:

Still working on content
^^^^^^^^^^^^^^^^^^^^^^^^

Replace target content with source content (default, just a reminder):

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src; target:  #tgt">


Put source content before target content:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src; target: #tgt::before">


Put source content after target content:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src; target: #tgt::after">


Elements instead of content
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Replace target element with source element:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src::element; target: #tgt::element">


Put source element before target element:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src::element; target: #tgt::element::before">


Put source element after target element:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src::element; target: #tgt::element::after">


Mixing element and content
^^^^^^^^^^^^^^^^^^^^^^^^^^

Replace target element with source content:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src; target: #tgt::element">


Replace target content with source element:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src::element; target: #tgt">


Source content before target element:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src; target: #tgt::element::before">


Source content after target element:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src; target: #tgt::element::after">


Source element before target content:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src::element; target: #tgt::before">


Source element after target content:

.. code-block:: html

   <a class="pat-inject" href="sources.html"
      data-pat-inject="source: #src::element; target: #tgt::after">




Using full-blown jquery selectors
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

XXX: to be done and especially tested


Non-existing targets
--------------------

In case the target selector returns no elements, we will attempt to
create a matching element for you - the fuuuture, the apex of the
vortex of injection.

So far we are able to handle ``target`` selectors that consist of only an
id: A ``div`` with that id will be created and injected as the last
child of ``body``:

.. code-block:: html

     <a class="pat-inject" href="sources.html"
        data-pat-inject="target: #non-existing">
     ...
   </body>

After the injection:

.. code-block:: html

     <a class="pat-inject" href="sources.html"
        data-pat-inject="target: #non-existing">
     ...
     <div id="non-existing">
       Content of body of sources.html
     </div>
   </body>


Trigger
-------

By default injection is triggered on click for anchors and on submit
for forms. Further, it can be trigger upon initialisation
(``autoload``) and when coming into view (``autoload-visible``).
``autoload`` injection is useful to deliver a page skeleton, where
e.g. header, body, and sidebar load their content in parallel.
``autoload-visible`` injection is useful to build infinite lists,
where the injection element replaces itself with the next 10 entries
and a new ``autoload-visible`` injection link.

.. code-block:: html

   <a href="sources.html#id" class="pat-inject"
      data-pat-inject="trigger: autoload">Autoloads as soon as initialised</a>

   <a href="sources.html#id" class="pat-inject"
      data-pat-inject="trigger: autoload-visible">Autoloads as soon as visible</a>


XXX: example infinite list


Change href after injection
---------------------------

EXPERIMENTAL FEATURE

WILL DO SOMETHING WHEN COMBINED WITH MULTI-INJECTION

For anchors, you can specify an href to point to, after the injection
was triggered. If that element exists already during initialisation,
the injection is not initialised and the href changed to next-href.

before:

.. code-block:: html

   <a class="next-month pat-inject" href="calendar.html#2012-05"
      data-pat-inject="post: #2012-04; next-href: #2012-05">Next month</a>
   ...
   <div class="month" id="2012-04">
     ...
   </div>

after:

.. code-block:: html

   <a class="next-month" href="#2012-05"
      data-pat-inject="">Next month</a>
   ...
   <div class="month" id="2012-04">
     ...
   </div>
   <a class="next-month pat-inject" href="calendar.html#2012-06"
      data-pat-inject="post: #2012-05; next-href: #2012-06">Next month</a>
   ...
   <div class="month" id="2012-05">
     ...
   </div>


Injection type (modals)
-----------------------

XXX: TODO

Modals
~~~~~~

Inject a modal panel: modal-source.html is fetched, its body's content
is wrapped into a ``div#modal.modal``, any existing such modal is
removed and the new modal injected as last element of the body:

.. code-block:: html

     <a class="pat-inject" href="modal-source.html" data-pat-inject="type: modal">

   ...
   </body>

It corresponds and is shorthand notation for:

.. code-block:: html

     <a class="pat-inject" href="modal-source.html" data-pat-inject="target: div#modal.modal">

   ...
   </body>


After injection was triggered:

.. code-block:: html

     <a class="pat-inject" href="modal-source.html" data-pat-inject="type: modal">

     <div id="modal" class="pat-modal">
       Content from modal-source.html's ``body``.
     </div>
   </body>


   <a class="pat-inject" href="modal-source.html" data-pat-inject="type: modal">

