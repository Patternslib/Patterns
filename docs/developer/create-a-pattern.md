# How to create a new pattern

This document provides a quick tutorial on how to create a new Patternslib pattern.
Patterns are implemented as javascript objects that are registered with the Patternslib library.

## Creating a colorchanger pattern

In this tutorial we will create a new pattern called pat-colorchanger.
This pattern changes the text-color of an element after waiting for 3 seconds.

### Creating the pattern directory

To start off, lets create a new directory in which we will put our pattern's
files, and then lets navigate into it.

```
mkdir pat-colorchanger
cd pat-colorchanger
```

### Using the Yeoman generator

Instead of manually typing out the code shown in this tutorial, you can simply
use the [Yeoman Patternslib generator](https://www.npmjs.com/package/generator-patternslib) to generate the appropriate skeleton for you.

If [Yeoman](http://yeoman.io/) is not installed, you can get it via npm:

    sudo npm install -g yo

Then, simply run the following commands inside the `pat-colorchanger`
directory you created in the previous section.

    sudo npm install -g generator-patternslib
    yo patternslib pat-colorchanger

In our example we are creating for demonstration purposes the pattern
pat-colorchanger, but you will of course choose a more appropriate
name for your own pattern.

### The directory layout

Each pattern should have a certain layout. Look for example at [pat-pickadate](https://github.com/Patternslib/pat-pickadate).
There is one subdirectory, called *src*, inside the *pat-pickadate* repository.
It contains the pattern's actual Javascript source file(s).

The Yeoman generator will create the correct layout and all the necessary
files.

However, if you are doing this manually instead of using Yeoman, then create this directory as well as the files required:

    touch README.md index.html src/pat-colorchanger.js


## Determining the HTML markup for the pattern

Patterns are configured via a declarative HTML syntax.

Usually a particular pattern is invoked by specifying its name as a HTML class on a DOM object.
The invoked pattern then acts upon that specifc DOM element. In our example case, the pattern
changes the text color after 3 seconds. This color change is applied to the DOM
element on which the pattern is declared.

The pattern can be configured by specifying HTML5 data attributes, which start with the
`data-` prefix, followed by the pattern's name.

So in our case, that is `data-pat-colorchanger`.

For example:

    <p class="pat-colorchanger" data-pat-colorchanger="color: blue" style="color: red">
        This text will turn from red into blue after 3 seconds.
    </p>

The HTML markup as shown above, which illustrates how your pattern functions, should be put
inside the `index.html` file. This file can then be used by designers and integrators
to demo the pattern's functionality.

When you are designing your pattern, you need to decide on a relevant name for it,
and how it should be configured.

For a reference of all the ways a pattern could be configured, please read the
[Parameters](../parameter-syntax/#main-content) page.

## Writing the pattern's javascript

We are now ready to start writing the Javascript for our pattern.

Put this code into `./src/pat-colorchanger.js`

```
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // Make this module AMD (Asynchronous Module Definition) compatible,
        // so that it can be used with Require.js or other module loaders.
        define([
            "pat-registry",
            "pat-parser",
            "pat-base"
            ], function() {
                return factory.apply(this, arguments);
            });
    } else {
        // A module loader is not available. In this case, we need the
        // patterns library to be available as a global variable "patterns"
        factory(root.patterns, root.patterns.Parser, root.patterns.Base);
    }
}(this, function(registry, Parser, Base) {
    // This is the actual module and in here we put the code for the pattern.

    // Tell the interpreter to execute in "strict" mode.
    // For more info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
    "use strict"; 

    /* We instantiate a new Parser instance, which will parse HTML markup
     * looking for configuration settings for this pattern.
     *
     * This example pattern's name is pat-colorchanger. It is activated on a DOM
     * element by giving the element the HTML class "pat-colorchanger".
     *
     * The pattern can be configured by specifying an HTML5 data attribute
     * "data-pat-colorchanger" which contains the configuration parameters
     * Only configuration parameters specified here are valid.
     *
     * For example:
     *      <p class="pat-colorchanger" data-pat-colorchanger="color: blue">Hello World</p>
     */
    var parser = new Parser("colorchanger");
    parser.addArgument("color", "red"); // A configuration parameter and its default value.

    // We now create and return our custom pattern.
    // We extend the Base pattern so our custom pattern will be automatically registered.
    return Base.extend({
        name: "colorchanger",
        // Most patterns deal with markup: they are activated for content that matches
        // a specific CSS selector. This is handled by adding two items to the
        // pattern specification: a trigger attribute and an init function.
        trigger: ".pat-colorchanger", // The CSS selector that triggers this pattern

        // Patterns can also act as jQuery plugins.
        // An example of calling the plugin: $("div").patColorchanger()
        jquery_plugin: true,

        init: function patExampleInit($el, opts) {
            // $el is the DOM element on which the pattern is declared.
            // It gets passed in to init, but is also available on the
            // pattern itself, just call this.$el.
            var options = parser.parse($el, opts);  // Parse the DOM element to retrieve the
                                                    // configuration settings.
            setTimeout($.proxy(function () {
                this.setColor($el, options);
            }, this), 3000);
        },

        setColor: function patExampleSetColor($el, options) {
            $el.css("color", options.color);
        }
    });
}));
```

This pattern can be loaded directly in your browser after a standard Patterns bundle has been loaded.

```
<html>
  <body>
    <script src="patterns-2.0.0.js"></script>
    <script src="/src/pat-colorchanger.js"></script> 
  </body>
</html>
```

There is a general rule that patterns should only trigger for elements that
have a `pat-<pattern name>` class. This is reflected in the ``trigger`` for our
pattern: it specifies that this pattern applies to any DOM element with the
`pat-colorchanger` class.

When the page loads (and also when content is injected via AJAX) the ``init``
function of our pattern will be called once for each matched DOM element.
