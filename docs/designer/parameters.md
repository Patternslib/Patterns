# The declarative syntax for configuring a pattern

You can change the bevaiour for some patterns by configuring them using ``data-pat-<pattern name>`` attributes in your markup.
These attributes can be written either using the *extended notation* or a *shorthand notation*.

## Extended notation

The simplest notation you can use for parameters is the *extended notation*.
When using this notation you always specify the property name and its value,
separated by a colon.

```
<div class="pat-collapsible" data-pat-toggle="store: session">...</div>
<ul class="pat-carousel" data-pat-carousel="loop: false">...</ul>
```

Multiple properties can be provided by separating them with a semicolon:

```
<ul class="pat-carousel" data-pat-carousel="store: session; loop: false">...</ul>
<div class="pat-carousel" data-pat-carousel="delay: 15: easing: bounce">...</div>
```

## Shorthand notation

The extended syntax can be a bit verbose. In order to keep your markup short
you can also use a simpler short notation. In this notation you specify all
properties using a pre-defined order. For example the toggle pattern takes
three properties: the selector, an attribute and a value. Using shorthand
notation you can specify all three values directly separated by a space. For
example we can rewrite this extended notation:

```
<button class="tag-toggle"
        data-pat-toggle="selector: .myClass; attribute: class; value: active">
    ...
</button>
```

as this simpler version:

```
<button class="tag-toggle" data-pat-toggle=".myClass class active">
    ...
</button>
```

This also reveals a limitation in shorthand notation: a value can not
contain a space. If your value contains whitespace you must use the
extended notation.

Boolean values can be referenced directly by name. For example this extended
notation for the carousel pattern:

```
<ul class="data-carousel" data-pat-carousel="loop: true; expand: true">
    ...
</ul>
```

can be written like this:

```
<ul class="data-carousel" data-pat-carousel="loop expand">
    ...
</ul>
```

If you prefix the name with ``no-`` the property will be set to false. If we
want to use the same carousel as above but without expand we can write this:

```
<ul class="data-carousel" data-pat-carousel="loop no-expand">
    ...
</ul>
```

Enum values can also be used directly. For example the toggle pattern has a
``store`` property which can the take three values ``none``, ``local`` and
``session``. You can mention those directly:


```
<button class="pat-toggle" data-pat-toggle=":input.myClass checked session">
    ...
</button>
```

In very rare situations it might happen that a known boolean property
has the exact same name as an enum value for another property. In that case it
will be treated as a boolean option.

## Cascading configuration

Sometimes you want to have several items with a similar configuration. To
support this you can set parameters on the parent element so you do not
need to repeat them everywhere.

```
<nav data-pat-inject="source: #main; target: #content">
     <a class="pat-inject" href="status.html">Status</a>
     <a class="pat-inject" href="blog.html">Blog</a>
     <a class="pat-inject" href="about.html">About</a>
</nav>

<section id="content">
     ...
</section>
```

The above example uses this mechanism to indicate that all ``#main`` is to
be extracted and placed into ``#content`` for all links.


## Multiple values

Some parameters take a list of values instead of a single value. An example is
the tooltip pattern where you can specify multiple locations where the tooltip
should be positioned. In these cases you specify multiple values by separating
them with a comma.

```
<a class="tooltip" data-pat-tooltip="position: tl,tm,tr" title="Tooltip content">
    ...
</a>
```

## Option groups

Sometimes a pattern has multiple related options. For example the navigation
pattern has a set of flags which determine how navigation controls should be
handled. This can already be done by specifying each option separately:

```
<div data-pat-navigation="control-startstop: true; control-nav: true">...</div>
```

but the option group syntax allows you to use a simpler notation:

```
<div data-pat-navigation="control: startstop nav">...</div>
```

This grouping is supported for all parameters that have the same *prefix*: a group
name followed by a dash (``-``).

Please note that this is still a grouping of options, which means that options
set at a higher level are inherited. For example with this markup:

```
<div data-pat-navigation="control: startstop">
    <div data-pav-navigation="control: nav">
      ...
    </div>
</div>
```

at the inner ``div`` both *startstop* and *nav* would be enabled. If you do not want
that you need to explicitly unset the *startstop*:

```
<div data-pat-navigation="control: startstop">
    <div data-pav-navigation="control: no-startstop nav">
        ...
    </div>
</div>
```

## Multiple parameters

Some patterns (for example toggle) accept multiple parameters. This can be
done by separating them with ``&&``.

```
<button class="pat-toggle" data-pat-toggle="myClass class active && :input.myClass checked">
    Click me to check inputs and add active class.
</button>
```
