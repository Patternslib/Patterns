## Description

This pattern allows you to easily add tooltips with a variety of behaviours to your website.

## Documentation

Tooltips are intended to display contextual information and function about the trigger element.

### Markup structure

    <label>Website address
      <a href="#" title="Please enter the full URL for the website"
          class="pat-tooltip">More information</a>
    </label>

### Display

Tooltips are shown when clicking on the triggering element.

The trigger can be changed to require the mouse to hover over the triggering element,
and to be hidden when the mouse leaves the triggering element
by adding a `hover` option.

    <a href="#" title="Please enter the full URL for the website"
       class="pat-tooltip" data-pat-tooltip="hover">More information</a>

### Positioning

Tooltips will be positioned close to the element that triggered them,
with an arrow tip pointing to the centre of the triggering item. The
placement of the tip on the tooltip determines the positioning of the
tooltip. For example if the tip is placed at the right side of the
tooltip, it naturally follows that the tooltip itself will be placed to
the left of the triggering element.

The position of the tip within the tooltip can be specified with a
_position_ property which specifies the preferred positions. This is
formatted as `<preference>[,preference]*`. The possible preferences are:

- `tl`: tip placed at the leftmost corner of the top side of the tooltip
- `tm`: tip placed at the middle of the top side of the tooltip
- `tr`: tip placed at the rightmost corner of the top side of the tooltip
- `rt`: tip placed at the top corner of the right side of the tooltip
- `rm`: tip placed at the middle of the right side of the tooltip
- `rb`: tip placed at the bottom corner of the right side of the tooltip
- `bl`: tip placed at the leftmost corner of the bottom side of the tooltip
- `bm`: tip placed at the middle of the bottom side of the tooltip
- `br`: tip placed at the rightmost corner of the bottom side of the tooltip
- `lt`: tip placed at the top corner of the left side of the tooltip
- `lm`: tip placed at the middle of the left side of the tooltip
- `lb`: tip placed at the bottom corner of the left side of the tooltip

An example:

    <a href="#tip" class="pat-tooltip" data-pat-tooltip="position: lt,lm,rt,rm">
     …
    </a>

This specifies that the preferred position of the tip is at the top left
side of the tooltip (placing the tooltip itself on the right side of the
link). Notice that the position is the first defined property so you can use
shorthand syntax directly. If the tooltip does not fit at that position
then the left-middle position is tried, and then the right-top or if all
previous options failed the middle of the right side is tried. If the tooltip
does not fit at any of the preferred positions, then it will be
positioned at the location that has the most space, even if this is not
one of the preferred positions.

It is possible to force a specific tooltip position by adding the
`force` flag.

    <a href="#" title="Please enter the full URL for the website"
       class="pat-tooltip" data-pat-tooltip="position: lt force">
     …
    </a>

### Sticky tooltips

By default, the tooltip disappears when the cursor is moved off the element or
the triggering element is clicked. If this is not desired behaviour, there is
the option to change the closing behaviour to `sticky` or to `close-button`.

With `sticky`, the tooltip will remain until the user clicks outside of the
tooltip, or on mobile, if the user clicks on the close button.

With the `close-button` option, the tooltip will only be closed if the close
button is clicked.

For example, setting closing to `sticky`:

    <a href="#" class="pat-tooltip" data-pat-tooltip="closing: sticky">
     …
    </a>

### AJAX tooltips

The tooltip content can be loaded via an AJAX request by providing an ajax
option:

    <a href="balloon-contents.html#myTip" class="pat-tooltip" data-pat-tooltip="source: ajax">
     …
    </a>

This will load the contents of the `#myTip` element of
balloon-contents.html and display it in a tooltip.

### Generated markup

The first time the tooltip is shown the tip itself will be wrapped in a
new tooltip container. This container will be positioned correctly.

Source markup:

    <label>Website address
      <a href="#" title="Please enter the full URL for the website."
         class="pat-tooltip" data-pat-tooltip="sticky">More information</a>
    </label>

will be transformed into:

    <label>Website address
      <a href="#" class="pat-tooltip" data-pat-tooltip="sticky">More information</a>
    </label>
    …
    <div class="tooltip-container rt"
         style="top: 208px; left: 750px; visibility: visible">
      <div>
        <button class="closePanel">Close</button>
        <p>
          Please enter the full URL for the website.
        </p>
      </div>
      <span class="pointer" style="top: 111px; left: -22px"></span>
    </div>

for tooltips which fetch their content with an AJAX call the tooltip may
be temporarily shown with a progress indicator:

    <label>Website address
      <a href="/tips/#info" class="pat-tooltip" data-pat-tooltip="closing: sticky; source: ajax">More information</a>
    </label>
    …
    <div class="tooltip-container rt"
         style="top: 208px; left: 750px; visibility: visible">
      <div>
        <button class="closePanel">Close</button>
        <progress/>
      <span class="pointer" style="top: 111px; left: -22px"></span>
    </div>

### Options reference

The tooltip can be configured through a `data-pat-tooltip` attribute.
The available options are:

| Property | Default value | Values | Description | Type |
| ----- | --------| -------- | ------- | ----------- |
| `position-list`| `auto` | `tl` `tm` `tr` `rt` `rm` `rb`  `br` `bm` `bl` `lb` `lm` `lt` | The priority in which the pattern will try to position the tooltip. With the tooltip is positioned where the most space is on the screen. The two letters indicate the position of the triangle as opposed to the tooltip body. Adding `force` will force the tooltip position, even if it would end up out of view. | Multiple value |
| `position-policy` | `auto` | `auto` `force` | Policy used to place a tooltip: either always use a listed position, or allow other positions if no space is available for the listed positions. | Mutually exclusive |
| `trigger` | `click` | `click` `hover` | Sets which user action should make the tooltip appear. | Mutually exclusive |
| `source` | `title` | `ajax` `content` `title` | Select where the contents of the tooltip is taken from: AJAX loading of the link target, the contents of element or its title attribute. | Mutually exclusive |
| `delay` | `0` | *time* | `The delay for the tooltip to appear, expressed in milliseconds | Time |
| `mark-inactive` | `true` | `true` `false` | Should we add inactive class to the tooltip trigger? | Bool |
| `closing` | `auto` | `auto` `sticky` `close-button` | Auto means that the tooltip will disappear when the user clicks out of the tooltip, or — in case of hover triggered tooltips — hovers away from the trigger element. `close-button` will add a close button to the tooltip which must be used to close the tooltip. | Mutually exclusive |
| `class` | *none* | *class value* | Assigns a class to the tooltip. For instance to give a specific tooltip a different colour | |
| `ajax-data-type`| `html` | `html` `markdown` | Data type of content to be loaded when AJAX is used as source. | Mutually exclusive |
| `target` | `body` | *selector* | Selects where the tooltip container is appended in the DOM | |
