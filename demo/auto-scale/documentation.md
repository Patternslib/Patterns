# Documentation

The script scales an element with the .pat-auto-scale class by the ratio
of its parent width and its own. If the pattern is applied to the body,
the element is scaled with respect to the viewport's width. The scaling
factor is automatically updated on window resize.

    <div class="column">
      <img class="pat-auto-scale" src="header.png" alt=""/>
      <p>Lorem ipsum</p>
    </div>

The scaling method defaults to the [scale
transform](http://www.w3.org/TR/css3-2d-transforms/#two-d-transform-functions)
on most browsers. For IE versions older than 10
[zoom](http://msdn.microsoft.com/en-us/library/ms531189(VS.85).aspx) is
used instead.

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

Patterns will check if the browser supports the requested method: on
firefox zoom is not supported ([mozilla bug
\#390936](https://bugzilla.mozilla.org/show_bug.cgi?id=390936)), and IE
versions before 10 do not support the scale transform.

Option reference
----------------

The depends can be configured through a `data-pat-auto-scale` attribute.
The available options are:

| Field    | default | Description                                         |
| ---------|---------|-----------------------------------------------------|
| `method` | `scale` | The scaling method to use. One of `scale` or `zoom` |

