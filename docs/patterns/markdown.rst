Markdown renderer
=================

The markdown pattern can render `Markdown
<http://en.wikipedia.org/wiki/Markdown>`_ in a HTML page. This is done by
putting markdown text in an element and adding a `pat-markdown` class.

.. code-block:: html

   <pre class="pat-markdown">
      This is list of things.

      1. Number one.
      2. Number two.
   </div>


The text inside the element will be rendered using the `PageDown
<http://code.google.com/p/pagedown/>`_ renderer. The original element
will be replaced with a div containing the renderer text:

.. code-block:: html

   <div>
     <p>This is a list of things.</p>
     <ol>
       <li>Number one.</li>
       <li>Number two.</li>
     </ol>
   </div>


Using markdown with injection
-----------------------------

You can also use markdown rendering in combination with injection: if the
injected content is markdown it will automatically be rendered. There are two
ways for Patterns to detect that you are injecting markdown: filename extension
and explicit configuration.

If you inject a URL which ends in ``.md`` it will be considered to be markdown
source.

.. code-block:: html

   <a href="content.md" class="pat-inject" data-pat-inject="target: #target">Show me the money!</a>

If you have no control over the URL you can also explicitly tell the injection
pattern that it is loading markdown content through its ``data-type`` option.

.. code-block:: html

   <a href="content" class="pat-inject" data-pat-inject="target: #target; data-type: markdown">Show me the money!</a>
