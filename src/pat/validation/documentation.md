## Description

This pattern provides form validation with standard HTML validation attributes,
extra validation rules, custom error messages and a custom error template. It
is based HTML form validation framework and therefor supports form state
checking via CSS peudo classes like `:valid` and `:invalid`.

## Documentation

The validation pattern is triggered by a single class `pat-validation` on the form tag.
The rest is handled mostly with standard HTML validation attributes.

This patterns offers:

- Custom error messages for the standard HTML validation attributes.
- Custom error template to display error messages.
- Extra validation rules where the standard HTML validation attributes are not enough.

These extra validation rules are:

- Equality checking between two fields (e.g. password confirmation).
- Date and datetime validation for before and after a given date or another input field.
- Minimum and maximum number of checked, selected or filled-out fields. Most useful for checkboxes, but also works for text-inputs, selects and other form elements.


### HTML form validation framework integration.

This pattern uses the [JavaScript Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation).
Valid formns or inputs can be selected with the `:valid` pseudo class, invalid ones with the `:invalid` pseudo class.


### Validation rules

| Name          | Syntax                     | Description                                                  |
| ------------- | -------------------------- | ------------------------------------------------------------ |
| Required      | `required="required"`      | Mark an input as required.                                   |
| Email address | `type="email"`             | Only allow valid email addresses.                            |
| Numeric value | `type="number"`            | Only allow valid numbers.                                    |
| Minimum value | `type="number" min="6"`    | Check if a number is greater than or equal to a given value. |
| Maximum value | `type="number" max="10"`   | Check if a number is less than or equal to a given value.    |
| Real number   | `type="number" step="any"` | Check if a number is less than or equal to a given value.    |


> **_NOTE:_**  The form inputs must have a `name` attribute, otherwise the validation would not happen.


### Custom error messages

Error messages are unique per type of validation (e.g. `required`, `email` or `number`) and can be overridden:

```html
<form method="post" class="pat-validation"
    data-pat-validation="
        message-date: This value must be a valid date;
        message-datetime: This value must be a valid date and time;
        message-email: This value must be a valid email address;
        message-number: This value must be a number;
        message-required: This field is required;">
    <!-- Form fields come here -->
</form>
```

Error messages can also be overridden on a per-field basis, for example:

```html
<input
    type="date"
    name="date"
    data-pat-validation="
        not-after: #planning-end-${number};
        message-date: This date must be on or before the end date.
    "
/>
```

For a list of all available error messages see the [Options reference](#options-reference).


### Error message rendering

Error messages are inserted into the DOM as `em` elements with a `message warning` class.
For most input elements error messages are inserted immediately after the input element.
In addition both the input element and its label will get an `warning` class.

```html
<label class="warning">First name
    <input type="text" required="required" />
    <em class="message warning">Please fill out this field</em>
</label>
```

Checkboxes and radio buttons are treated differently: The error message is alywas set after the last element of the inputs with the same name.

```html
<fieldset>
    <label><input type="radio" name="radio" /> Strawberry</label>
    <label><input type="radio" name="radio" /> Banana</label>
    <label><input type="radio" name="radio" /> Raspberry</label>
    <em class="message warning">Please make a choice</em>
</fieldset>
```

The error message template is be overridden via JavaScript by customizing the error_template method of the Pattern API.
This is an [example taken from Mockup](https://github.com/plone/mockup/blob/6c93b810b2c07b5bd58eec80cd03f700c9447d8c/src/patterns.js#L67):

```javascript
import { Pattern as ValidationPattern } from "@patternslib/patternslib/src/pat/validation/validation";

ValidationPattern.prototype.error_template = (message) =>
    `<em class="invalid-feedback">${message}</em>`;
```


### Form elements outside the form

Input elements outside of form elements are fully supported.
pat-validation can handle structures like these:

```html
<input name="outside" form="myform" required>
<form id="myform">
</form>
<button form="myform">submit</button>
```

More information on the `form` attribute can be found at [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form).


### Options reference

> **_NOTE:_**  The form inputs must have a `name` attribute, otherwise the
> validation would not happen.

> **_NOTE:_**  If you need to exclude a submit button from form validation -
> like a cancel button which actually submits - add the `formnovalidate`
> attribute to the button.


| Property         | Description                                                                                                                | Default                                              | Type                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------- |
| disable-selector | A selector for elements that should be disabled when there are errors in the form.                                         |                                                      | CSS Selector                           |
| message-date     | The error message for date fields.                                                                                         | This value must be a valid date                      | String                                 |
| message-datetime | The error message for datetime fields.                                                                                     | This value must be a valid date and time             | String                                 |
| message-email    | The error message for email fields.                                                                                        | This value must be a valid email address             | String                                 |
| message-max      | The error message for number values which are higher than max.                                                             | This value must be less than or equal to %{count}    | String                                 |
| message-min      | The error message for number values which are lower than min.                                                              | This value must be greater than or equal to %{count} | String                                 |
| message-number   | The error message for numbers.                                                                                             | This value must be a number.                         | String                                 |
| message-required | The error message for required fields.                                                                                     | This field is required.                              | String                                 |
| message-equality | The error message for fields required to be equal                                                                          | is not equal to %{attribute}                         | String                                 |
| message-min-values | The error message when the minimim number of checked, selected or filled-out fields has not been reached.                | You need to select at least %{count} item(s).        | String                                 |
| message-max-values | The error message when the maximum number of checked, selected or filled-out fields has not been reached.                | You need to select at most %{count} item(s).         | String                                 |
| equality         | Field-specific extra rule. The name of another input this input should equal to (useful for password confirmation).        |                                                      | String                                 |
| not-after        | Field-specific extra rule. A lower time limit restriction for date and datetime fields.                                    |                                                      | CSS Selector or a ISO8601 date string. |
| not-before       | Field-specific extra rule. An upper time limit restriction for date and datetime fields.                                   |                                                      | CSS Selector or a ISO8601 date string. |
| min-values       | Minimum number of checked, selected or filled out form elements.                                                           | null                                                 | Integer (or null)                      |
| max-values       | Maximum number of checked, selected or filled out form elements.                                                           | null                                                 | Integer (or null)                      |
| delay            | Time in milliseconds before validation starts to avoid validating while typing.                                            | 100                                                  | Integer                                |
