# Form validation

## Description
This pattern provides a simple but powerful form validtion beyond what HTML5 offers.

## Documentation

Error messages are inserted into the DOM as `em` elements with a `message warning` class. For most input elements error messages are inserted immediately after the input element. In addition both the input element and its label will get an `warning` class.

    <label class="warning">First name
        <input type="text" />
        <em class="message warning">Please fill out this field</em>
    </label>


Checkboxes and radio buttons are treated differently: if they are contained in a fieldset with class `checklist` error messages are added at the end of the fieldset.

    <fieldset class="checklist radio">
        <label><input type="radio" name="radio" /> Strawberry</label>
        <label><input type="radio" name="radio" /> Banana</label>
        <label><input type="radio" name="radio" /> Raspberry</label>
        <em class="message warning">Please make a choice</em>
    </fieldset>

### Properties

This pattern has no configurable properties.

