## Description

The auto-scale pattern scales up any element to the size of its parent element.
A typical use case is to let an entire webpage scale up to the width of the browser window, as an advanced kind of responsive design.

## Documentation

This pattern scales any element with the `.pat-auto-scale` CSS class by the ratio
of its parent width and its own. If this pattern is applied to the `<body>` tag,
then the element is scaled with respect to the viewport's width.

The scaling factor is automatically updated on window resize.

Let's look at a simple example:

    <div class="column">
      <img class="pat-auto-scale" src="header.png" alt=""/>
      <p>Lorem ipsum</p>
    </div>

After `<img>` element has been scaled, a new `scaled` CSS class is added to it.

    <div class="column">
      <img class="pat-auto-scale scaled" src="header.png" alt="" style="transform: scale(2.1);"/>
      <p>Lorem ipsum</p>
    </div>

The default scaling method can be changed with the `method` property, which is
set with the `data-pat-auto-scale` HTML5 attribute.

The default setting for the `method` property is `scale`, which means that the element will be
scaled by means of a [scale transform](http://www.w3.org/TR/css3-2d-transforms/#two-d-transform-functions).

Alternatively, you can set the method to `zoom`, which means that the [zoom](<http://msdn.microsoft.com/en-us/library/ms531189(VS.85).aspx>)
CSS property will be used for scaling.

Here is an example where the scale method is set to `zoom`.

    <div class="column">
      <img class="pat-auto-scale" data-pat-auto-scale="method: zoom" src="header.png" alt=""/>
      <p>Lorem ipsum</p>
    </div>

### Browser support

Patterns will check if the browser supports the requested method; if the requested
method is known to not be supported then another method will be used. The current overrides
are:

- Firefox zoom does not support zoom ([mozilla bug
  \#390936](https://bugzilla.mozilla.org/show_bug.cgi?id=390936)) so the scale
  transform is always used.
- IE versions before 9 do not support the scale transform, so zoom is always
  used.

### Option reference

The depends can be configured through a `data-pat-auto-scale` attribute.
The available options are:

| Property     |  Default value | Available values                   | Description                                         | Type               |
| :----------- | :------------- | :--------------------------------- | :-------------------------------------------------- | :----------------- |
| `method`     | `scale`        | `scale` `zoom`                     | The scaling method to use. One of `scale` or `zoom` | Mutually exclusive |
| `size`       | `width`        | `width` `height` `contain` `cover` | How to calculate the scaling factor.                | Mutually exclusive |
| `min-width`  |                |                                    | The minimum width in pixels to scale to.            | Number             |
| `max-width`  |                |                                    | The maximum width in pixels to scale to.            | Number             |
| `min-height` |                |                                    | The minimum height in pixels to scale to.           | Number             |
| `max-height` |                |                                    | The maximum height in pixels to scale to.           | Number             |
