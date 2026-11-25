## Description

A pattern for enhancing a local date and time input. By default, it uses the
browser's date-time control when available and falls back to separate date and
time fields.

## Documentation

### Examples

#### Using the native date-time control

The default `native` behavior uses the browser's date-time control when
available.

    <input class="pat-datetime-picker" type="datetime-local" value="2015-01-01T12:34">

#### Using a translated JavaScript calendar

The `styled` behavior shows a formatted date that opens the JavaScript
calendar. A separate time field keeps the browser's time input. Set `i18n` to
the URL of a JSON file containing the calendar translations. Use
`output-format` and `locale` to format the displayed date.

    <input class="pat-datetime-picker" type="datetime-local" value="2015-01-01T12:34"
           data-pat-datetime-picker="behavior: styled; i18n: /src/pat/date-picker/i18n.json; output-format: Do MMMM YYYY; locale: de">

#### Specifying date and time limits

Set `min` and `max` on the original input as local date-time values. In split
controls, their date portions also limit calendar selections. The original
input holds the combined date and time for submission and validation.

    <input class="pat-datetime-picker" type="datetime-local"
           min="2015-01-01T08:00" max="2015-12-31T18:00">

#### Updating an end date and time from a start date and time

Set `after` to a CSS selector for a reference date-time field. When the
reference changes, an empty or earlier value is set to the reference date plus
`offset-days`, using the reference's local time.

    <input class="pat-datetime-picker" type="datetime-local" name="start">
    <input class="pat-datetime-picker" type="datetime-local" name="end"
           data-pat-datetime-picker="after: input[name=start]; offset-days: 2">

### Option reference

Pass these options to `data-pat-datetime-picker`.

| Property | Type | Default | Available values | Description |
| --- | --- | --- | --- | --- |
| **behavior** (or **behaviour**) | String | `native` | `native`, `styled` | `native` uses the browser's date-time control when available. `styled` displays a formatted date that opens the JavaScript calendar, alongside a time field. |
| **week-numbers** | String | `hide` | `show`, `hide` | Show week numbers in the JavaScript calendar. |
| **i18n** | URL | | | URL of a JSON file containing translations for the JavaScript calendar. |
| **first-day** | Integer | `0` | `0`–`6` | First day of the week in the JavaScript calendar, starting with Sunday at `0`. |
| **after** | String | | | CSS selector of the reference date-time field. |
| **offset-days** | Integer | `0` | | Number of calendar days added to the reference date. |
| **output-format** | String | | | Moment.js format for the displayed date in `styled` mode. The default is `YYYY-MM-DD`. |
| **locale** | String | | | Locale for the formatted date in `styled` mode. |
| **today** | String | `Today` | | Label of the button that sets the current date and time in split controls. An empty value hides the button. |
| **clear** | String | `Clear` | | Label of the button that clears both fields in split controls. An empty value hides the button. |
