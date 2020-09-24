## Description

This is an example pattern to show how a minimal pattern ist done.

## Documentation

When clicking on the element, the background is changed to the color specified in the options.

### Examples

Basic usage:

    <div class="pat-minimalpattern">
        hello.
    </div>

Custom color:

    <div class="pat-minimalpattern" data-pat-minimalpattern="background-color: red">
        hello.
    </div>

### Option reference

The fullscreen pattern can be configured through a `data-pat-fullscreen` attribute.
The available options are:

| Field              | Default | Options         | Description                                                          |
| ------------------ | ------- | --------------- | -------------------------------------------------------------------- |
| `background-color` | `green` | CSS color value | This CSS color value is used as the background color of the element. |
