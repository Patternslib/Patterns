# Documentation

Tooltips are intended to display contextual information and function
about the trigger element.

Markup structure
----------------

    <label>Website address
      <a href="#" title="Please enter the full URL for the website"
          class="pat-tooltip">More information</a>
    </label>

Display
-------

Tooltips are shown when the mouse hovers over the triggering element,
and are hidden when the mouse leaves the triggering element.

The trigger can be changed to require a click on the triggering element
by adding a `click` option.

    <a href="#" title="Please enter the full URL for the website"
       class="pat-tooltip" data-pat-tooltip="click">More information</a>

Positioning
-----------

Tooltips will be positioned close to the element that triggered them,
with an arrow tip pointing to the centre of the triggering item. The
placement of the tip on the tooltip determines the positioning of the
tooltip. For example if the tip is placed at the right side of the
tooltip, it naturally follows that the tooltip itself will be placed to
the left of the triggering element.

The position of the tip within the tooltip can be specified with a
*position* argument which specifies the preferred positions. This is
formatted as `<preference>[-preference]*`. The possible preferences are:

-   `tl`: tip placed at the leftmost corner of the top side of the
    tooltip
-   `tm`: tip placed at the middle of the top side tooltip
-   `tr`: tip placed at the rightmost corner of the top side of the
    tooltip
-   `rt`: tip placed at the top corner of the right side of the tooltip
-   `rm`: tip placed at the middle of the right side tooltip
-   `rb`: tip placed at the bottom corner of the right side of the
    tooltip
-   `bl`: tip placed at the leftmost corner of the bottom side of the
    tooltip
-   `bm`: tip placed at the middle of the bottom side tooltip
-   `br`: tip placed at the rightmost corner of the bottom side of the
    tooltip
-   `lt`: tip placed at the top corner of the left side of the tooltip
-   `lm`: tip placed at the middle of the left side tooltip
-   `lb`: tip placed at the bottom corner of the left side of the
    tooltip

An example:

    <a href="#tip" class="pat-tooltip" data-pat-tooltip="lt-lm-rt-rm">
     …
    </a>

This specifies that the preferred position of the tip is at the top left
side of the tooltip (placing the tooltip itself on the right side of the
link). Notice that position is the first defined argument so you can use
shorthand syntax directly. If the tooltip does not fit at that position
the left-middle position should be tried, than the right-top or if all
previous options failed the middle of the right side. If the tooltip
does not fit at any none of the preferred positions the tooltip will be
positioned at the location that has the most space, even if this is not
one of the preferred positions.

It is possible to force a specific tooltip position by adding the
`force` flag.

    <a href="#" title="Please enter the full URL for the website"
       class="pat-tooltip" data-pat-tooltip="lt force">
     …
    </a>

Sticky tooltips
---------------

By default, the tooltip disappears when the cursor is moved off the
element or the triggering element is clicked. If this is not desired
behaviour, there is the option to have a 'sticky' tooltip. This only
disappears when a close button on the tooltip is clicked. When the
sticky option is chosen, the close button will be inserted for you
automatically.

    <a href="#" class="pat-tooltip" data-pat-tooltip="sticky">
     …
    </a>

AJAX tooltips
-------------

The tooltip content can be loaded via an AJAX request by proving an ajax
option:

    <a href="balloon-contents.html#myTip" class="pat-tooltip" data-pat-tooltip="ajax">
     …
    </a>

This will load the contents of the `#myTip` element of
balloon-contents.html and display it in a tooltip.

Generated markup
----------------

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
      <a href="/tips/#info" class="pat-tooltip" data-pat-tooltip="sticky">More information</a>
    </label>
    …
    <div class="tooltip-container rt"
         style="top: 208px; left: 750px; visibility: visible">
      <div>
        <button class="closePanel">Close</button>
        <progress/>
      <span class="pointer" style="top: 111px; left: -22px"></span>
    </div>

Option reference
----------------

The tooltip can be configured through a `data-pat-tooltip` attribute.
The available options are:

+------------------+------------+-----------------------------------------------+
| Field | default | Description |
+==================+============+===============================================+
| `position` | | A `-`-seperated list of tooltip positions. |
+------------------+------------+-----------------------------------------------+
| `force` | false | If set always use a provided position even if | | |
| does not fit in the window. |
+------------------+------------+-----------------------------------------------+
| `click` | false | If set the user must click on a link to see | | | |
the tooltip. |
+------------------+------------+-----------------------------------------------+
| `sticky` | false | If set the user must click on a close button | | |
| in the tooltip to make it disappear. |
+------------------+------------+-----------------------------------------------+
| `close` | true | Indicates if a close button should | | | |
automatically be added to a sticky tooltip. |
+------------------+------------+-----------------------------------------------+
| `ajax` | false | If set the tooltip content will be loaded | | | |
from the `href` of the link. |
+------------------+------------+-----------------------------------------------+
| `content` | | If set (and ajax is not set) use this as the | | | |
tooltip content instead of the `title` | | | | attribute. |
+------------------+------------+-----------------------------------------------+