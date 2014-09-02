# Auto scale

## Description
Auto scale scales up any element to the size of it''s parent element. A typical use case is to let an entire webpage scale up to the width of the browser window, as an advanced kind of responsive design.

## Documentation

The script scales an element with the .pat-auto-scale class by the ratio
of its parent width and its own. If the pattern is applied to the body,
the element is scaled with respect to the viewport''s width. The scaling
factor is automatically updated on window resize.

    <div class="column">
      <img class="pat-auto-scale" src="header.png" alt=""/>
      <p>Lorem ipsum</p>
    </div>


After an element has been scaled a new scaled class is be added.

    <div class="column">
      <img class="pat-auto-scale scaled" src="header.png" alt="" style="transform: scale(2.1);"/>
      <p>Lorem ipsum</p>
    </div>

The default scaling method can be changed via an `data-pat-auto-scale`
attribute.

    <div class="column">
      <img class="pat-auto-scale" data-pat-auto-scale="method: zoom" src="header.png" alt=""/>
      <p>Lorem ipsum</p>
    </div>

The available methods are:

* `scale`: Use a [scale transform](http://www.w3.org/TR/css3-2d-transforms/#two-d-transform-functions). (default)
* `[zoom](http://msdn.microsoft.com/en-us/library/ms531189(VS.85).aspx)1

### Browser support

Patterns will check if the browser supports the requested method; if the requested
method is known to be broken another method will be used. The current overrides
are:

* Firefox zoom does not not support zoom ([mozilla bug
  \#390936](https://bugzilla.mozilla.org/show_bug.cgi?id=390936)) so the scale
  transform is always used.
* IE versions before 9 do not support the scale transform, so zoom is always
  used.

### Properties

The depends can be configured through a `data-pat-auto-scale` attribute.
The available options are:

| Property | Default value | Values | Description | Type |
| -------- | ------------- | ------ | ----------- | ---- |
| `method` | `scale` | `scale` `zoom` | The scaling method to use. One of `scale` or `zoom` | Mutually exclusive |
| `min-width` | *unset* | | The minimum width in pixels to scale to. | Number |
| `max-width` | *unset* | | The maximum width in pixels to scale to. | Number |

