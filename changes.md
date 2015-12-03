# Changelog

## 2.0.13 - Unreleased

- New property for sortable pattern, `drag-class`, the CSS class to apply to item being dragged. Is `"dragged"` by default.
- New property for sortable pattern, `drop`, a Javascript callback function to be called when an item is dropped.
- Form with pat-autosubmit doesn't get notified when injected inputs change.
- Inject pattern with `autoload-visible` injected erroneously based upon old autoload element no longer in DOM.
- Add the class `modal-active` to the `body` element whenever a modal is in the DOM.
- New pattern: `pat-tabs`. See the relevant documentation.
- Bugfix: `pat-validation` still validates removed clones from `pat-clone`.

## 2.0.12 - Oct. 9, 2015

- New property for the inject pattern: `loading-class`.
  Specifies a class to appear on the injection target while the injected content is still loading.
  Previously this was hardcoded to `injecting`, this is still set to the default value.
- New propertys for the inject pattern: `confirm` and `confirm-message`.
  Allows you to specify whether a confirmation message should be shown before
  injecting, as well as the text of that message.
- New property for tooltip pattern: `mark-inactive`.
  A boolean value, used to specify whether the class 'inactive' should be added
  to the tooltip trigger. Previously this behavior was hardcoded, now it's
  optional with a default of `true`.
- Fix: tooltips with `closing` set to `sticky` or `auto` couldn't be closed on mobile.
- Parser fix. Remove duplicate configurations.
- Bugfix: TypeError: Cannot read property 'msie' of undefined.

## 2.0.11 - Sept. 30, 2015

- Bugfix. Specifying combined pattern properties (with &&) not working on IE10.
- Add an alternative parser, from the Mockup project.
- Updated documentation.
- Clone pattern has a new argument: remove-behaviour.

## 2.0.10 - Sept. 18, 2015

- Add new argument "hooks" to pat-inject.
- Add new parser method addAlias for adding aliases of parser arguments.
- Add the addJSONArgument method to the argument parser, which provides support for JSON as argument values.
- Added Sass files for all patterns.
- Bugfix in pat-masonry. Wait until images are loaded.
- Bugfixes and improvements to pat-clone.
- Fixed a bug where the page reloads when the image viewer from pat-gallery is closed.
- In pat-autosuggest, new option allow-new-words, for explicitly allowing or denying custom tags.
- Make pat-bumper also bump against the bottom edge.
- New layout. All files relevant to individual patterns (except for tests) are now in ./src/pat
- pat-gallery now uses Photoswipe 4.1.0 and is based on pat-base.
- New pattern pat-validation which replaces pat-validate.

## 2.0.9 - Mar 30, 2015

- Fixed IE bug in pat-equalizer
- #389 Add support in pat-inject for the HTML5 formaction attribute
- New pattern: pat-clone.
- Upgrade to jQuery 1.11.1

## 2.0.8 - Feb. 5, 2015

- #395 add body class after patterns loaded from registry

## 2.0.7 - Feb. 4, 2015

- #381 Checked class not set on checklist
- Add stub module i18n.js. Provides compatibility with Mockup patterns.
- Add support for Mockup patterns.
- Add support for parsing JSON as pattern configuration
- Add support for using pat-subform together with pat-modal.
- Give pattern plugins the change to modify arguments before returning them.
- New arg for pat-autosuggest: words-json
- New pattern: pat-masonry

## 2.0.6 - Dec. 10, 2014

- New core module pluggable.js which allows the creation of Pluggable patterns.

## 2.0.5 - Dec. 4, 2014

- #383 pat-equaliser sets the height to early

## 2.0.4 - Oct. 7, 2014

- spectrum lib for colour picker now defaults to hsv values. Keep hex as default for backward compatibility (SLC ref 9849)
- pat-inject autoload did not properly remove event handlers, so that they were called over and over. (SLC ref 10695)

## 2.0.3 - Sept. 22, 2014

- when another tooltip trigger is clicked, only close the previous tooltip if
  it does not contain the trigger. slc ref #9801
- moved utils.debounce() call to fix removal of event handler
  slc ref #10695

## 2.0.2 - Sept. 8, 2014

- #377 Local inject doesn't work for IE10 and 11
- #378 pat-switch detecting click on container of link prevent default on anchor
- #379 pat-checklist selectAll/deselectAll only works inside .pat-checklist element


## 2.0.1 - Sept. 2, 2014

- Bugfix in pat-toggle. Check that the previous state is not null before
  attempting to restore it.


## 2.0.0 - August 11, 2014

- New patterns:
  - Colour picker pattern. This can be used as a polyfill for browsers which do
    not support colour inputs.
  - Notifications pattern for self-healing messages.


- Autofocus pattern: never give an input element the focus if it was hidden
  by the depends pattern.

- Autosuggest pattern:

  - Add AJAX-support to load available options from a backend server.

  - Clear the selected value from a reset button for the form is pressed.

  - Do not open the auto-suggest dropdown on enter.

  - Fix width-related layout problems.

  - Add option to restrict the max amount of selected items.

- Bumper pattern: support bumping inside scrolling containers.

- Checked flag pattern: fix initialisation of radio buttons. Pre-checked
  radio buttons would not marked as such if there were unchecked radio
  buttons later in the DOM.

- Checklist pattern: correctly initialise the state on initial page view.

- Inject pattern: do not try to rebase ``mailto:`` URLs.

- Modal pattern:

  - Add a new ``closing`` option. This allows configuring how a modal can be
    closed.
  - Various positioning improvements.


- Sortable pattern: add a new ``selector`` option to specify which elements
  to sort. This makes it possible to use the pattern outside lists.

- Switch pattern: prevent default action when a link is clicked.

- Tooltip pattern:

  - Correctly handle a button with ``close-panel`` class in AJAX-loaded tooltip
    content. This fixes fixes [ticket
    356](https://github.com/Patternslib/Patterns/issues/356).

  - Add new ``target`` option to specify where to insert a tooltip in the DOM.

  - Update the tooltip position of a parent is scrolled.


## 1.5.0 - January 22, 2014

- Add a new [stacks pattern](demo/stacks/index.html).

- [Tooltip pattern:](demo/tooltip/index.html): Add a new `ajax-data-type`
  option that makes it possible to use markdown content as AJAX source.

- Update Makefile to install npm modules as needed. This makes it
  possible to completely bootstrap and build Patterns using make
  from a clean git clone.

- [Checked flag pattern](demo/checkedflag/index.html): make sure the fieldset
  classes are updated correctly when changing the radio button selection. This
  fixes [ticket 348](https://github.com/Patternslib/Patterns/issues/348).

- [Bumper pattern](demo/bumper/index.html):
  - add new `selector` option to allow overriding which elements must be
    updated.
  - Add new options to specify which classes much be added/removed when
    an item is (un)bumped.

- Depends pattern: also update dependencies on keyup. This makes sure
  actions happen without forcing a user to move focus away after modifying
  a text field.

- Rewrite the [slides pattern](demo/slides/index.html) to use the new
  Patternslib slides library, replacing shower.

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

- Depends pattern: allow dashes in input names and values again. This fixes
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
  [ticket 298](https://github.com/Patternslib/Patterns/issues/298).

- Fix handling of trailing semicolons in the the argument parser. This fixes
  [ticket 295](https://github.com/Patternslib/Patterns/issues/295).

- Internal build-related changes:

  - Stop automatically using the latest CSS and images from jquery.fullcalendar
    and jquery.select2 in our demos to prevent unexpected changes. Instead we
    now use a copy we can update as needed.

  - Rewrite top level makefile:

    - Update the bungles if `packages.json` has changed.
    - Move jshint out to a new `jshint` target. This is automatically invoked
      when running `make check`, but is skipped when you only want to run
      the unittests.

- Modify included HTML pages to use modules instead of bundles. This makes
  development easier by removing the need to always rebuild bundles.

- Add new [slide pattern](demo/slides/index.html).
  (Wichert Akkerman)

- Add new [slideshow builder pattern](demo/slideshow-builder/index.html).
  (Wichert Akkerman)


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
    This broke the handling of autofocus in modals. [Ticket
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

