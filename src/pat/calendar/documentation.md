## Description

A day, week and month view to display events as a calendar.

## Documentation

### Options reference

The calendar can be configured through a `data-pat-calendar` attribute. The available options are:

| Property                  | Default value     | Values                                            | Description                                                                                                   | Type                   |
| ------------------------- | ----------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `calendar-controls`       |                   |                                                   |
| `category-controls`       |                   |                                                   |
| `column-day`              | dddd M/d          |                                                   |
| `column-month`            | ddd               |                                                   |
| `column-week`             | ddd M/d           |                                                   |
| `default-view`            | month             | month, basicWeek, basicDay, agendaWeek, agendaDay | The default view of the calendar.                                                                             | Mutually Exclusive     |
| `drag-and-drop`           |                   | true, false                                       | Enable support for drag and drop or drag to resize of the events in the calendar.                             | Mutually Exclusive     |
| `drop-external-events`    |                   | true, false                                       | Enable support for dragging and dropping events from outside of the calendar, into it.                        | Mutually Exclusive     |
| `external-event-selector` |                   |                                                   | A JQuery selector with which external events are identified. Used in conjunction with `drop-external-events`. | JQuery selector string |
| `first-day`               | 0                 |                                                   |
| `first-hour`              | 6                 |                                                   |
| `height`                  | auto              |                                                   |
| `ignore-url`              |                   |                                                   |
| `start-date`              |                   |                                                   |
| `store`                   | none              | none, session, local                              |
| `time-format`             | h(:mm)t           |                                                   |
| `title-day`               | dddd, MMM d, YYYY |                                                   |
| `title-month`             | MMMM YYYY         |                                                   |
| `title-week`              | MMM D YYYY        |                                                   |
