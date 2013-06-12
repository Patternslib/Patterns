# Equaliser

## Description
The equaliser pattern makes sure elements in a row have the same height.

## Documentation

A common layout problem is creating a group of columns that are visually
outlined to be of equal height, regardless the content in the columns. In CSS
this is often difficult to achieve. The equaliser pattern makes this easy:
if you set the ``pat-equaliser`` class on an element it will make sure all
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


The pattern will remove any existing inline ``height`` styles for the direct
children of the container when measuring their height.

After resizing the pattern will add an ``equalised`` class to all direct
children of the container.

    <div class="row pat-equaliser">
        <div class="six columns equalised">
             ‥
        </div>
        <div class="six columns equalised">
             ‥
        </div>
    </div>


### Animating resizes

You can use CSS transitions to animate the resizing. WHen doing this take care
that you must only define the transition for elements with the ``equalised``
class, otherwise the animation will break the size measurements done by the
pattern.

The above example uses this CSS:

    .pat-equaliser .equalised {
        -webkit-transition: height 1s;
        -moz-transition: height 1s;
        transition: height 1s;
    }

### Properties

This pattern has no configurable properties.
