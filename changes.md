# Changelog

## 1.2.0 - Unreleased

- Packaging changes:

  - new bootstrap to handle installation of all dependencies and build
    bundles

  - Switch dependency management from jamjs to bungle. Remove all third party
    packages from the source tree. 

- The *setclass* pattern was removed in favour of the newer *switch* pattern.
  [Ticket 270](https://github.com/Patternslib/Patterns/issues/270)

- Zoom pattern: make zoom fallback control (text input field) react properly to
  change events.

- Autoscale pattern: avoid creating nasty infinite loops with the resize
  handler.

- Injection pattern: add missing dependency on jquery.form. 
  [Ticket 267](https://github.com/Patternslib/Patterns/issues/267)

- Depends pattern:

  - Add support for a `~=` operator to test for substrings.

  - Make the easing used for animations configurable.

- Modal pattern: make sure elements inside a modal do not accidentily loose
  their focus. This broke the handling of autofocus in modals.
  [Ticket 266](https://github.com/Patternslib/Patterns/issues/266)

- Collapsible pattern: 

  - Add new option to specify an (external) triggering element.
    [Ticket 274](https://github.com/Patternslib/Patterns/issues/274)

  - Make it possible to specify the transition effect to use when opening or
    closing a panel.

- Markdown pattern:

  - Include section selector in `data-src` attribute.
    [Ticket 259](https://github.com/Patternslib/Patterns/issues/259)

  - Correct detection of the end of a extracted sections.
    [Ticket 268](https://github.com/Patternslib/Patterns/issues/268)

  - Make sure we correctly identify autoloaded markdown content referenced from
    a just-injected HTML fragment.
    [Ticket 188](https://github.com/Patternslib/Patterns/issues/188)

  - Use a new markdown converter for every pattern. This fixes problems with
    shared converter state if the pattern tried to convert two pieces of
    markdown at the exact same time.

- Placeholder pattern: remove Modernizr dependency.

- Core logic changes:

  - Registry: Add option to registry.scan to let init exceptions through.
    
  - Registry: rescans the DOM for patterns registered after the initial
    DOM scan.

  - Include pattern name in the parser log output. This makes it much easier to
    debug problems.

  - Correctly handle tag and attribute names containing a colon in the HTML
    parser.


## 1.1.0 - Released February 7, 2013

- bumper pattern fetches DOM info in event handler, not only during init.
  [Ticket 232](https://github.com/Patternslib/Patterns/issues/232). (durko)

- pat/ajax to handle anchors and forms, supersedes lib/ajax (chaoflow, durko)
  including:
  [Ticket 148](https://github.com/Patternslib/Patterns/issues/148).

- pagedown 1.1.0 and pagedown-extra with code in table support (durko,
  chaoflow)
  [Ticket 252](https://github.com/Patternslib/Patterns/issues/252).

- edit-tinymce independent of ajax (durko)

- input-change events used by autosubmit and form-state (durko)

- Bring back API documentation (wichert)

- Website improvements content/design (cornae)

- Improved support for custom bundles (still experimental)
  [Ticket 227](https://github.com/Patternslib/Patterns/issues/227). (durko)
  [Ticket 235](https://github.com/Patternslib/Patterns/issues/235). (durko)

- testrunner support on nixos (chaoflow)

- experimental support for yet undocumented `data-pat-inject="history:
  record"`. (durko)

- Generate test runners for modules and bundles ourselves, removing
  dependency on grunt. (durko)

- Registry informs about loaded patterns. (chaoflow)

- Renamed `patterns` folder to `pat`. Having `Patterns` mapped to
  `Patterns/src/main` this enables `requires['Patterns/pat/inject']. (chaoflow)

- Do not run javascript loaded in the document twice. This was causing
  problems with third party modules such as [shower](http://shwr.me/)
  and was not expected behaviour. [Ticket
  231](https://github.com/Patternslib/Patterns/issues/231).. (wichert)

- Auto-scale pattern: add new `min-width` and `max-width` options.
  [Ticket 242](https://github.com/Patternslib/Patterns/issues/242).
  (wichert)

- Tooltip pattern (wichert):

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

