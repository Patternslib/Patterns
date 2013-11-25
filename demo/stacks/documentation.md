# Stacks

## Description
A simple pattern that allows for quickly changing out chunks of content on a page, typically styled as tabs.

## Documentation
The stacks pattern provides a way to group a number of *sheets*, only one of which is vissible at a point
in time. A common version of this pattern are tabs.

The markup structure looks like this:

    <nav>
        <a href="#sheet-1">One</a> | <a href="#sheet-2">Two</a>
    </nav>
    <article class="pat-stacks">
        <section id="sheet-1">...</section>
        <section id="sheet-2">...</section>
    </article>

The `pat-stacks` class is set on a grouping element, and its direct children
are treated as sheets. By default the stacks pattern will show its first direct
child and hide all other children. However if the URL fragment points to
another child that child will be shown instead. The currently visible sheet
will get a class of `visible`, all other sheets will get an `hidden` class.

Note that a leave must have an id so it can be selected.  Elements without an
id are ignored.

Any anchor in the document that point to one a sheet can be used to switch the
stack to that sheet. The default action for the anchor will be blocked, but
other events/patterns tied to the anchor will still work. The anchor of the
currently visible sheet automatically receives a class `current`. 

The above example will look like this in the DOM after initialisation:

    <nav>
        <a class="current" href="#sheet-1">One</a> | <a href="#sheet-2">Two</a>
    </nav>
    <article class="pat-stacks">
        <section id="sheet-1" class="visible">...</section>
        <section id="sheet-2" class="hidden">...</section>
        <section id="sheet-3" class="hidden">...</section>
    </article>

### Option reference

The Stacks pattern may be configured through a `data-pat-stacks` attribute. The available options are:

| Field | Default | Description |
| ----- | ------- | ----------- | 
| `selector` | `> *` | CSS selector used to find all sheets in a stack. |
| `transition` | `none` | Transition effect to use. Must be one of `none`, `css`, `fade` or `slide`. |
| `effect-duration` | `fast` | Duration of transition. This is ignored if the transition is `none` or `css`. 
