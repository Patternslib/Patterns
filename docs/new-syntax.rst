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


