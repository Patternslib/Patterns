## Description

The equaliser pattern makes sure elements in a row have the same height.

## Documentation

A common layout problem is creating a group of columns that are visually
outlined to be of equal height, regardless the content in the columns. In CSS
this is often difficult to achieve. The equaliser pattern makes this easy:
if you set the `pat-equaliser` class on an element it will make sure all
the direct children of that element will get the same height.

    <div class="row pat-equaliser">
        <div class="six columns">
            <div class="panel">
                <p>
                    Sed ut perspiciatis‥
                </p>
            </div>
        </div>
        <div class="six columns">
            <div class="panel">
                <p>
                    Minimal content
                </p>
            </div>
        </div>
    </div>

The pattern will remove any existing inline `height` styles for the direct
children of the container when measuring their height.

After resizing the pattern will add an `equalised` class to all direct
children of the container.

    <div class="row pat-equaliser">
        <div class="six columns equalised">
             ‥
        </div>
        <div class="six columns equalised">
             ‥
        </div>
    </div>

### Animating height changes

You can animate height using the `transition` property for the pattern using
an `data-pat-equaliser` attribute.

    <div class="row pat-equaliser" data-pat-equaliser="transition: grow">
        <div class="six columns">
             ‥
        </div>
        <div class="six columns">
             ‥
        </div>
    </div>

The `equalised` class will be set on an element after the animation has
completed.

## Option reference

This pattern has no configurable properties.

| Property          | Default value | Values        | Description                                                                                                                                                |
| ----------------- | ------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transition`      | `none`        | `none` `grow` | Transition effect to use when resizing. the action is `show`.                                                                                              |
| `effect-duration` | `fast`        |               | Duration of transition. This is ignored if the transition is `none`.                                                                                       |
| `effect-easing`   | `swing`       |               | Easing to use for the transition. This must be a known jQuery easing method. jQuery includes `swing` and `linear`, but more can be included via jQuery UI. |
