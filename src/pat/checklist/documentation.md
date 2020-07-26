## Description

The checklist pattern provides a convenient method to add options to
select and deselect all checkboxes in a block.

## Documentation

The checklist pattern provides a convenient method to add options to
select and deselect all checkboxes in a block. This requires two changes
in your markup:

1.  add a `pat-checklist` class to the containing element
2.  add a select and deselect buttons

Here is a simple example.

    <fieldset class="pat-checklist">
      <div class="functions">
        <button class="select-all">Select all</button>
        <button class="deselect-all">Deselect all</button>
      </div>

      <label><input type="checkbox" checked="checked"/> Option one</label>
      <label><input type="checkbox"/> Option two</label>
      <label><input type="checkbox"/> Option three</label>
      <label><input type="checkbox"/> Option four</label>
    </fieldset>

The selectors used to find the select-all and deselect-all buttons are
configurable. The default values are `.functions .select-all` and
`.functions .dselect-all`. You can configure them using shorthand
notation:

    <fieldset class="pat-checklist" data-pat-checklist=".selectAll .deselectAll">

or using the extended notation:

    <fieldset class="pat-checklist" data-pat-checklist="select: .selectAll; deselect: .deselectAll">

The buttons will be disabled if they would not make any changes. That
is: if all checkboxes are already checked the select-all button will be
disabled. And if no checkboxes are checked the deselect-all button will
be disabled.

### JavaScript API

The JavaScript API is entirely optional since Patterns already
automatically enables the switching behaviour for all elements with a
`data-pat-checklist` attribute.
