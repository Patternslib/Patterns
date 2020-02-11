# Changelog

## 4.0.0-dev - unreleased

Features

```

- Navigation:
  - Do not set the ``.navigation-in-path`` class for elenents already marked with ``.current``.
  - Allow configuration of "in path" and "current" classes via ``in-path-class`` and ``current-class`` configuration options.
  - Allow empty ``in-path-class`` which then does not set the in-path class.
  - Allow configuration of ``item-wrapper`` element on which ``in-path-class`` or ``current-class`` are set. Defaults to ``li``.
  - Set current class also on parent item-wrapper if not set.
  - Fix case where current class was not set when not present on load.
  - Set current class also when DOM elements are inserted or removed.
- Add ``utils.getCSSValue`` for retrieving CSS property values for DOM nodes.
- Add configurable scrolling behavior to pat-inject.
- Add ``webpack-visualizer-plugin`` for analyzation of generated bundles.
- Fix ``pat-auto-scale`` not correctly rescaling after fullscreen changes. Fixes #673
- Use node-sass as suggested by https://sass-lang.com/install - the ruby version is deprecated.
- Use ``yarn`` instead of ``npm``.
- Use babel for all files, allowing latest JavaScript features everywhere.
- Add ``pat-fullscreen`` pattern to allow any element to be displayed in fullscreen-mode.
  A second pattern ``pat-fullscreen-close`` which is triggered on ``close-fullscreen`` CSS class allows for closing the fullscreen with custom buttons.
- Runs now on jQuery 3.
- Integrated pat-display-time from https://github.com/ploneintranet/pat-display-time
- Fixed an issue with pat-scroll when placed on an item without a href
- Fixed an issue with pat-autofocus that would set focus on hidden items
- Fixed an issue with pat-inject scroll that would scroll too much (#694)
- Modal: Add example on how to open a modal on a button via a proxy anchor element.

Fixes
~~~~~

- Fix ``pat-auto-suggest`` to not show a placeholder if none is defined. Fixes #675
- Fix ``pat-auto-scale`` not correctly rescaling after fullscreen changes. Fixes #673
- Update build infrastructure and packages.
- Fix heisenbug with pat-scroll on testruns.
- Fix minimum input length default so that you can display select results already on click.


## 3.0.0a5 - unreleased

Features
```

- Added support for a push subsystem using reethinkdb and horizon.
  That allows us to trigger an injection by sending a push_marker to all connected browsers.
  (This is still in an evaluation state)
- pat-forward: understand the trigger auto option

Fixes

```

- pat-date-picker, pat-datetime-picker: Support the `first-day` parameter (#647)
- pat-notification: fix how the close button is rendered (#639)
- pat-modal: remove an handler after the modal is closed (allows for injection inside modals, see #550)
- Enable babel transpiler
- Interim condition to trigger: autoload-visible to abort injection in case the tartget element is no longer present.
- pat-inject: autoload-visible now uses the intersection observer
- Allow clearing a selection if the field is not required


## 3.0.0a1 - unreleased

Breaking Changes
```

+++Big breaking upgrade changing the build system. Read the [version 2 to 3 upgrade guide](./UPGRADE-2-TO-3.md) for details.+++

- Switched fully to npm for package retrieval, deprecating bower (pilz)
- Introduce webpack to create the bundle and deprecate require.js (pilz)
  Read [version 2 to 3 upgrade guide](./UPGRADE-2-TO-3.md) for details.
- Tests are upgraded to Jasmine 2.8.0 syntax
- Testrunner is now karma 1.7
- Coverage reports are generated
- Removed deprecated packages

  - jquery.tinymce
    Very big and unmaintained. We have never advertised it so we don't include it anymore to clean up.
  - requirejs
    No longer required
  - requirejs-text
    No longer required
  - jquery.textchange
    needed for tinymce, not npm compatible, assumed unnecessary as we removed jquery.tinymce
  - Showdown Table
    As of showdown v 1.2.0, table support was moved into core as an opt-in feature making this extension obsolete. See https://github.com/showdownjs/table-extension
  - Showdown Github
    As of showdown v 1.2.0, github support was moved into core as an opt-in feature making this extension obsolete. See https://github.com/showdownjs/github-extension
  - pat-validate
    Has been superceeded by pat-validation and is no longer maintained.
  - pat-checkedflag will go away. Its functionality is duplicated by pat-select and pat-checklist

- pat-inject: Fix autoload visible link inside collapsed elements
- pat-inject: Fix double click on a pat-inject link
- pat-checklist: understand injection
- pat-auto-scale: support more sizing options.
- pat-validation: fix date validation
- pat-switch: after a switch occurs, trigger a resize event (some elements may have been appeared and we might need a redraw)
- fixed path to spectrum-colorpicker
- fixed #512 by also setting the data-option-value attribute
- pat-tooltip: before hiding the tooltip wait for the injection to be triggered. (ale-rt)
- Downgrading jquery to 1.11.0 to preserve a feature check for IE11 which otherwise breaks masonry on SVG files. See https://github.com/quaive/ploneintranet.prototype/issues/547
- Include own modernizr config file and reduce amount of checks included to mainly css ones
- New carousel pattern based on slick carousel (http://kenwheeler.github.io/slick/)
  The old carousel based on anythingslider is still available as pat-carousel-legacy
- upgrade moment.js to 2.19.3 to address security vulnerability
- pat-calendar: Fixed check for categories
- Improve pat-checklist to allow select/deselect on subset of elements
- Extend pat-focus to add `has-value` class, `data-placeholder` and `data-value` attributes.
- Add idle trigger to injection.
- Fixed injection so that urls with data: in them don't get prefixed with a / anymore.
- pat-checklist now uses Sets to collect its siblings, that should make it much faster with large lists of icons.
- pat-carousel gets infinite option
- pat-subform that also have the pat-autosubmit can be submitted pressing enter
- fixed the way how the tab with is calculated in pat-tabs.
- improve pat-autosuggest to display max one selects as select instead of input
- New comparator for depends parser.

## 2.2 - unreleased

- pat-masonry:
  - Re-Layout on `load` events emitted on `img` nodes within the masonry scope.
  - Do not depend on `imagesloaded`.
  - Update masonry to version 4.2.0.
  - Align options with new version:
    - Add options `is-horizontal-order`, `is-percent-position` and `is-resize`.
    - Remove options `visible-style` and `hidden-style`.
    - Add Aliases from v4 (no `is-*`) to v3 names (with `is-` for booleans), while keeping the v3 names. The patternslib parser does boolean casting for `is-*` options.
- pat-datetime-picker: Add new pattern for setting the date and time.
- pat-date-picker: Remove the dependency on `moment-timezone-data` - it's not used and there is no use in a date picker anyways.

## 2.1.2 - Aug. 29, 2017

- pat-modal: Followup fix for the issue where chrome is so quick that a modal is closed before the actual injection call can be sent. Now modals can be closed again. (pilz)

## 2.1.1 - Aug. 28, 2017

Fixes

```

- pat-modal: Only add a panel-header to the first panel-content element within pat-modal, not everyone. Otherwise this may collide with pat-collapsible which also creates a panel-content class further down the DOM (pilz)
- pat-modal: Fix an issue where chrome is so quick that a modal is closed before the actual injection call can be sent.


## 2.1.1 - Aug. 28, 2017

- pat-modal: Only add a panel-header to the first panel-content element within pat-modal, not everyone. Otherwise this may collide with pat-collapsible which also creates a panel-content class further down the DOM (pilz)
- pat-modal: Fix an issue where chrome is so quick that a modal is closed before the actual injection call can be sent.

## 2.1.0 - Jun. 26, 2017

- pat-gallery: Also include the node with the ``pat-gallery`` class trigger for initializing the gallery.
  Now ``pat-gallery`` can be used on anchor tags wrapping images directly, making it possible to let images be opened individually in in the overlay without adding them to a gallery with navigation controls to the next image.
- fix input-change-events for <input type="number" />
- pat-autosubmit: allow nested autosubmitting subforms with different delays.
- pat-masonry: Initialize masonry just before layouting gets startet, which is after first image has been loaded or at loading has finished. This avoids overlapping images while they are still being loaded.
- pat-masonry: fix layout of nested .pat-masonry elements
- pat-gallery: UX improvements - do not close on scroll or pinch.
- pat-gallery: UX improvements - remove scrollbars when gallery is opened.
- pat-gallery: add option ``item-selector`` for gallery items, which are added to the gallery.
  Defaults to ``a``.
  Fixes situations, when gallery items and normal links are mixed within the same container and normal links would open within the gallery lightbox.
- Update to jQuery 1.11.3.
- While images are loading, already do masonry layouting.
- Remove the ``clear-imagesloaded-cache`` trigger, as cache functionality was removed from imagesloaded from version 3.2.0.
  See: https://github.com/desandro/imagesloaded/issues/103#issuecomment-152152568
- Change ``imagesloaded`` from usage of jQuery plugin to vanilla JavaScript to avoid timing errors, where the ``imagesloaded`` plugin wasn't available.
- Update ``masonry`` and ``imagesloaded`` plugins.
- Fix ``pat-gallery`` to work with ``requirejs-text`` instead ``requirejs-tpl-jcbrand``.
  Fixes an obscure "window undefined" error.
  Backwards incompatible change: The ``photoswipe-template`` RequireJS configuration variable is removed and a the ``pat-gallery-url`` variable is defined instead.
- always recalculate masonry also at the very end, even if there are no images to be loaded
- Fix a bug in pat-scroll that would only properly leave nav items alone if their urls end in a slash
- An href can also contain a url left of the hashmark. pat-scroll should only care for the part right of the hashmark
- Issue a delayed redraw of the calendar to prevent rendering race conditions
- make list of calendar categories unique to speed up js processing on sites with many calendars.

## 2.0.14 - Aug. 15, 2016

- A fix for pat-scroll to scroll up to current scroll container instead of body.
- A fix for pat-scroll to await loading of all images before determining the amount to scroll up.
- A fix for IE10/11 where the modal wouldn`t close anymore due to activeElement being undefined
- Allow to configure different data-pat-inject per formaction, so that different targets can be configured per formaction

## 2.0.13 - Apr. 27, 2016

- New property for sortable pattern, `drag-class`, the CSS class to apply to item being dragged. Is `"dragged"` by default.
- New property for sortable pattern, `drop`, a Javascript callback function to be called when an item is dropped.
- Form with pat-autosubmit doesn't get notified when injected inputs change.
- Inject pattern with `autoload-visible` injected erroneously based upon old autoload element no longer in DOM.
- Add the class `modal-active` to the `body` element whenever a modal is in the DOM.
- New pattern: `pat-tabs`. See the relevant documentation.
- Bugfix: `pat-validation` still validates removed clones from `pat-clone`.
- Let the next-href option of pat-inject work as advertised.
- Parser fix: don't treat `&amp;` as a separator
- #436 Remove `pat-bumper` restriction that scroll container must be the direct parent.
- pat-masonry fix: the `containerStyle` value must be an object.

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
```
