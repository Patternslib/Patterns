# Changelog

## 1.5.0 - Unreleased

- Fix event handling in the sortable pattern. This could result in unexpected
  behaviour in Firefox.

- Add a new [forward pattern](demo/forward/index.html).

- Add a missing dependency on jquery-ext to the registry module. This fixes
  errors invoking the scan function when using a Patterns bundle.

- Validate pattern: perform validation when submitting forms via AJAX.

- The argument parser can now disable configuration inheritance if needed
  by a pattern.

- The select-option pattern has been merged into the [checked
  flag](demo/checked-flag/index.html) pattern.

- Checked flag pattern: add new API to control select and checkbox elements.

- Do not handle exceptions during Patterns initialisation and transforms if a
  `patterns-dont-catch` query string parameter is present.


## 1.4.1 - July 13, 2013

- Validate pattern: always validate form elements when they are changed instead
  of waiting for a first form submit. This fixes 
  [ticket 324](https://github.com/Patternslib/Patterns/issues/324).

- Update to a new version of [shower](http://shwr.me/) which does not hijack
  key events when not in presentation mode. This fixes 
  [ticket 315](https://github.com/Patternslib/Patterns/issues/315).

- Handle security errors when checking if a browser supports sessions storage.
  This fixes [ticket 326](https://github.com/Patternslib/Patterns/issues/326).

- Add new [equaliser pattern](demo/validate/index.html). This fixes
  [ticket 307](https://github.com/Patternslib/Patterns/issues/307).

- Depends pattern: allow dahses in input names and values again. This fixes
  [ticket 313](https://github.com/Patternslib/Patterns/issues/313).


## 1.4.0 - Released May 24, 2013

- Include value of used submit button when using forms for injection. This
  fixes [ticket 305](https://github.com/Patternslib/Patterns/issues/305).

- The argument parser has been updated to support quoted arguments in shorthand
  notation.

- Add new [validate pattern](demo/validate/index.html). This fixes
  [ticket 68](https://github.com/Patternslib/Patterns/issues/68).

- Add a new internal `pat-update` event which is triggered for elements that
  are changed.

- Markdown pattern: correct internal escaping behaviour which could cause
  characters to show up in unexpected escaped form in literal blocks. This
  fixes [ticket 306](https://github.com/Patternslib/Patterns/issues/306).

- Depends pattern:

  - Include element with invalid dependency in error log messages. This makes
    it a lot simpler to find the source of errors.

  - Support non-ASCII variable names and values. This fixes [ticket
    304](https://github.com/Patternslib/Patterns/issues/304).

  - Do not include generated parser in source tree. Instead the make rules
    have been improved to generate/update the parser as needed.

  - Support quoting of values. This makes it possible to test for values
    containing whitespace.


## 1.3.1 - Released May 6, 2013

- Collapsible pattern: add a new `slide-horizontal` transition.

- Slideshow builder pattern: make it possible to insert the slideshow fieldset
  in a different location than at the start of the form.

- Packaging: Remove unneeded dependency on jquery.autosuggest.

- Injection pattern:

  - Fix injection of HTML5 elements in IE 8 and older.
  - Fix the rebasing of URLs when injecting in IE 8 and older.
  - Send a new ``pat-inject-content-laoded`` event when all images in injected
    markup have finished loading.

- Modal pattern: 

  - Reposition the modal after its images have finished loading.
  - Improve browser compatibility.


## 1.3.0 - Released April 5, 2013

- Fix use of an undeclared variable in the parser which could result in
  problems in IE8. This fixes
  [ticket 298](https://github.com/Patternslib/Patterns/issues/298).

- Markdown pattern:

  - Generate HTML5 `<section>` elements with a `<h1>` header when converting
    headers. This fixes [ticket
    216](https://github.com/Patternslib/Patterns/issues/216).

  - Support filtering if injected markdown documents with headers using
    underlined (equal signs or dashes) style notation.

  - Update the version of
    [pagedown-extra](https://github.com/jmcmanus/pagedown-extra) which could
    case markdown constructs to be replaces with the word `undefined`. This
    fixes [ticket 297](https://github.com/Patternslib/Patterns/issues/297).

- Injection pattern: extend *autoload-in-visible* to also apply for situations
  where we are not dealing with a heigh-constrained scrollable parent but need
  to look at the entire page.
  This fixes [ticket 296](https://github.com/Patternslib/Patterns/issues/296).

- The [switch pattern](demo/switch/index.html) can now remember the its state.
  This fixes [ticket 293](https://github.com/Patternslib/Patterns/issues/293).

- Add a new [gallery](demo/gallery/index.html) pattern.


## 1.2.1 - Released April 5, 2013

- Fix use of an undeclared variable in the parser could result in problems
  in IE8. This fixes
  [Ticket 298](https://github.com/Patternslib/Patterns/issues/298).

- Fix handling of trailing semicolons in the the argument parser. This fixes
  [Ticket 295](https://github.com/Patternslib/Patterns/issues/295).



## 1.2.0 - Released March 28, 2013

- Update the website design. (Cornelis Kolbach)

- Packaging changes:

  - New bootstrap to handle installation of all dependencies and build
    bundles (Marko Đurković, Florian Friesdorf)

  - Switch dependency management from jamjs to bungle. Remove all third party
    packages from the source tree. (Marko Đurković)

- The *setclass* pattern was removed in favour of the newer *switch* pattern.
  [Ticket 270](https://github.com/Patternslib/Patterns/issues/270)
  (Wichert Akkerman)

- Add a new *select-option* pattern to faciliate styling of select elements.
  [Ticket 276](https://github.com/Patternslib/Patterns/issues/276)

- Zoom pattern: make zoom fallback control (text input field) react properly to
  change events. (Marko Đurković)

- Improve documentation for the image-crop pattern.

- Fix handling of position hints for tooltips. (Marko Đurković)

- Autoscale pattern:

  - Avoid creating infinite loops with the resize handler in IE8. This could
    load to browser crashes.
    (Marko Đurković)

  - Use the *scale* method on IE 9 as well.
    [Ticket 281](https://github.com/Patternslib/Patterns/issues/281)
    (Wichert Akkerman)

- Injection pattern:

  - Add missing dependency on jquery.form.
    [Ticket 267](https://github.com/Patternslib/Patterns/issues/267)
    (Wichert Akkerman)

  - Also rebase URLs for `video` and `source` elements.
    (Florian Friesdorf)

  - Modify attribute value escaping in HTML parser to always use `&quot;` for
    double quotes. This fixes problems attribute values containing double
    quotes.
    (Wichert Akkerman)

  - Rewrite URL rebasing logic to use the browser''s HTML parser again. This
    should improve robustness when dealing with non-standard markup.
    (Marko Đurković)

- Depends pattern:

  - Really hide/show elements if no transition type was specified (or
    `none` was specified explicitly).

  - Add support for a `~=` operator to test for substrings.
    (Wichert Akkerman)

  - Make the easing used for animations configurable.
    (Wichert Akkerman)

- Form-State pattern: add `form-state-saved` signal.
  (Marko Đurković)

- Modal pattern: 

  - Automatically position modals using javascript to fix problems with IE9 and
    make sure they always fit in the viewport.
    (Cornelis Kolbach and Marko Đurković)

  - Make sure elements inside a modal do not accidentily loose their focus.
    This broke the handling of autofocus in modals.  [Ticket
    266](https://github.com/Patternslib/Patterns/issues/266) (Wichert Akkerman)

- Check-list pattern: send *change* event when a checkbox is toggled. This fixes
  interaction with other patterns such as the checked-flag pattern.

- Collapsible pattern: 

  - Add new option to specify an (external) triggering element.
    [Ticket 274](https://github.com/Patternslib/Patterns/issues/274)
    (Wichert Akkerman)

  - Make it possible to specify the transition effect to use when opening or
    closing a panel.
    (Wichert Akkerman)

- Markdown pattern:

  - Include section selector in `data-src` attribute.
    [Ticket 259](https://github.com/Patternslib/Patterns/issues/259)
    (Wichert Akkerman)

  - Correct detection of the end of a extracted sections.
    [Ticket 268](https://github.com/Patternslib/Patterns/issues/268)
    (Wichert Akkerman)

  - Make sure we correctly identify autoloaded markdown content referenced from
    a just-injected HTML fragment.
    [Ticket 188](https://github.com/Patternslib/Patterns/issues/188)
    (Wichert Akkerman)

  - Use a new markdown converter for every pattern. This fixes problems with
    shared converter state if the pattern tried to convert two pieces of
    markdown at the exact same time.
    (Wichert Akkerman)

- Placeholder pattern: remove Modernizr dependency.
  (Wichert Akkerman)

- Sortable pattern: fix weird behaviour when element is dropped on self.
  (Markoi Đurković)

- Core logic changes:

  - Patterns main.js returns registry, you have to call patterns.init()
    manually. For the bundles this happens automatically. Depend on
    `patterns/autoinit`, if you really want an auto-initializing modular
    patterns library. (Florian Friesdorf)

  - Registry: Add option to registry.scan to let init exceptions
    through. (Rok Garbas)
    
  - Registry: rescans the DOM for patterns registered after the initial
    DOM scan. (Florian Friesdorf)

  - Include pattern name in the parser log output. This makes it much easier to
    debug problems. (Wichert Akkerman)

  - HTML parser:
  
    - Correctly handle tag and attribute names containing a colon.
      (Wichert Akkerman)

    - Correct escaping of double quotes in attribute values.
      (Wichert Akkerman)

## 1.1.0 - Released February 7, 2013

- bumper pattern fetches DOM info in event handler, not only during init.
  [Ticket 232](https://github.com/Patternslib/Patterns/issues/232). (Marko Đurković)

- pat/ajax to handle anchors and forms, supersedes lib/ajax (Florian Friesdorf, Marko Đurković)
  including:
  [Ticket 148](https://github.com/Patternslib/Patterns/issues/148).

- pagedown 1.1.0 and pagedown-extra with code in table support (Marko Đurković,
  Florian Friesdorf)
  [Ticket 252](https://github.com/Patternslib/Patterns/issues/252).

- edit-tinymce independent of ajax (Marko Đurković)

- input-change events used by autosubmit and form-state (Marko Đurković)

- Bring back API documentation (Wichert Akkerman)

- Website improvements content/design (cornae)

- Improved support for custom bundles (still experimental)
  [Ticket 227](https://github.com/Patternslib/Patterns/issues/227). (Marko Đurković)
  [Ticket 235](https://github.com/Patternslib/Patterns/issues/235). (Marko Đurković)

- testrunner support on nixos (Florian Friesdorf)

- experimental support for yet undocumented `data-pat-inject="history:
  record"`. (Marko Đurković)

- Generate test runners for modules and bundles ourselves, removing
  dependency on grunt. (Marko Đurković)

- Registry informs about loaded patterns. (Florian Friesdorf)

- Renamed `patterns` folder to `pat`. Having `Patterns` mapped to
  `Patterns/src/main` this enables `requires['Patterns/pat/inject']. (Florian Friesdorf)

- Do not run javascript loaded in the document twice. This was causing
  problems with third party modules such as [shower](http://shwr.me/)
  and was not expected behaviour. [Ticket
  231](https://github.com/Patternslib/Patterns/issues/231).. (Wichert Akkerman)

- Auto-scale pattern: add new `min-width` and `max-width` options.
  [Ticket 242](https://github.com/Patternslib/Patterns/issues/242).
  (Wichert Akkerman)

- Tooltip pattern (Wichert Akkerman):

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

