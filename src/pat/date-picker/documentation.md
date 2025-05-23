## Description

A pattern for creating a custom date picker or polyfill.

## Documentation

This pattern provides a styleable date picker. It can be used as a fallback
for browsers which don't yet support the HTML5 date input.

### Examples

#### Falling back to the browser's HTML5 picker if available.

Set the `behavior` option to `native` to use the browser's HTML5 date input
rendering when available.

    <input class="pat-date-picker" type="date" data-pat-date-picker="behavior: native">

#### Enforcing the styled non-HTML5 picker universally.

By default this pattern will NOT defer to the browser's HTML5 picker.

    <input class="pat-date-picker" type="date">

#### Default value

    <input class="pat-date-picker" type="date" value="2015-01-01">

#### First day on Monday

    <input class="pat-date-picker" type="date" value="2015-01-01" data-pat-date-picker="first-day: 1">

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

#### Automatically update one date when changing another

You can define one date input to be after another date with the ``after`` option.
The the other date is changed after the first, it will be automatically updated to be offset days after the first.

    <input name="start" class="pat-date-picker" type="date"/>
    <input name="end"   class="pat-date-picker" type="date" data-pat-date-picker="after: input[name=start]; offset-days: 2;"/>

#### Format the displayed date

In the default ``styled`` behavior mode, you can format the displayed date.
The date input will be hidden and updated with an ISO8601 date to submit values which are machine-readable.
The formating options are those from MomentJS: https://momentjs.com/docs/#/displaying/format/
The locale option allows you to define the language in which the formatted date is displayed.

    <input class="pat-date-picker" data-pat-date-picker="output-format: Do MMMM YYYY; locale: de" type="date" />


### Option reference

The HTML5 attributes `min` and `max` will be honoured.

In addition, the following options can be passed to `data-pat-date-picker`:

| Property                    | Type    | Default Value | Available values | Description                                                  |
| --------------------------- | ------- | ------------- | ---------------- | ------------------------------------------------------------ |
| **behavior** (or behaviour) | string  | styled        | native, styled   | Styled will always show the styled date picker. Native will use the system native date picker, provided the browser supports this. |
| **week-numbers**            | string  | hide          | show, hide       | "show" will show the weeks' numbers in a leftmost column.    |
| **i18n**                    | URL     |               |                  | Provide a URL to a JSON resource which gives the i18n values. |
| **first-day**               | Integer | 0             |                  | Set the first day of the week (0 -> Sunday, 1-> Monday, ...). |
| **after**                   | string  |               |                  | CSS selector of another date input. If this date is before the other, it will be updated to the oder date plus offset-days. |
| **offset-days**             | Integer | 0             |                  | Number of days added to the **after** reference date which will be used to update this date value. |
| **output-format**           | String  | null          |                  | MomentJS compatible formatting option. If not given, the date will be displayed in ISO 8601 format. |
| **locale**                  | String  | null          |                  | Define the language in which the formatted date should be displayed. |
