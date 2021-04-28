## Description

A day, week and month view to display events as a calendar.

## Documentation


### Connecting to a backend

The calendar pattern expects a plone.restapi compatible data structure by default.
An example is given in the demo which uses the ``test_event_source.json`` file to provide some example events.

The ``url`` parameter allows two variables to be passed to it: the start and end date as ISO 8601 strings to limit the list of events which should be shown.
The calendar pattern automatically replaces them with the start and end date of the current view - the beginning or the end of the month, week or day.

For connecting to a plone.restapi backend you can provide a url like this one:

```
http://localhost:8080/Plone/@search?portal_type=Event&start.query=${end_str}&start.range=max&end.query=${start_str}&end.range=min&metadata_fields=start&metadata_fields=end&metadata_fields=whole_day&metadata_fields=location;
```

It searches for events starting as early as the given ``end_str`` and latest as the given ``start_str``.

This is the full initialization tag:

```
  <div id="calendar" class="pat-calendar"
      data-pat-calendar="
        url: http://localhost:8080/Plone/@search?portal_type=Event&start.query=${end_str}&start.range=max&end.query=${start_str}&end.range=min&metadata_fields=start&metadata_fields=end&metadata_fields=whole_day&metadata_fields=location;
        initial-date: 2020-10-10;
        lang: de;
        store: session;"
  >
```


### Options reference

The calendar can be configured through a `data-pat-calendar` attribute. The available options are:

| Property                  | Default value     | Values                                            | Description                                                                                                   | Type                   |
| ------------------------- | ----------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `calendar-controls`       |                   | Valid CSS selector.                               | Defines the element where the calendar UI controls are located in. If not given, the pat-calendar element is used as search context. | string |
| `category-controls`       |                   | Valid CSS selector.                               | Defines the element where the category UI controls are located in. If not given, the pat-calendar element is used as search context. | string |
| `column-day`              | dddd M/d          |                                                   |
| `column-month`            | ddd               |                                                   |
| `column-week`             | ddd M/d           |                                                   |
| `initial-date`            |                   | ISO8601 date string (yyyy-mm-dd)                  | The initial date for the calendar. Defaults to the current date.
| `initial-view`            | month             | month, basicWeek, basicDay, agendaWeek, agendaDay | The default view of the calendar.                                                                             | Mutually Exclusive     |
| `drag-and-drop`           |                   | true, false                                       | Enable support for drag and drop or drag to resize of the events in the calendar.                             | Mutually Exclusive     |
| `drop-external-events`    |                   | true, false                                       | Enable support for dragging and dropping events from outside of the calendar, into it.                        | Mutually Exclusive     |
| `external-event-selector` |                   |                                                   | A JQuery selector with which external events are identified. Used in conjunction with `drop-external-events`. | JQuery selector string |
| `first-day`               | 0                 |                                                   |
| `first-hour`              | 6                 |                                                   |
| `height`                  | auto              |                                                   |
| `ignore-url`              |                   |                                                   |
| `store`                   | none              | none, session, local                              |
| `time-format`             | h(:mm)t           |                                                   |
| `title-day`               | dddd, MMM d, YYYY |                                                   |
| `title-month`             | MMMM YYYY         |                                                   |
| `title-week`              | MMM D YYYY        |                                                   |
| `url`                     |                   |                                                   | URL to an event source as JSON feed.
| `event-color`             | blue              | Any CSS color value                               | Default color of events.
| `pat-inject-source`       |                   | CSS selector                                      | If clicking on an event this selector identifies which section of the loaded event to inject.                 | string                 |
| `pat-inject-target`       |                   | CSS selector                                      | If clicking on an event this selector identifies where to inject the loaded content.                          | string                 |
| `pat-switch-selector`     |                   | CSS selector                                      | Defines the element on which pat-select should operate on.                                                    | string                 |
| `pat-switch-add`          |                   | CSS class name                                    | Defines the class name to be added.                                                                           | string                 |
| `pat-switch-remove`       |                   | CSS class name                                    | Defines the class name to be removed.                                                                         | string                 |
| `pat-tooltip-source`      | null              | null, "ajax"                                      | If set to "ajax" and a URL is configured for an displayed event, it will open the url in a tooltip.           | string                 |
| `pat-modal-class`         | null              | null, CSS class names                             | If set to a string of space seperated CSS class names a modal will be initialized on an event.                | string                 |

