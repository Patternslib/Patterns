## Description

The _fullscreen_ pattern allows you to display any element in fullscreen-mode.

## Documentation

When an element with the `pat-fullscreen` class is clicked another element is set to fullscreen.
There is also a second pattern `pat-fullscreen-close` which is triggered on the `close-fullscreen` CSS class.
It triggers a close fullscreen when clicking.
This is done as a seperate pattern so that HTML structures injected with `pat-inject` are initialized and working correctly.

The element sent to fullscreen is defined so:

1. If there is a `data-pat-fullscreen` with a selector option, that one is used.
2. if the pat-fullscreen element is an anchor link, it's href attribute is used to point to an element with the id specified in the href attribute.
3. Otherwise, the body is sent to fullscreen.

You can add a close button by setting the `close-button` option to `show`.

Anyways, any `.close-fullscreen` element within the fullscreen element itself will be used to close the fullscreen.

See examples below.

### Examples

Fullscreen via anchor-element:

    <div id="fs1">
        <a class="pat-fullscreen" href="#fs1">Open in fullscreen</a>
    </div>

Configuration via data attributes:

    <div class=".fs2">
        <button class="pat-fullscreen" data-pat-fullscreen="selector:.fs2;close-button:show">Open fullscreen</button>
    </div>

Custom close buttons:

    <div class=".fs3">
        <button class="pat-fullscreen" data-pat-fullscreen="selector:.fs2">Open fullscreen</button>
        <button class="close-fullscreen">Close Fullscreen</button>
    </div>

Open the `body` element in fullscreen without giving any options.

    <button class="pat-fullscreen">Open in fullscreen</button>

### Option reference

The fullscreen pattern can be configured through a `data-pat-fullscreen` attribute.
The available options are:

| Field          | Default | Options        | Description                                                                                        |
| -------------- | ------- | -------------- | -------------------------------------------------------------------------------------------------- |
| `selector`     | `null`  | A CSS selector | The target element which should be shown in fullscreen. If not given, open the body in fullscreen. |
| `close-button` | `none`  | `none`, `show` | `show` if a exit button should be shown when entering fullscreen mode.                             |
