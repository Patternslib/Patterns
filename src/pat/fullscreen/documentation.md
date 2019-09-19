## Description

The *fullscreen* pattern allows you to display any element in fullscreen-mode.

## Documentation

When the ``pat-fullscreen`` link is clicked, the element which the anchor-link refers to in it's ``href`` attribute is sent to fullscreen.
A link with the class ``close-fullscreen`` is added to the element which is sent to fullscreen and removed when exiting fullscreen-mode.

### Examples

Open in fullscreen via an id reference in the href attribute of an anchor tag.
    <div id="fs1">
        <a class="pat-fullscreen" href="#fs1">Open in fullscreen</a>
    </div>

Open in fullscreen via an selector reference in the fullscreen options.
    <div class=".fs2">
        <button class="pat-fullscreen" data-pat-fullscreen="target:.fs2">Open in fullscreen</button>
    </div>

Open the ``body`` element in fullscreen without giving any options.

    <button class="pat-fullscreen">Open in fullscreen</button>

Open in fullscreen without showing the close button.

    <button class="pat-fullscreen" data-pat-fullscreen="closebutton:false">Open in fullscreen</button>


### Option reference

The fullscreen pattern can be configured through a `data-pat-fullscreen` attribute.
The available options are:

| Field | Default | Options | Description |
| ----- | ------- | ----------- | ----------- |
| `target`   | `body` | A CSS selector | The target element which should be shown in fullscreen. If not given, open the body in fullscreen.
| `closebutton` | `true`   | `true`, `false` | `true` if a exit button should be shown when entering fullscreen mode.

