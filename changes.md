# Changelog

## 1.1.0 - Unreleased

- Do not run javascript loaded in the document twice. This was causing problems
  with third party modules such as [shower](http://shwr.me/) and was not expected
  behaviour. [Ticket 231](https://github.com/Patternslib/Patterns/issues/231)..

- Auto-scale pattern: add new `min-width` and `max-width` options.
    [Ticket 242](https://github.com/Patternslib/Patterns/issues/242).

- Tooltip pattern:

  - Change the options used to configure the tooltip. Part of
    [ticket 220](https://github.com/Patternslib/Patterns/issues/220).

  - Add new delay feature to postpone opening of tooltips on hover. Part of
    [ticket 220](https://github.com/Patternslib/Patterns/issues/220).

  - Add new option to set a class on the tooltip container. This allows for
    styling of individual tooltips. Part of
    [ticket 220](https://github.com/Patternslib/Patterns/issues/220).


## 1.0.1 - Released January 28, 2013

- Fix test failures in transform tests.


## 1.0.0 - Released January 28, 2013

- First official release.

