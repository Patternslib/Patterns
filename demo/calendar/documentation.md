# Calendar

## Description

With the calendar pattern you can turn any list of events into a day, week or month calendar. It's ideal for communicating upcoming events on a website.

## Documentation

| Property | Default value | Values | Description | Type |
| ----- | --------| -------- | ------- | ----------- |
| `start-date`| Current day | Internation date format | Sets the starting date of the calendar | String |
| `height`| auto | Height in pixels or auto | Sets the height of the calendar | Number or String |
| `time-format`| h(:mm)t | Values accepted by fullcalendar | Sets the format for dispaying times | String |
| `title-month`| MMMM yyyy | Values accepted by fullcalendar | Sets the content of the title in month view | String |
| `title-week`| MMM d[ yyyy]{ &#8212; [ MMM] d yyyy} | Values accepted by fullcalendar | Sets the content of the title in week view | String |
| `title-day`| dddd, MMM d, yyyy | Values accepted by fullcalendar | Sets the content of the title in day view | String |
| `column-month`| ddd | Values accepted by fullcalendar | Sets the content of the column headers in month view | String |
| `column-week`| ddd | Values accepted by fullcalendar | Sets the content of the column headers in week view | String |
| `column-day`| ddd | Values accepted by fullcalendar | Sets the content of the column header in day view | String |
| `first-day`| su | First two letters of weekday name, or Number | Controls the day that each week begins with | String or Number |
| `first-hour`| 6 | An integer between 0 and 23 | Controls the hour that each day begins with | String or Number |
| `calendar-controls`| '' | Valid jQuery selector | Can point to any element in the dom that houses the calendar contol buttons.| String |
| `category-controls`| '' | Valid jQuery selector | Can point to any element in the dom that houses the checkboxes for the calendar categories.| String |
