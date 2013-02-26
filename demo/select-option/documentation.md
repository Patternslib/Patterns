# Select box
## Description
Use select boxes for lists where a user can choose from. Typically suitable for cases of 5 options and more.

## Documentation
This pattern adds a `data-option` attribute for a select''s label containing
the text of the selected option. This can be useful for specific styling tricks.

For example this markup:

    <label>Take your pick
      <select>
        <option>Item A</option>
        <option selected="selected">Item B</option>
      </select>
    </label>

will be transformed to:

    <label data-option="Item B">Take your pick
      <select>
        <option>Item A</option>
        <option selected="selected">Item B</option>
      </select>
    </label>


### Properties
This pattern has no configurable properties.

