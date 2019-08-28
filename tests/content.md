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

