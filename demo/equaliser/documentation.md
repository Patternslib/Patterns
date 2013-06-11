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


### Properties

This pattern has no configurable properties.
