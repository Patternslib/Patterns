Creating a pattern in two minutes
=================================

Patterns are implemented as javascript objects that are registered with the
patterns library. This is a minimal skeleton for a pattern:

```javascript
var mypattern = {
    name: "mypattern"
};

window.patterns.register(mypattern);
```

This code does several number of things:

* It creates the ``mypattern`` javascript object which contains the
  implementation of the pattern.
* It registers the pattern with the Patterns framework.

This pattern can be loaded directly in your browser after a standard Patterns
bundle has been loaded.

```html
<html>
  <body>
    ...
    <script src="patterns-2.0.0.js"></script>
    <script src="mypattern.js"></script>
  </body>
</html>
```


Handling DOM elements
----------------------

The minimal pattern shown before works, but does not actually do anything. Lets
extend it to add a CSS class to headers in your document. To do this we need
to do two things: 1) specify which DOM elements our pattern wants to handle, and
2) add an ``init`` function which will update the DOM.

```javascript
var mypattern = {
    name: "mypattern",
    trigger: "h1.pat-mypattern,h2.pat-mypattern,h3.pat-mypattern",

    init: function mypattern_init($el) {
        $el.addClass("i-am-a-header");
    }
};
window.patterns.register(mypattern);
```

There is a general rule that patterns should only trigger for elements that
have a ``pat-<pattern name>`` class. This is reflected in the ``trigger`` for our
pattern: it specifies that this pattern wants to handle all ``h1``, ``h2`` and
``h3`` elements that have a ``pat-mypattern`` class. On initial page load and
for all content that is added via AJAX Patterns will call our ``init`` function
with all matching elements.

The ``init`` function will be called with a jQuery object containing relevant
elements. Our version is very simple: it just adds the ``i-am-a-header`` class.
