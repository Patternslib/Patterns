## Description

This pattern provides a simple but powerful form validation beyond what HTML5 offers.

## Documentation

The validation pattern is triggered by a single class `pat-validation` on the form tag. The rest is handled mostly with standard HTML5 validation attributes.

This pattern has several advantages over standard HTML 5 form validation:

- it supports older browsers
- it uses simple documented HTML markup to allow non-browser-specific styling of error messages
- it supports extra validation rules

### The following attributes may be used.

| Name          | Syntax                   | Description                                                  |
| ------------- | ------------------------ | ------------------------------------------------------------ |
| Required      | `required="required"`    | Mark an input as required.                                   |
| Email address | `type="email"`           | Only allow valid email addresses.                            |
| Numeric value | `type="number"`          | Only allow valid numbers.                                    |
| Minimum value | `type="number" min="6"`  | Check if a number is greater than or equal to a given value. |
| Maximum value | `type="number" max="10"` | Check if a number is less than or equal to a given value.    |

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

#### Overriding error messages

Error messages are unique per type of validation (e.g. `required`, `email` or `number`) and can be overridden:

    <form method="post" class="pat-validation"
        data-pat-validation="
            message-date: This value must be a valid date;
            message-datetime: This value must be a valid date and time;
            message-email: This value must be a valid email address;
            message-number: This value must be a number;
            message-required: This field is required;">

        <!-- Form fields come here -->

    </form>

Error messages can also be overridden on a per-field basis, for example:

    <input type="date" name="date" data-pat-validation="type: date; not-after: #planning-end-${number}; message-date: This date must be on or before the end date."/>

### Options reference

| Property         | Description                                                                                                                | Default                                              | Type                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------- |
| disable-selector | A selector for elements that should be disabled when there are errors in the form.                                         |                                                      | CSS Selector                           |
| message-date     | The error message for date fields.                                                                                         | This value must be a valid date                      | String                                 |
| message-datetime | The error message for datetime fields.                                                                                     | This value must be a valid date and time             | String                                 |
| message-email    | The error message for email fields.                                                                                        | This value must be a valid email address             | String                                 |
| message-integer  | The error message for integers.                                                                                            | This value must be an integer                        | String                                 |
| message-max      | The error message for max number values.                                                                                   | This value must be less than or equal to %{count}    | String                                 |
| message-min      | The error message for min number values.                                                                                   | This value must be greater than or equal to %{count} | String                                 |
| message-number   | The error message for numbers.                                                                                             | This value must be a number.                         | String                                 |
| message-required | The error message for required fields.                                                                                     | This field is required.                              | String                                 |
| not-after        | Field-specific. A lower time limit restriction for date and datetime fields.                                               |                                                      | CSS Selector or a ISO8601 date string. |
| not-before       | Field-specific. An upper time limit restriction for date and datetime fields.                                              |                                                      | CSS Selector or a ISO8601 date string. |
| type             | Field-specific. Denotes a special field type not supported by default in (all) browsers. Can be integer, date or datetime. |                                                      | String                                 |
