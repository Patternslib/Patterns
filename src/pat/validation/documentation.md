## Description
This pattern provides a simple but powerful form validation beyond what HTML5 offers.

## Documentation

The validation pattern is triggered by a single class `pat-validate` on the form tag. The rest is handled mostly with standard HTML5 validation attributes.

This pattern has several advantages over standard HTML 5 form validation:

- it supports older browsers
- it uses simple documented HTML markup to allow non-browser-specific styling of error messages 
- it supports extra validation rules

### The following attributes may be used.

| Name | Syntax | Description |
| ---- | ------ | ----------- |
| Required | `required="required"` | Mark an input as required. |
| Email address | `type="email"` | Only allow valid email addresses. |
| Numeric value | `type="number"` | Only allow valid numbers. |
| Minimum value | `type="number" min="6"`| Check if a number is greater than or equal to a given value. |
| Maximum value | `type="number" max="10"`| Check if a number is less than or equal to a given value. |
| Regular expression | `pattern="regexp"`| Check if an input value matches a given regular expression . |


    <fieldset>
      <label>Street <input type="text" required="required"/></label>
      <label>Number <input type="number" required="required" min="1"/></label>
      <label>Postal code <input type="text" required="required" pattern="[0-9]{4}\s*[A-Za-z]{2}"/></label>
      <label>City <input type="text" required="required"/></label>
    </fieldset>

In addition the extra validators from Parsley are support. You can find a complete list of supported
validators at the [Parseley validators documentation](http://parsleyjs.org/documentation.html#validators).

### Error messages

Error messages are inserted into the DOM as `em` elements with a `message warning` class.
For most input elements error messages are inserted immediately after the input element.
In addition both the input element and its label will get an `warning` class.

    <label class="warning">First name
        <input type="text" required="required" />
        <em class="message warning">Please fill out this field</em>
    </label>


Checkboxes and radio buttons are treated differently: if they are contained in a fieldset with class `checklist` error messages are added at the end of the fieldset.

    <fieldset class="checklist radio">
        <label><input type="radio" name="radio" /> Strawberry</label>
        <label><input type="radio" name="radio" /> Banana</label>
        <label><input type="radio" name="radio" /> Raspberry</label>
        <em class="message warning">Please make a choice</em>
    </fieldset>

### Options reference

| Property | Description | Default | Type |
|------|------|-----|------|
| disable-selector | A selector for elements that should be disabled when there are errors in the form. |       | CSS Selector |
