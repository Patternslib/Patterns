## Description

The checklist pattern provides a convenient method to add options to
select and deselect all checkboxes in a block.

## Documentation

The checklist pattern provides a convenient method to add options to
select and deselect all checkboxes in a block. This requires two changes
in your markup:

1.  add a `pat-checklist` class to the containing element
2.  add a select and deselect buttons or a toggle checkbox

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

An example with toggle checkbox.

    <fieldset class="pat-checklist">
      <label><input type="checkbox" class="toggle-all"> Select all/none</label>
      <label><input type="checkbox" checked="checked"/> Option one</label>
      <label><input type="checkbox"/> Option two</label>
      <label><input type="checkbox"/> Option three</label>
      <label><input type="checkbox"/> Option four</label>
    </fieldset>

The selectors used to find the select-all and deselect-all buttons are
configurable. The default values are `.functions .select-all` and
`.functions .deselect-all`. You can configure them using shorthand
notation:

    <fieldset class="pat-checklist" data-pat-checklist=".selectAll .deselectAll">

or using the extended notation:

    <fieldset class="pat-checklist" data-pat-checklist="select: .selectAll; deselect: .deselectAll">

The buttons will be disabled if they would not make any changes. That
is: if all checkboxes are already checked the select-all button will be
disabled. And if no checkboxes are checked the deselect-all button will
be disabled.


### Option reference

| Property    | Type    | Default Value    | Description                                                                                                                                                                                                    |
| ----------- | ------- | ---------------- | -------------------------------------------- |
| `select`    | String  | `.select-all`    | CSS selector for the "Select All" button.    |
| `deselect`  | String  | `.deselect-all`  | CSS selector for the "Deselect All" button.  |
| `toggle`    | String  | `.toggle-all`    | CSS selector for the "Toggle" button.        |
