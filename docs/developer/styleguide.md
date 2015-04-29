# The Patterns code styleguide

## Run tests before any commit

Before you make a commit make sure to run all tests. The simplest way to do
this is use the `check` make target. This will run jshint to make sure your
code matches our style guide, and it runs all unittests.

```
$ make check

Finished
-----------------
364 specs, 0 failures in 0.338s.

ConsoleReporter finished
```

## Use private functions in patterns

A Pattern can expose an API, either as a jQuery plugin or directly. In order
to keep APIs clean all internal methods used by a pattern must prefix their
name with an underscore.

```
var mypattern = {
    name: "mypattern",

    // Standard pattern API function
    init: function init($el) { },

    // Standard pattern API function
    destory: function() { },

    // Internal method to handle click events
    _onClick: function mypattern_onClick(e) { }
};
```

## Use named functions

Javascript has both named functions and unnamed function.

```
// This is a function named "foo"
function foo() { }

// This is an unnamed function
var foo = function() { };
```

Unnamed functions are convenient, but result in unreadable call stacks and
profiles. This makes debugging and profiling code unnecessarily hard. To fix
this always use named functions for non-trivial functions.

```
$el.on("click", function button_click(event) {
    ...
});
```

The only exception to this rule are trivial functions that do not call any
other functions, such as functions passed to Array.filter or Array.forEach.

Pattern methods must always be named, and the name should be prefixed with the
Pattern with the pattern name to make them easy to recognize.

```
var mypattern = {
    name: "mypattern",

    init: function mypattern_init($el) { },
    _onClick: function mypattern_onClick(e) { }
};
```

## Custom events

A pattern can send custom events for either internal purposes, or as a hook for
third party javascript. Since IE8 is still supported use
[CustomEvent](http://dochub.io/#dom/customevent) can not be used. Instead you must
send custom events using [jQuery's trigger
function](http://api.jquery.com/trigger/). Event names must follow the
`pat-<pattern name>-<event name>` pattern.

```
$(el).trigger("pat-tooltip-open");
```

The element must be dispatched from the element that caused something to
happen, *not* from the elements that are changed as a result of an action.

All extra data must be passed via a single object. In a future Patterns release
this will be moved to the `detail` property of a CustomEvent instance.

```
$(el).trigger("pat-toggle-toggled", {value: new_value});
```

Event listeners can access the provided data as an extra parameter passed to
the event handler.

```
function onToggled(event, detail) {
}
$(".myclass").on("pat-toggle-toggled", onToggled);
```

## Event listeners

All event listeners registered using [jQuery.fn.on](http://api.jquery.com/on/)
must be namespaced with `pat-<pattern name>`.

```
function mypattern_init($el) {
    $el.on("click.pat-mypattern", mypattern._onClick);
}
```

## Storing arbitrary data

When using [jQuery.fn.data](http://api.jquery.com/data/) the storage key
must either be `pat-<pattern name>` if a single value is stored, or
`pat-<pattern name>-<name>` if multiple values are stored. This prevents
conflicts with other code.

```
// Store parsed options
$(el).data("pat-mypattern", options);
```
