## Description

Toggle allows for toggling between 2 different attribute values. For instance to show or hide a sidebar with a CSS class on the body tag.

## Documentation

The _toggle_ pattern can be used to toggle attribute values for objects.
It is most commonly used to toggle a CSS class.

    <a href="#" class="pat-toggle" data-pat-toggle="selector: #work; attr: class; value: active">Start working</a>
    <div id="work">
      Working…
    </div>

If a user clicks on the _Start working_ link the `active` class is added
to the div. If the link is clicked again the `active` class is removed
again. You can also use shorthand notation for this pattern:

    <a href="#" class="pat-toggle" data-pat-toggle="#work class active">Start working</a>
    <div id="work">
      Working…
    </div>

The default attribute is _class_, so you do not need to specify that manually.

When updating attributes the value is set if the attribute does not
exist or has a different value, or removed if the attribute already has
the provided value. This can be used to check the selected state of a
checkbox:

    <input type="checkbox" id="toCheck" />
    <button class="pat-toggle" data-pat-toggle="#toCheck checked checked">toggle checkbox</button>

If you are manipulating the `class` attribute you can specify multiple
classes separated by spaces to toggle multiple classes.

    <a href="#" data-pat-toggle="selector: #work; value: active inactive">Start working</a>
    </a>
    <div id="work" class="inactive">
      Working..
    </div>

On the first click the `inactive` class will be removed and `active`
will be added. On the next click `active` will be removed again and
`active` restored. All listed classes will be toggled at the same time.

### Remembering the state

Sometimes you need to remember the toggle state of an element. For
example when you use a toggle to hide or show a sidebar you do not want
the sidebar to reappear on every page (re)load. This can be done by
telling the toggle pattern to store the state of an element using the
`store` parameter.

    <button id="sidebar-toggle" class="pat-toggle"
        data-pat-toggle="selector: #sidebar; value; visible; store: local">Show sidebar</button>

To use this you requirements must be met:

1.  the element must have an `id`
2.  The browser must support [Web
    Storage](http://www.w3.org/TR/webstorage/)

The possible values for the `store` parameter are:

- `none`: do not remember the toggle state (default).
- `local`: remember the state as part of the local storage.
- `session`: remember the status as part of the session storage.
