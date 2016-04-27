# The Patternslib coding style guide

*NOTE: Patternslib doesn't yet use any of the new [ES2015](https://babeljs.io/docs/learn-es2015/) features.*

Many of the style guide recommendations here come from Douglas Crockford's
seminal book [Javascript, the good parts](http://shop.oreilly.com/product/9780596517748.do).

Please stick to these guidelines when contributing to Patternslib code.:

## Please run the style checks before making a commit or pull request.

Before making a pull request, please make sure to run the tests.

The simplest way to do this is use the `check` make target.

```
    $ make check

    Finished
    -----------------
    470 specs, 0 failures in 2.355s.

    ConsoleReporter finished
```

This will run [JSHint](http://jshint.com/) to make sure your
code matches our style guide, additionally it runs the
[Jasmine](http://jasmine.github.io/) tests.


## Indentation

We indent 4 spaces. Proper indentation is very important for readability.
Please don't use tabs.

## Naming of variables, classes and functions

### Underscores or camelCase?

We use `camelCase` for function names and `underscores_names` for variables names.

For example:

    function thisIsAFunction () {
        var this_is_a_variable;
        ...
    }

### jQuery objects are prefixed with $

We prefix jQuery objects with the $ sign, to distinguish them from normal DOM
elements.

For example:

    var divs = document.getElementsByTagName('div'); // List of DOM elements
    var $divs = $('div'); // jQuery object


## Spaces around operators

In general, spaces are put around operators, such as the equals `=` or plus `+` signs.

For example:

    if (sublocale != locale) {
        // do something
    }

An exception is when they appear inside for-loop expressions, for example:

    for (i=0; i<msgs_length; i++) {
        // do something
    }

Generally though, rather err on the side of adding spaces, since they make the code much more readable.

## Constants are written in ALL_CAPS

Identifiers that denote constant values should be written in all capital letters, with underscores between words.

For example:

    var SECONDS_IN_HOUR = 3600; // constant
    var seconds_since_click = 0; // variable

## Function declaration and invocation

In his book, *Javascript, the good parts*, Douglas Crockford suggests that
function names and the brackets that come afterwards should be separated with a space,
to indicate that it's a declaration and not a function call or instantiation.

    function update (model) { // function declaration
        model.foo = 'bar';
    }

    update(model); // function call

This practice however doesn't appear to be very common and is also not used
consistently throughout the Patternslib codebase. It might be useful sometimes however,
to reduce confusion.

## Checking for equality

Javascript has a strict `===` and less strict `==` equality operator. The
stricter operator also does type checking. To avoid subtle bugs when doing comparisons,
always use the strict equality check.

## Curly brackets

Curly brackets must appear on the same lines as the `if` and `else` keywords.
The closing curly bracket appears on its own line.

For example:

    if (locale]) {
        return locales[locale];
    } else {
        sublocale = locale.split("-")[0];
        if (sublocale != locale && locales[sublocale]) {
            return locales[sublocale];
        }
    }

## Always enclose blocks in curly brackets

When writing an a block such as an `if` or `while` statement, always use
curly brackets around that block of code. Even when not strictly required by
the compiler (for example if its only one line inside the `if` statement).

For example, like this:

    if (condition === true) {
        this.updateRoomsList();
    }
    somethingElse();

and **NOT** like this:

    if (condition === true)
        this.updateRoomsList();
    somethingElse();

This is to aid in readability and to avoid subtle bugs where certain lines are
wrongly assumed to be executed within a block.

## Bind the "this" variable instead of assigning to "self"

One of the deficiencies in Javascript is that callback functions are not bound
to the correct or expected context (as referenced with the `this` variable). In
[ES2015](https://babeljs.io/docs/learn-es2015/), this problem is solved
by using so-called arrow functions for callbacks.

However, while we're still writing ES5 code, please use the `.bind` method to
bind the correct `this` context to the callback method.

For example:

    this.$el = $("#some-element");
    setTimeout(function () {
        // Without using .bind, "this" will refer to the window object.
        this.$el.hide();
    }.bind(this), 1000);

### What about assigning the outer "this" to "self"?

A different way of solving the above problem is to assign the outer `this`
variable to `self` and then using `self` in the callback.

For example:

    var self = this;
    self.$el = $("#some-element");
    setTimeout(function () {
        self.$el.hide();
    }, 1000);

This approach is generally discouraged in Patternslib because it results in
much longer functions due to the fact that callback functions can't be moved
out of the containing function where `self` is defined.

Additionally, `self` is by default an alias for `window`. If you forget to use
`var self`, there's the potential for bugs that can be difficult to track down.

Douglas Crockford and others suggest that the variable `that` be used instead,
which is also the convention we follow in Patternslib.

For example:

    var that = this;
    that.$el = $("#some-element");
    setTimeout(function () {
        that.$el.hide();
    }, 1000);

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
    destroy: function() { },

    // Internal method to handle click events
    _onClick: function mypattern_onClick(e) { }
};
```

## Use named functions

Javascript has both named functions and unnamed functions.

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
$el.on("click", function buttonClick(event) {
    ...
});
```

An exception to this rule are trivial functions that do not call any
other functions, such as functions passed to Array.filter or Array.forEach.

Pattern methods must always be named, and the name should be prefixed 
with the pattern name to make them easy to recognize.

    var mypattern = {
        name: "mypattern",

        init: function mypatternInit($el) { },
        _onClick: function mypatternOnClick(e) { }
    };

## Custom events

A pattern can send custom events for either internal purposes, or as a hook for
third party javascript. Since IE8 is still supported 
[CustomEvent](http://dochub.io/#dom/customevent) can not be used. Instead you must
send custom events using [jQuery's trigger
function](http://api.jquery.com/trigger/). Event names must follow the
`pat-<pattern name>-<event name>` pattern.

    $(el).trigger("pat-tooltip-open");

The element must be dispatched from the element that caused something to
happen, *not* from the elements that are changed as a result of an action.

All extra data must be passed via a single object. In a future Patterns release
this will be moved to the `detail` property of a CustomEvent instance.

    $(el).trigger("pat-toggle-toggled", {value: new_value});

Event listeners can access the provided data as an extra parameter passed to
the event handler.

    function onToggled(event, detail) {
    }
    $(".myclass").on("pat-toggle-toggled", onToggled);

## Event listeners

All event listeners registered using [jQuery.fn.on](http://api.jquery.com/on/)
must be namespaced with `pat-<pattern name>`.

    function mypattern_init($el) {
        $el.on("click.pat-mypattern", mypattern._onClick);
    }

## Storing arbitrary data

When using [jQuery.fn.data](http://api.jquery.com/data/) the storage key
must either be `pat-<pattern name>` if a single value is stored, or
`pat-<pattern name>-<name>` if multiple values are stored. This prevents
conflicts with other code.

    // Store parsed options
    $(el).data("pat-mypattern", options);
