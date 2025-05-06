## Description

A pattern for creating a custom date picker or polyfill.

## Documentation

This pattern provides a styleable date picker. It can be used as a fallback
for browsers which don't yet support the HTML5 date input.

### Examples

#### Enforcing the styled non-HTML5 picker universally.

By default this pattern will NOT defer to the browser's HTML5 picker.

    <input class="pat-date-picker" type="date">

#### Default value

    <input class="pat-date-picker" type="date" value="2015-01-01">

#### Specifying the "min" and "max" attributes.

    <input class="pat-date-picker" min="2015-01-01" max="2015-12-31" type="date">

#### Show the week number.

    <input class="pat-date-picker" data-pat-date-picker="week-numbers: show;" type="date">

#### Multilingual support with German translations

The picker's UI can be translated by providing a URL to the `i18n` option. This
URL must point to a JSON encoded resource containing the translations.

    <input class="pat-date-picker" data-pat-date-picker="i18n: /src/pat/date-picker/i18n.json;" type="date">

Here are all the i18n values in JSON format:

     {
       "previousMonth": "Previous Month",
       "nextMonth": "Next Month",
       "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
       "weekdays": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
       "weekdaysShort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
     }


### Option reference

The HTML5 attributes `min` and `max` will be honoured.

In addition, the following options can be passed to `data-pat-date-picker`:

| Property                    | Type    | Default Value | Available values | Description                                                  |
| --------------------------- | ------- | ------------- | ---------------- | ------------------------------------------------------------ |
| **week-numbers**            | string  | hide          | show, hide       | "show" will show the weeks' numbers in a leftmost column.    |
| **i18n**                    | URL     |               |                  | Provide a URL to a JSON resource which gives the i18n values. |
| **first-day**               | Integer | 0             |                  | Set the first day of the week (0 -> Sunday, 1-> Monday, ...). |
