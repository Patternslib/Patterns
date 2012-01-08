Dynamically hiding/showing or enabling/disabling elements
=========================================================

In forms it is often useful to show or hide parts of a form depending on how
form elements. This can be accomplished by specifying dependency information
on elements. Here is a simple example:

.. code-block:: html

   <label><input type="checkbox" name="details" value="on"/>Show details</label>

   <div class="dependsOn-details">
     ...
   </div>

The ``div`` element will only be shown if *Show details* is selected. For
more complex situations you can use multiple ``dependsOn-`` classes.

The format of the class name is ``dependsOn-<name>[-condition]``. ``name`` is
the name of an input field. The condition is optional and can be used to
check the value of an input field. The supported options are:

``on``
    For checkbox fields check if the checkbox is checked. For radio buttons
    check if an empty is selected. For other input elements check if they
    have a value or are empty. This is the default test if no condition is
    specified.

``off``
    The opposite of ``on``: test if a checkbox is not checked, or an input
    element is empty.

``equals``-*value*
    Test if an inputs value is exactly equal to *value*.

``notEquals``-*value*
    Test if an inputs value is not equal to *value*.

If multiple ``dependsOn`` classes are specified all of them have to be true.
You can change this behaviour using ``dependsType-or`` class: if this class
is present only one of the requirements has to be met.

Normally ``dependsOn`` manages visibility for objects. You can also use
dependencies to enable or disable items. To do this add the
``dependsAction-enable`` class.
