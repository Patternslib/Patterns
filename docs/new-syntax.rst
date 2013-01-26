Patterns overview (with new syntax)
===================================

Collapsible
-----------

::

  <div class="collapsible">
  <div class="collapsible open">
  <div class="collapsible closed">


Changing attributes
-------------------

Setting
~~~~~~~

Not sure whether setting is needed.

::

  <button data-set=".someClass; space sep list of values to be set">
  <button data-set=".someClass; space sep list of values to be set; class"> (same as above)
  <button data-set=".someClass; space sep list of values to be set; attr: class"> (same as above)
  <button data-change=".someClass; set: space sep list of attr values to be set; attr: class">

  <button data-set=".someClass; class = space sep list of values to be set"> (**discuss**)
  <button data-change=".someClass; class = space sep list of values to be set"> (**discuss**)
  <button data-change=".someClass; set: class = space sep list of values to be set"> (**discuss**)


Adding
~~~~~~
::

  <button data-add=".someClass; space sep list of values to be added">
  <button data-add=".someClass; space sep list of values to be added; class"> (same as above)
  <button data-add=".someClass; space sep list of values to be added; attr: class"> (same as above)
  <button data-change=".someClass; add: space sep list of attr values to be added; attr: class">

  <button data-add="; space sep list of attr values to be added; attr: class"> (button itself)
  <button data-add="values: space sep list of attr values to be added; attr: class"> (button itself)
  <button data-change="add: space sep list of attr values to be added; attr: class"> (button itself)

  <button data-add=".someClass; space sep list of attr values to be added; attr: attrname">
  <button data-change=".someClass; add: space sep list of attr values to be added; attr: attrname">

  <button data-add=".someClass; class += space sep list of values to be set"> (**discuss**)
  <button data-change=".someClass; class += space sep list of values to be set"> (**discuss**)
  <button data-change=".someClass; add: class = space sep list of values to be set"> (**discuss**)
  <button data-change=".someClass; add: class += space sep list of values to be set"> (**discuss**)


Removing
~~~~~~~~
::

  <button data-remove=".someClass; space sep list of values to be removed">
  <button data-remove=".someClass; space sep list of values to be removed; class"> (same as above)
  <button data-remove=".someClass; space sep list of values to be removed; attr: class"> (same as above)
  <button data-change=".someClass; remove: space sep list of attr values to be removed; attr: class">

  <button data-remove=".someClass; space sep list of attr values to be added; attr: attrname">
  <button data-change=".someClass; remove: space sep list of attr values to be added; attr: attrname">

  <button data-add=".someClass; class -= space sep list of values to be set"> (**discuss**)
  <button data-change=".someClass; class -= space sep list of values to be set"> (**discuss**)
  <button data-change=".someClass; remove: class = space sep list of values to be set"> (**discuss**)
  <button data-change=".someClass; remove: class -= space sep list of values to be set"> (**discuss**)


Switching
~~~~~~~~~
::

  <a data-switch="body; a b"> (switch the two classes)
  <a data-switch="body; a-* b"> (switch the two classes - If a-* does not exist, never mind)
  <a data-change="body; switch: a-* b"> (switch the two classes - If a-* does not exist, never mind)

  <a data-switch="body; class = a b"> (**discuss**)
  <a data-switch="body; class = a-* b"> (**discuss**)
  <a data-change="body; switch: class = a-* b"> (**discuss**)


toggle/rotate elements independently
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
::

  <a data-toggle="body; a" (set/unset a)
  <a data-toggle="body; a b" (toggle between a and b, start with a if not there)
  <a data-toggle="body; a b c" (rotate, start with a if not there)
  <a data-change="body; toggle: a b c">

  <a data-toggle="body; class = a" (**discuss**)
  <a data-toggle="body; class = a b" (**discuss**)
  <a data-toggle="body; class = a b c" (**discuss**)
  <a data-change="body; toggle: class = a b c"> (**discuss**)


All together
~~~~~~~~~~~~
::

  <a data-change="body; toggle: e f; switch: a b; remove: c; add: d; set: g">
  <a data-change="body; toggle: e f; switch: a b; remove: c; add: d; set: g; attr=attr1">
  <a data-change="body; toggle: e f; switch: a b; remove: c; add: d; set: g; attr=attr1 &&
                  body; toggle: e f; switch: a b; remove: c; add: d; set: g; attr=attr2">

  <a data-change="body; toggle: attrX = e f; switch: attrY = a b;
                        attrZ -= c; attrK += d; class = g"> (**discuss**)



Injection
---------

Injection by default will take the content from source and replace the
target's content with it.


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


Changing the target while injecting (discusss)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
::

  <a href="snippets.html#source" class="inject" data-add="modal">
  <a href="snippets.html#source" class="inject" data-change="add: modal">
  <a href="snippets.html#source" class="inject" data-change="data-foo = abc">
  <a href="snippets.html#source" data-inject="#target" data-add="modal">

not so sure about these::

  <a href="snippets.html#source" data-inject="#target; change: class="modal">
  <a href="snippets.html#source" data-inject="#target; change: class+="modal">



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

::

  <a id="sourceid" href="tooltips.html#myTip" data-injection="#myTip.tooltip[data-tooltip-info='rt forcePosition']">
  <button id="targetid" class="tooltip" data-tooltip="rt" title="Tooltip content">

  <button id="targetid">

At some point, the block below here is injected somewhere on the same page. The block is hidden with CSS.

::

    <div class="tooltip-interim" data-tooltip="rt force-position auto-show; target: selector">
      <p>
         This button is new. It's really cool, you should check it out now! <a href="somewhere.html">Learn more…</a>
      </p>
      <a href="#targetid" class="no-js">Jump to section.</a>
    </div>
    <img src="foo.png" title="Tooltip content" alt="Descriptive text
      on image for blind people" class="tooltip" />

above will be turned into below during loading::

    <div class="tooltip-container rt forcePosition"  style="top: 208px ....; display: hidden">
  </body>

