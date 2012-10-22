Parameter syntax
================

Extended notation
-----------------

The simplest notation you can use for parameters is the *extended notation*.
When using this notation you always specify the argument name and its value,
separated by a colon.

::

    store: session
    delay: 15
    loop: false

Multiple arguments can be provided by separating them with a semicolon.

::

    store: session; loop: false
    delay: 15: easing: bounce;


Shorthand notation
------------------

The extended syntax can be a bit verbose. In order to keep your markup short
you can also use a simpler short notation. In this notation you specify all
arguments using a pre-defined fixed order. For example the toggle pattern takes
three arguments: the selector, an attribute and a value. Using shorthand
notation you can specify all three values directly separated by a space. For
example the parameter ``.myClass class active`` indicates that the selector is
``.myClass``, the attribute is ``class`` and the value is ``active``. This
also reveals a limitation in shorthand notation: a value can not contain a
space.

Boolean values can be referenced directly by name. If you prefix the name with
``no-`` the argument will be set to false. For example for the tooltip pattern
you can use ``sticky no-click``: this sets ``sticky`` to true and ``click`` to
false.

Enum values can also be used directly. For example the toggle pattern has a
``store`` argument which can take three values. This allows you to write
a parameter like this::

    :input.myClass checked session

It can happen that a name is both a known boolean option and a value enum
value. In that case it is treated as a boolean option.


Multiple parameters
-------------------

Some patterns (for example toggle) accept multiple parameters. This can be
done by separating them with ``&&``.

::

    .myClass class active && :input.myClass checked
