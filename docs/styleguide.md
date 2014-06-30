Patterns code styleguide
========================

Run tests before any commit
---------------------------

Before you make a commit make sure to run all tests. The simplest way to do
this is use the ``check`` make target. This will run jshint to make sure your
code matches our style guide, and it runs all unittests.

```
$ make check
node_modules/.bin/jshint --config jshintrc src/autoinit.js src/patterns.js src/wrap-end.js src/pat/ajax.js src/pat/autofocus.js src/pat/autoscale.js src/pat/autosubmit.js src/pat/autosuggest.js src/pat/breadcrumbs.js src/pat/bumper.js src/pat/carousel.js src/pat/checkedflag.js src/pat/checklist.js src/pat/chosen.js src/pat/collapsible.js src/pat/colour-picker.js src/pat/depends.js src/pat/edit-tinymce.js src/pat/equaliser.js src/pat/expandable.js src/pat/focus.js src/pat/form-state.js src/pat/forward.js src/pat/fullcalendar.js src/pat/gallery.js src/pat/image-crop.js src/pat/inject.js src/pat/legend.js src/pat/markdown.js src/pat/menu.js src/pat/modal.js src/pat/navigation.js src/pat/notification.js src/pat/placeholder.js src/pat/selectbox.js src/pat/slides.js src/pat/slideshow-builder.js src/pat/sortable.js src/pat/stacks.js src/pat/subform.js src/pat/switch.js src/pat/toggle.js src/pat/tooltip.js src/pat/validate.js src/pat/zoom.js src/lib/input-change-events.js
node_modules/.bin/r.js -o test-build.js

Tracing dependencies for: patterns

...

node_modules/.bin/phantomjs node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner.html
2014-04-16 14:11:07.731 phantomjs[9858:507] CoreText performance note: Client called CTFontCreateWithName() using name "Times New Roman" and got font with PostScript name "TimesNewRomanPSMT". For best performance, only use PostScript names when calling this API.
2014-04-16 14:11:07.731 phantomjs[9858:507] CoreText performance note: Set a breakpoint on CTFontLogSuboptimalRequest to debug.
Starting...
patterns.undefined.parser: Ignore extra arguments: buz
patterns.undefined.parser: Unknown named parameter attr
patterns.undefined.parser: Illegal value for value: pink
patterns.undefined.parser: Cannot convert value for value to number
2014-04-16 14:11:07.976 phantomjs[9858:507] CoreText performance note: Client called CTFontCreateWithName() using name "Times New Roman" and got font with PostScript name "TimesNewRomanPSMT". For best performance, only use PostScript names when calling this API.
2014-04-16 14:11:08.060 phantomjs[9858:507] CoreText performance note: Client called CTFontCreateWithName() using name "Times New Roman" and got font with PostScript name "TimesNewRomanPSMT". For best performance, only use PostScript names when calling this API.
patterns.slideshow-builder: Can not find a containing form [object HTMLDivElement]
patterns.slideshow-builder: Could not find any slides in undefined [object Object]
patterns.slideshow-builder: Could not find any slides in undefined [object Object]
patterns.slideshow-builder: No slides with headers found in undefined [object Object]
patterns.pat.switch: Switch pattern requires selector and one of add or remove.
patterns.pat.switch: Switch pattern requires selector and one of add or remove.
patterns.pat.switch: Switch pattern requires selector and one of add or remove.

Finished
-----------------
364 specs, 0 failures in 0.338s.

ConsoleReporter finished
```


Use private functions in patterns
---------------------------------

A Pattern can expose an API, either as a jQuery plugin or directly. In order
to keep APIs clean all internal methods used by a pattern must prefix their
name with an underscore.

```javascript
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

Use named functions
-------------------

Javascript has both named functions and unnamed function.

```javascript
// This is a function named "foo"
function foo() { }

// This is an unnamed function
var foo = function() { };
```

Unnamed functions are convenient, but result in unreadable call stacks and
profiles. This makes debugging and profiling code unnecessarily hard. To fix
this always use named functions for non-trivial functions.

```javascript
$el.on("click", function button_click(event) {
    ...
});
```

The only exception to this rule are trivial functions that do not call any
other functions, such as functions passed to Array.filter or Array.forEach.

Pattern methods must always be named, and the name should be prefixed with the
Pattern with the pattern name to make them easy to recognize.

```javascript

var mypattern = {
    name: "mypattern",

    init: function mypattern_init($el) { },
    _onClick: function mypattern_onClick(e) { }
};
```


Custom events
-------------

A pattern can send custom events for either internal purposes, or as a hook for
third party javascript. Since IE8 is still supported use
[CustomEvent](http://dochub.io/#dom/customevent) can not be used. Instead you must
send custom events using [jQuery's trigger
function](http://api.jquery.com/trigger/). Event names must follow the
`pat-<pattern name>-<event name>` pattern.

```javascript
$(el).trigger("pat-tooltip-open");
```

The element must be dispatched from the element that caused something to
happen, *not* from the elements that are changed as a result of an action.

All extra data must be passed via a single object. In a future Patterns release
this will be moved to the `detail` property of a CustomEvent instance.

```javascript
$(el).trigger("pat-toggle-toggled", {value: new_value});
```

Event listeners can access the provided data as an extra parameter passed to
the event handler.

```javascript
function onToggled(event, detail) {
}

$(".myclass").on("pat-toggle-toggled", onToggled);
```



Events listeners
----------------

All event listeners registered using [jQuery.fn.on](http://api.jquery.com/on/)
must be namespaced with `pat-<pattern name>`.

```javascript
function mypattern_init($el) {
    $el.on("click.pat-mypattern", mypattern._onClick);
}
```


Storing arbitrary data
----------------------

When using [jQuery.fn.data](http://api.jquery.com/data/) the storage key
must either be `pat-<pattern name>` if a single value is stored, or
`pat-<pattern name>-<name>` if multiple values are stored. This prevents
conflicts with other code.

```javascript
// Store parsed options
$(el).data("pat-mypattern", options);
```
