Patterns overview (with new syntax)
===================================

Collapsible
-----------

::

  <div class="collapsible">
  <div class="collapsible open">
  <div class="collapsible closed">


Changing attribute
------------------

Adding
~~~~~~
::

  <button data-add=".someClass; space sep list of values to be added">
  <button data-add=".someClass; space sep list of values to be added; class"> (same as above)
  <button data-add=".someClass; space sep list of values to be added; attr: class"> (same as above)
  <button data-change=".someClass; add: space sep list of attr values to be added; attr: class">

  <button data-add=".someClass; space sep list of attr values to be added; attr: attrname">
  <button data-change=".someClass; add: space sep list of attr values to be added; attr: attrname">


Removing
~~~~~~~~
::

  <button data-remove=".someClass; space sep list of values to be removed">
  <button data-remove=".someClass; space sep list of values to be removed; class"> (same as above)
  <button data-remove=".someClass; space sep list of values to be removed; attr: class"> (same as above)
  <button data-change=".someClass; remove: space sep list of attr values to be removed; attr: class">

  <button data-remove=".someClass; space sep list of attr values to be added; attr: attrname">
  <button data-change=".someClass; remove: space sep list of attr values to be added; attr: attrname">


Switching
~~~~~~~~~
::

  <a data-switch="body; a b"> (switch the two classes)
  <a data-switch="body; a-* b"> (switch the two classes - If a-* does not exist, never mind)
  <a data-change="body; switch: a-* b"> (switch the two classes - If a-* does not exist, never mind)


toggle/rotate elements independently
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
::

  <a data-toggle="body; a" (set/unset a)
  <a data-toggle="body; a b" (toggle between a and b, start with a if not there)
  <a data-toggle="body; a b c" (rotate, start with a if not there)
  <a data-change="body; toggle: a b c">


All together
~~~~~~~~~~~~
::

  <a data-change="body; toggle: e f; switch: a b; remove: c; add: d">
  <a data-change="body; toggle: e f; switch: a b; remove: c; add: d; attr=attr1">
  <a data-change="body; toggle: e f; switch: a b; remove: c; add: d; attr=attr1 &&
                  body; toggle: e f; switch: a b; remove: c; add: d; attr=attr2">



Injection
---------

Injection by default will take the content from source and replace the
target'ss content with it.


Single injection
~~~~~~~~~~~~~~~~
::

  <a href="snippets.html#source" class="inject"> (source and target with same id)
  <a href="snippets.html#source" data-inject="#target"> (source and target with different id)
  <a href="snippets.html#source" data-inject="#source #target"> (more verbose)
  <a href="snippets.html#source" data-inject="#other #target"> (not sane but possible)

  <a href="snippets.html" class="inject"> (XXX: what to do?)
  <a href="snippets.html" data-inject="#target"> (XXX: what to do?)

A browser without javascript support will ignore the injection, but
jump to #source in snippets.html.


Multiple injection
~~~~~~~~~~~~~~~~~~
::

  <a href="snippets.html" data-inject="#source1 #target1 && #source2 #target2">
  <a href="snippets.html#source1" data-inject="#target1 && #source2 #target2">
  <a href="snippets.html#source2" data-inject="#source1 #target1 && #target2">
  <a href="snippets.html#source" data-inject="#target1 && #target2"> (one source into two targets)
  <a href="snippets.html#source" data-inject="#target1,#target2"> (same as above)

  <a href="snippets.html#default_source" data-inject="#target1 && #source2 #target2 && #target3">


Non-existent target
~~~~~~~~~~~~~~~~~~~
::

  <a href="snippets.html#source" data-inject="#target1.modal[data-foo='abc']">

If the selector for the target does not return a target, a minimal
target will be created as last child of ``body`` that matches the
selector, the tag defaults to ``div``.


Altering an existing target
~~~~~~~~~~~~~~~~~~~~~~~~~~~
::

  <a href="snippets.html#source" data-inject="#target1; .modal[data-foo='abc']">
  
``#target1`` exists, it's content is replaced with the content of
``#source``, the class ``modal`` and is added and ``data-foo`` is set
to ``abc``.

Really? The injection still feels rough.

Methods (under discussion)
~~~~~~~~~~~~~~~~~~~~~~~~~~

- prepend: insert as first child of matched element (programmer: prepend, designer: before, jquery: prepend)
- append: insert as last child of matched element (programmer: append, designer: after, jquery: append)
- replace: replace matched element
- content: replace content of matched element (default)
- before-tag?: insert before matched element (programmer: before, jquery: before)
- after-tag?: insert after matched element (programmer: after, jquery: after)


Tooltip
-------

Inconsistency: .tooltip should turn something into a tooltip,
.spawn-tooltip could spawn a tooltip for something, actually a
data-injection that sets the correct data on the tooltip.

not sure - just a thought
