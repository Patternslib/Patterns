# Changelog

See the [history](./docs/history/index.md) for older changelog entries.



## [9.10.3](https://github.com/Patternslib/patterns/compare/9.10.2...9.10.3) (2025-07-04)


### Maintenance


* **Build:** Upgrade pat-tiptap to 4.10.1 plus a few others. ([dc6ef25](https://github.com/Patternslib/patterns/commit/dc6ef2514594a59a5b76c5fbdbbc662110c55698))


* **pat-validation:** Improving the documentation. ([9050a49](https://github.com/Patternslib/patterns/commit/9050a49f887257e3da349e1c982f3a6a53f8d06f))


* **pat-validation:** Minor code cleanup. ([b09eb26](https://github.com/Patternslib/patterns/commit/b09eb26b0117d9a02b1408b7f7e27214f17cdf51))


* **pat-validation:** Remove error-template BBB parameter which has no functionality. ([8354615](https://github.com/Patternslib/patterns/commit/8354615de0e15971ba219ca9edf711f77578bf83))


* **pat-validation:** Restructure tests. ([86efb02](https://github.com/Patternslib/patterns/commit/86efb02235c68d31488f39440c38d8134ceac403))


* Remove remaining console.log statements. ([3d1c0d4](https://github.com/Patternslib/patterns/commit/3d1c0d43fd5cc637ee4b71a5f1cda455e2f4ee3c))


* Update the compatible node version to the current LTS version. ([2dfae89](https://github.com/Patternslib/patterns/commit/2dfae8965e8f9e9da6929a574acdbaf6ad62e2af))

## [9.10.2](https://github.com/Patternslib/patterns/compare/9.10.1...9.10.2) (2025-05-08)


### Bug Fixes


* Fix SASS at-use import paths from node_modules. ([57ee457](https://github.com/Patternslib/patterns/commit/57ee457eb80a0ee1a5041b084ecd2c04aecd50d5))

  When using Patternslib in another project the relative node_module at-use rule imports might fail.

This is now fixed as follows:

- For the css Makefile compile target, define node_modules as load-path.
- For the webpack compiler, the node_modules directory is already defined as load-path.
- Change the at-use import in scss files for the defined node_modules import path.



### Technical Changes


* **core basepattern:** Provide emit_update helper method on pattern instances to easily emit a pat-update event and already fill the most important properties. Expects an optional action parameter and an optional options object. ([1e07f97](https://github.com/Patternslib/patterns/commit/1e07f976d1c62762e9e541e3b80f00e06e041a73))


* **core events:** Add pat-update event factory which initializes itself with options and bubbles up. ([d95a71f](https://github.com/Patternslib/patterns/commit/d95a71f15be4a9ddbc6fd5c07291a9acca127d87))


* **pat-validation:** Emit pat-update events with actions invalid and valid after validation checks on inputs. ([2c15de1](https://github.com/Patternslib/patterns/commit/2c15de14364508c1b9c817ec3bc9ebda387c96f6))



### Maintenance


* **pat-date-picker:** Remove obsolete library comparison section from docs and fix Markdown headers. ([813c0f8](https://github.com/Patternslib/patterns/commit/813c0f83835fdda19629bb247e346ae965fb9a4b))


* **pat-datetime-picker:** Remove obsolete library comparison section from docs and fix Markdown headers. ([0afe106](https://github.com/Patternslib/patterns/commit/0afe10695afa5209ccc237d000c0ab9106796b4e))


* **pat-validation:** Comment for clarity. ([e1c3b59](https://github.com/Patternslib/patterns/commit/e1c3b595a09786971cf2bf59fc5071324ff173af))


* **pat-validation:** Rename set_validity to set_error, which better suites the functionality. ([3ce4e4a](https://github.com/Patternslib/patterns/commit/3ce4e4a42fcc0ac879b06a327119cacee46c8e50))


* Upgrade @patternslib/dev to 3.8.0. ([a97b1f1](https://github.com/Patternslib/patterns/commit/a97b1f1ff5ab12c9168380df8d70dab6defabbc7))


* Upgrade @patternslib/dev to 3.8.1. ([74ae473](https://github.com/Patternslib/patterns/commit/74ae473aa54f7baca9e2a746fda303c3f0880e49))

## [9.10.1](https://github.com/Patternslib/patterns/compare/9.10.1-beta.3...9.10.1) (2025-05-06)

## [9.10.1](https://github.com/Patternslib/patterns/compare/9.10.1-beta.3...9.10.1) (2025-05-06)

## [9.10.1-beta.3](https://github.com/Patternslib/patterns/compare/9.10.1-beta.2...9.10.1-beta.3) (2025-04-06)


### Features


* **core polyfills:** Add polyfill for navigation API. ([b9c328f](https://github.com/Patternslib/patterns/commit/b9c328f475573cc911a6b9e347366803d98bad96))

  This polyfill adds support for the "navigate" event on the navigation
object. We path "history.pushState" and "history.replaceState" to send
the "navigate" event on the "window.navigation" object when the URL
changes.

This polyfill is for current Firefox and Safari. Chrome based browsers
already support this.

More information on:
https://developer.mozilla.org/en-US/docs/Web/API/Navigation/navigate_event


* **core registry:** Allow to disable individual patterns via a global window.__patternslib_patterns_blacklist array. ([2d04c6c](https://github.com/Patternslib/patterns/commit/2d04c6cc3850a46026bcd3eae5a6b32a12678870))


* **pat-ajax:** Pass the URL to the pat-ajax-success event payload. ([faa0209](https://github.com/Patternslib/patterns/commit/faa020923942d8e7f1df132fb307b8299d8e2fb3))

  This allows to use the URL in an event handler for certain actions.



### Bug Fixes


* **pat-inject:** Fix problem with inserting table rows. ([2e70a13](https://github.com/Patternslib/patterns/commit/2e70a130ee5d5c1a31064fb9100eba74dc8374f6))

  There was a problem with injecting table rows introduced in: b0f94fb058a7067e19bc9c3101a11dfa49ff8dd2
The problem occured when setting a table row as content of a temporary
<div> wrapper. But a <tr> is not a valid child node of a <div>. This
caused visually destroyed tables.

Using a <template> tag as wrapper instead of a div solved the problem.


* Remove also the previously removed polyfills-loader from the webpack config. ([f532648](https://github.com/Patternslib/patterns/commit/f532648308ced867938d4546aa56e4303c5476f9))


* **styles:** Fix relative import path of SASS files. ([6a28f02](https://github.com/Patternslib/patterns/commit/6a28f02529ce1aac89d03dfb46d2d0e89cd78f30))

  The SASS docs suggest to use real relative imports - we don't have a load-path definition here.
sass-migrator also wouldn't migrate with this kind of imports.


* **styles:** Fix SASS nesting warnings. ([75701d7](https://github.com/Patternslib/patterns/commit/75701d724f810bfd93dc80c473e4b2d76fb50ea7))


* **styles:** Migrate using sass-migrator module. ([1bab49d](https://github.com/Patternslib/patterns/commit/1bab49dab3d1a1957e9eb3c2fc5c414f439480bd))



### Maintenance


* @patternslib/dev upgrade - Adapt Makefile. ([1d2877d](https://github.com/Patternslib/patterns/commit/1d2877d8e34aeabd72258be18c213812990e7042))


* @patternslib/dev upgrade - create eslint.config.js. ([e31f9d6](https://github.com/Patternslib/patterns/commit/e31f9d67e41c0fddf499768472b98e27037c2e12))


* @patternslib/dev upgrade - remove .husky directory in favor of git hooks. ([61094b8](https://github.com/Patternslib/patterns/commit/61094b8e7a0b09fa75014119ed19ec1cda5bb889))


* @patternslib/dev upgrade - remove old .eslintrc.js. ([3eceed2](https://github.com/Patternslib/patterns/commit/3eceed26fd6605c5e00bb11f42eebe9afb1ca0f5))


* Document patternslib global variables. ([25dab59](https://github.com/Patternslib/patterns/commit/25dab598352c9bba6fd3f416938925b740ce0e83))


* Early exit the SubmitEvent.submitter polyfill, if it is already available. ([93841ba](https://github.com/Patternslib/patterns/commit/93841bae6ec23f0c2b6eebbe1e0d5444791f699d))


* Fix eslint errors. ([1d13a7d](https://github.com/Patternslib/patterns/commit/1d13a7d1e0c7974901b3198266c073dd137eee4a))


* Remove the polyfills-loader script. ([6fee709](https://github.com/Patternslib/patterns/commit/6fee70943aee3d2d963c7b5765ca5de5684282dc))

  The few necessary polyfills are now loaded by Patternslib itself.
This script was empty and is now removed.


* Remove the public path helper script. ([20dd150](https://github.com/Patternslib/patterns/commit/20dd150319f45b4153830119cc874212e6584e3f))

  The public path helper script did set the webpack public path to find
the path where the bundle was located and to correctly find the chunk
directory. The logic was based on finding the URL of the last loaded
script. This was not even always correct.

It was also possible to override it via `window.__patternslib_public_path__`.

Since quite some thime, this is not necessary anymore as webpack handles
these path issues on it's own.

This dead code is now removed.


* Upgrade @patternslib/dev. ([ea2711e](https://github.com/Patternslib/patterns/commit/ea2711ee8b47da626263a850ff4e78bf9aca9f6c))


* Upgrade dependencies. ([2ed29fc](https://github.com/Patternslib/patterns/commit/2ed29fc079566cf9d508b25e6a3ecfbc07ebd702))

## [9.10.1-beta.2](https://github.com/Patternslib/patterns/compare/9.10.1-beta.1...9.10.1-beta.2) (2025-02-04)


### Bug Fixes


* **pat-checklist:** Dispatch input event along change event. ([3c298f5](https://github.com/Patternslib/patterns/commit/3c298f58d179f7d67aba22274771a99219de80ec))

  pat-depends was not reacting on pat-checklist toggles.
This is fixed by dispatching an input event just after the change event.


* **pat-inject:** Fix error when no title is found. ([3718361](https://github.com/Patternslib/patterns/commit/37183618a9a874960b8eee542189305b5753d730))



### Maintenance


* **pat-inject:** Minor code optimization. ([6c9ad2d](https://github.com/Patternslib/patterns/commit/6c9ad2df0c42155013dbe9536016abe3d6505b30))

## [9.10.1-beta.1](https://github.com/Patternslib/patterns/compare/9.10.1-beta.0...9.10.1-beta.1) (2025-01-31)


### Bug Fixes


* **pat-navigation:** Fix case where no click anchor could be found. ([fcb349f](https://github.com/Patternslib/patterns/commit/fcb349fb73bdb32d2f540c240266bfc603883571))

## [9.10.1-beta.0](https://github.com/Patternslib/patterns/compare/9.10.1-alpha.5...9.10.1-beta.0) (2025-01-31)


### Features


* **core dom:** Add method is_button. ([132e42b](https://github.com/Patternslib/patterns/commit/132e42bbb84784f1ab7cd3e897c90ed5e368c666))

  dom.is_button tests, if an element is a button like element.
Button like elements are the following:

    button,
    button[type=button],
    button[type=submit],
    input[type=image],
    input[type=button],
    input[type=reset],
    input[type=submit]



### Bug Fixes


* **pat-depends:** Fix infinite loop situations. ([af5ecc5](https://github.com/Patternslib/patterns/commit/af5ecc55b7a9c9fd6a01f0d3ca717d26cbd37ff7))

  Fix some situations where infinite loops were created of unnecessary
function calls were done:

- Do not en/disable already en/disabled inputs.
- Do not trigger and pat-depends element if the input is the element
  itself and not a contained sub-input.
- Do not trigger input events on button-like elements.



### Maintenance


* Add deprecation notice for Modernizr. ([cd84cc7](https://github.com/Patternslib/patterns/commit/cd84cc7c0f05e5c41ae4a642d402eef958cf11a2))

  Modernizr will be removed in an upcoming minor version. It is not really
necessary anymore. Most browser support almost latest web technology and IE is
dead.
A no-js class on the body will still be replaced with a js class.

## [9.10.1-alpha.5](https://github.com/Patternslib/patterns/compare/9.10.1-alpha.4...9.10.1-alpha.5) (2025-01-28)


### Bug Fixes


* **core feature-detection:** Fix loading of modernizr script. ([c110df8](https://github.com/Patternslib/patterns/commit/c110df8e09c49cdb69a2da390eae0133b188e81f))

  In some situations loading of the modernizr.min.js script failed because
the base url could be incorrect. That is fixed with a non-IE compatible
method of getting the current's script URL, which is safe to use.
The problem surfaced in Plone while loading the Patternslib library and
in between the protect.js script was loaded. The base url was calculated
for the protect.js script and the modernizr script could not be loaded.


* **core registry:** Do nothing with Patterns without a trigger. ([0e49193](https://github.com/Patternslib/patterns/commit/0e491938c56a84a46cbd04883bce2027843c0df1))

  Patterns without a trigger broke the registry scan method. Now they don't.



### Maintenance


* **core log:** Console.debug is not deprecated. Just use it. ([514e7ff](https://github.com/Patternslib/patterns/commit/514e7ffad98220c307fdfdf0dbb74a052fd388fa))

## [9.10.1-alpha.4](https://github.com/Patternslib/patterns/compare/9.10.1-alpha.3...9.10.1-alpha.4) (2025-01-22)


### Bug Fixes


* **pat-depends:** Listen and dispatch input instead of change events. ([307a336](https://github.com/Patternslib/patterns/commit/307a3366a9c1cdd1991c9126c629e19839cc2d14))

  This is a better and more standard compliant combination than listening on
input and keyup events. This fixes a problem where a pat-autosuggest selection
field didn't provoke a change in a pat-depends dependent element.

## [9.10.1-alpha.3](https://github.com/Patternslib/patterns/compare/9.10.1-alpha.2...9.10.1-alpha.3) (2025-01-20)


### Bug Fixes


* **pat-inject:** Fix a problem with injections without a target which was introduced in 9.10.1-alpha.0. ([9030ba5](https://github.com/Patternslib/patterns/commit/9030ba5ea90ee68db61073f7841462b1e0e502ef))


* **pat-inject:** Re-enable support for multiple source matches. ([07a244f](https://github.com/Patternslib/patterns/commit/07a244f121d6651afe0936bb7cb1b7d846e68602))



### Maintenance


* **pat-inject:** Test automatic title insertion in history record mode. ([fcd87d4](https://github.com/Patternslib/patterns/commit/fcd87d4884ebc988e935a9b9b68155ea6ea8811c))

## [9.10.1-alpha.2](https://github.com/Patternslib/patterns/compare/9.10.1-alpha.1...9.10.1-alpha.2) (2025-01-15)


### Maintenance


* **Dependencies:** Upgrade pat-content-mirror to 4.0.1. ([eab2eb9](https://github.com/Patternslib/patterns/commit/eab2eb9a17bed31b644b85310bcf20d1e6b12c36))

## [9.10.1-alpha.1](https://github.com/Patternslib/patterns/compare/9.10.1-alpha.0...9.10.1-alpha.1) (2025-01-15)


### Maintenance


* **Dependencies:** Upgrade pat-content-mirror to 4.0.0. ([04e4816](https://github.com/Patternslib/patterns/commit/04e48160482d32f2b1c809a670d821acee2fcde8))

## [9.10.1-alpha.0](https://github.com/Patternslib/patterns/compare/9.10.0-alpha.1...9.10.1-alpha.0) (2025-01-14)


### Features


* **pat-auto-suggest:** Enable caching. ([154890b](https://github.com/Patternslib/patterns/commit/154890b055225f8bc95c5769bccb9a67ee402b83))



### Bug Fixes


* **core dom:** Do not break querySelectorAllAndMe, if passed element is not a real element but something like a text node. ([1b19844](https://github.com/Patternslib/patterns/commit/1b19844cd907fa0ebb47ee003cd0d161ed14ee2b))


* **pat-autosuggest:** For ajax queries, include the index parameter only if it is set. ([85da6a5](https://github.com/Patternslib/patterns/commit/85da6a5799597422fd7a090960bd3fc799254f1e))



### Maintenance


* **core registry:** Simplify pattern scanning filter. ([43c7255](https://github.com/Patternslib/patterns/commit/43c72555d117933e86713f4da7ee722ea8bf0c66))

  Reduce the number of DOM search tests while not changing the behavior.
Less rules means more speed.


* **pat inject:** Modernize some parts of pat inject. ([b0f94fb](https://github.com/Patternslib/patterns/commit/b0f94fb058a7067e19bc9c3101a11dfa49ff8dd2))


* **pat-inject:** Use create_uuid for generating the temporary autoload uuid and remove it again afterwards. ([8a3af53](https://github.com/Patternslib/patterns/commit/8a3af538654c7b6919d5e0b84b22a0603fa7a0b1))

## [9.10.0-alpha.1](https://github.com/Patternslib/patterns/compare/9.10.0-alpha.0...9.10.0-alpha.1) (2025-01-09)


### Features


* **core dom:** Add document_ready function which ensures callbacks to be run when or after the DOM has been loaded. ([1bbb837](https://github.com/Patternslib/patterns/commit/1bbb837183895033360c5cb1524991ebd287443f))



### Bug Fixes


* **pat-inject:** Fix pat-inject to not break complex JSON pattern options. ([c3e4a68](https://github.com/Patternslib/patterns/commit/c3e4a6812ec6f8ba9ca751dc5e5cea7591626948))

  Rework the html rebasing to fix up relative URLs in pat-inject for a
simpler and slightly more efficient method to walk over all attributes
which need rebasing.
The old method could destroy complex JSON based pattern options, like
those from pat-structure in Mockup.

Note: Only one rebase attribute per tag is currently possible. 1) This
is the same as before. 2) We don't need more.



### Maintenance


* **Build:** Explicitly set the dev server port to 3001 and fix the documentation which was wrong about it. ([3882272](https://github.com/Patternslib/patterns/commit/3882272eccc8465d27d2424ef499d3e97cde6cb4))


* **Build:** Restrict development server watcher only for files in the src directory. ([758f7aa](https://github.com/Patternslib/patterns/commit/758f7aa8c0458d2d0e9d3aa3568d13d10e81c9b7))

  This reduces the number of necessary file watchers and saves important system resources.


* **core registry:** Use dom.document_ready instead of jQuery aequivalent. ([c73b0e1](https://github.com/Patternslib/patterns/commit/c73b0e1caf7848f8b208c00aa91516fcc387a9e2))


* **core uuid:** Extend with documentation and test from thet-own-needs with similar changes. ([69ea565](https://github.com/Patternslib/patterns/commit/69ea56536ece83c1e8fab5c4b33d58b040cdd0a5))


* **Docs:** Minor typo in module federation document. ([fadd5d4](https://github.com/Patternslib/patterns/commit/fadd5d4d8be573536049db200dab05b95d1d0109))


* **pat-markdown:** Use dom.document_ready instead of jQuery aequivalent. ([e8c8b4b](https://github.com/Patternslib/patterns/commit/e8c8b4b530e0c99d1e484ca7c8aa94ec108487ff))


* Upgrade dependencies. ([be61ac5](https://github.com/Patternslib/patterns/commit/be61ac5bb452db8a36dfbc727d292ec84281e6ed))

## [9.10.0-alpha.0](https://github.com/Patternslib/patterns/compare/9.9.16...9.10.0-alpha.0) (2025-01-06)


### Features


* **core basepattern:** Assign each pattern a UUID. ([c142214](https://github.com/Patternslib/patterns/commit/c14221498693bda204f14a7f4baeccd2f77509df))


* **core dom:** Add find_inputs to find all inputs in a node tree, including the node itself. ([db271ce](https://github.com/Patternslib/patterns/commit/db271ce9265c3c020fa6a237984178c92cd7995b))


* **core uuid:** Add utility function to generate a uuid. ([8b70876](https://github.com/Patternslib/patterns/commit/8b70876f7c132d521a3c9b591ba75a94442363be))


* **pat-autosuggest:** Add batching support for AJAX requests. ([1323eaa](https://github.com/Patternslib/patterns/commit/1323eaa4c472a6eff3e3d42096f9fd1e61b6ea48))

  This PR introduces three new options for that:
max-initial-size: Defines the batch size for the initial request (default: 10).
ajax-batch-size: Defines the batch size for subsequent requests (default: 10).
ajax-timeout: Defines the timeout in milliseconds before a AJAX request is submitted. (default: 400).

Ref: scrum-1638


* **pat-date-picker:** Cache the ajax call to retrieve i18n picker translations. ([9050ddc](https://github.com/Patternslib/patterns/commit/9050ddcdb112db324b8b55df0cde0dc648506a46))



### Bug Fixes


* **lib dependshandler:** Do not return the value from an disabled input. Return null instead. ([430167b](https://github.com/Patternslib/patterns/commit/430167bf7cc881eea2bd20d7df3d98df825ce4bf))


* **pat-depends:** Enable/Disable all inputs of a subtree, if a parent is a dependend. ([0bbe3f4](https://github.com/Patternslib/patterns/commit/0bbe3f40ee6e6bff3af6a3406f3951e49bfa6fd6))


* **pat-depends:** Support updating for sub-pat-depends when the parent state is changed. ([9abf534](https://github.com/Patternslib/patterns/commit/9abf534c82d149d5c59349bc7226c501d242f7ba))


* **pat-inject:** Allow to submit invalid forms when form/novalidate. ([993d27d](https://github.com/Patternslib/patterns/commit/993d27db6ba7e3d9c2f2713b46e64c2e82599632))

  Respect the form[novalidate] and button[formnovalidate] attributes and
allow the submission of invalid forms.
This is necessary if a cancel button is a submit button and needs to be
allowed to submit even if the form input is invalid.



### Maintenance


* **lib dependshandler:** Modernize code. ([4c1650f](https://github.com/Patternslib/patterns/commit/4c1650f00ce0cd18cb48a95c19a68372cdc4ecf3))


* **pat-datepicker:** Fix ESLint warning. ([4a10d4b](https://github.com/Patternslib/patterns/commit/4a10d4bc7217d477da2b1ba6997699c4f611b260))


* **pat-depends:** Rework to class based pattern. ([c83bb0a](https://github.com/Patternslib/patterns/commit/c83bb0af71b50e44c097ea7220fcfd8a3ffb77eb))


* Remove obsolete src/lib/README.txt. ([70ee738](https://github.com/Patternslib/patterns/commit/70ee7389a3aab7601d5347c919821252b23f5969))

## [9.9.16](https://github.com/Patternslib/patterns/compare/9.9.15...9.9.16) (2024-08-21)


### Maintenance


* Update dependencies with newer patch-level versions. ([118f031](https://github.com/Patternslib/patterns/commit/118f03143042487b1835a472cb29c379460993d2))

## [9.9.15](https://github.com/Patternslib/patterns/compare/9.9.14...9.9.15) (2024-08-20)


### Bug Fixes


* **pat-tiptap:** Upgrade pat-tiptap to 4.9.4 to fix a problem with adding colums to tables. ([5a0281e](https://github.com/Patternslib/patterns/commit/5a0281e16dfed78c264eac5d73d9d5be119be1e4))

## [9.9.14](https://github.com/Patternslib/patterns/compare/9.9.13...9.9.14) (2024-08-19)


### Bug Fixes


* **core dom:** Avoid circular imports. ([962d5f2](https://github.com/Patternslib/patterns/commit/962d5f275c577beff0bd3cd7eccea376a117dcbb))

  Remove BBB export "add_event_listener" and "remove_event_listener" to avoid circular imports.
This fixes a test-run problem in pat-tiptap and was long overdue anyways.

## [9.9.13](https://github.com/Patternslib/patterns/compare/9.9.12...9.9.13) (2024-08-19)


### Bug Fixes


* **Build:** Apply "npm pkg fix" to correct the repository URL. ([cfec736](https://github.com/Patternslib/patterns/commit/cfec7360ed2026e07f037dca92ed56d0232f7fa7))


* Fix reference to 3rd party styles in stylesheets. ([d00253d](https://github.com/Patternslib/patterns/commit/d00253df839fbb4b2f774992c0c3df8ab7b757a9))

  Since latest scss build tools which became available in
`@patternslib/dev` version 3.6 references to `node_modules` need to be
left out. The build tool searches in node_modules anyways. This is now
fixed.


* **pat-carousel:** Fix SASS compilation warnings. ([e4e2dae](https://github.com/Patternslib/patterns/commit/e4e2daea38c59740a8e0a72b40c9772c65d549fe))

  Upgrade to a version of slick.js where the compilation warnings are fixed.


* **pat-inject:** Fix failing test. ([1472b06](https://github.com/Patternslib/patterns/commit/1472b0635820c97d376846910dcfe1cdf0c36328))

  Recent Jest/jsDOM stopped working with uppercase tag selectors.
This is now fixed without making compromises to production code, as the
new result is more readable.



### Maintenance


* **pat-inject:** Fix some test method names. ([e9a5257](https://github.com/Patternslib/patterns/commit/e9a52571be5c12b394600e48d164a2fb802d5481))


* **pat-inject:** Rework `_rebaseHTML` to non-JQuery code as preparation to fix a failing test with recent @patternslib/dev. ([df710a2](https://github.com/Patternslib/patterns/commit/df710a20a15d7a9b26ee6411a9b463e791b7f386))


* Update GitHub Actions workflow. ([a413e26](https://github.com/Patternslib/patterns/commit/a413e2649f0c19ae1bea791ef7c8241f00b92b18))


* Upgrade devDependencies. ([bda3cf1](https://github.com/Patternslib/patterns/commit/bda3cf13dbbf4c597dc8e8a70c3a8b584a473163))

## [9.9.12](https://github.com/Patternslib/patterns/compare/9.9.11...9.9.12) (2024-07-23)

* Include fix for pat-tiptap table handling

## [9.9.11](https://github.com/Patternslib/patterns/compare/9.9.10...9.9.11) (2024-07-23)

* empty release

## [9.9.10](https://github.com/Patternslib/patterns/compare/9.9.10-alpha.4...9.9.10) (2023-11-27)

## [9.9.10-alpha.4](https://github.com/Patternslib/patterns/compare/9.9.10-alpha.3...9.9.10-alpha.4) (2023-11-23)


### Features


* Upgrade dependencies. ([a896a80](https://github.com/Patternslib/patterns/commit/a896a80d07d5bc471fd5495aacb56496d0e64edb))



### Bug Fixes


* Upgrade node version for GitHub Actions. ([1cf4d6a](https://github.com/Patternslib/patterns/commit/1cf4d6a620ac361b99bbf7c2d13f6b4da4d96694))

## [9.9.10-alpha.3](https://github.com/Patternslib/patterns/compare/9.9.10-alpha.2...9.9.10-alpha.3) (2023-11-17)


### Bug Fixes


* **core dom find_form, pat autosubmit:** Add support for pat-subform. ([bd19154](https://github.com/Patternslib/patterns/commit/bd191548992aa04ececadf750b08e1821617540a))

  Subform was recently lost when introducing dom.find_form.
Now subform support is back in pat-autosubmit.


* **pat subform:** Correctly unregister the submit event on Pattern destroy. ([8252014](https://github.com/Patternslib/patterns/commit/8252014a8bfc2f8da0a1e18b4b930e2abd3ed51b))



### Maintenance


* **pat subform:** Modernize code. ([dc7c0ff](https://github.com/Patternslib/patterns/commit/dc7c0ff59974736846f8dd56ac88d04eca42244b))

## [9.9.10-alpha.2](https://github.com/Patternslib/patterns/compare/9.9.10-alpha.1...9.9.10-alpha.2) (2023-11-10)


### Maintenance


* **pat autosubmit:** Improve the code to find the related form for an input. ([445fe69](https://github.com/Patternslib/patterns/commit/445fe692abc9d3eb267f82e97e4bc9778d072155))

## [9.9.10-alpha.1](https://github.com/Patternslib/patterns/compare/9.9.10-alpha.0...9.9.10-alpha.1) (2023-11-09)


### Features


* **core dom:** find_form - find a related form element. ([01b348d](https://github.com/Patternslib/patterns/commit/01b348db79381d0d9c3901ed48ddb531dccced3c))

  Add a function to find a related form element. If called on any element
it would first try to get a input element and get it's associated form -
which can be different and as a last resort to find the element's
enclosing form. Otherwise return undefined.



### Bug Fixes


* **pat autosubmit:** Re-add support for autosubmit on non form elements. ([a2530f3](https://github.com/Patternslib/patterns/commit/a2530f3e4cd57943c3109e3ef5be58278f1252bb))

  Fix a problem introduces in Patternslib 9.9.7 where pat-autosubmit did
not work when not defined on a form or input element.

As a side effect, the submit event is now always invoked on the related
or nearest form of the element where pat-autosubmit was defined on. If
that element is not a form element a related (input.form) or the nearest
parent form is searched and the submit event invoked upon.



### Maintenance


* **pat autosubmit:** Improve debug messages. ([8c01058](https://github.com/Patternslib/patterns/commit/8c01058eac2bec6f6e5b6f3fd75088b21c845d30))


* **pat inject:** Add more debug messages. ([fddb3b6](https://github.com/Patternslib/patterns/commit/fddb3b6fbe150fb462f71508a7318627e6a2a29e))

## [9.9.10-alpha.0](https://github.com/Patternslib/patterns/compare/9.9.9...9.9.10-alpha.0) (2023-11-08)


### Features


* **core events:** Support the submitter property on submit_event events. ([2e6b7e5](https://github.com/Patternslib/patterns/commit/2e6b7e5949ce3ad23e4ffffa1070f5f598f70ba9))



### Bug Fixes


* **pat autosubmit:** Fix a typo where pat-autosubmit wasn't working for subforms anymore. ([3be0170](https://github.com/Patternslib/patterns/commit/3be0170fb92a44d205b857f0636ba4ea9f1e1ea7))


* **pat autosubmit:** Trigger the submit event with the correct submitter property. ([36c0c36](https://github.com/Patternslib/patterns/commit/36c0c36f1f3feed76510bb6d29762709dbc7e2b1))

  This resp. the previous commit in event.js fixes a problem where the
submitter was the added to the browser automatically and could lead to
incorrect form submission data in combination with pat-ajax. E.g. we had
a case where for a file upload the delete button's value was submitted,
where it shouldn't have.

## [9.9.9](https://github.com/Patternslib/patterns/compare/9.9.8...9.9.9) (2023-11-06)


### Features


* **pat inject:** Support submit buttons with child elements. ([3821ca8](https://github.com/Patternslib/patterns/commit/3821ca8793557ede2e42e20caee7908a9f466b62))

  Send the value of a submit button even if a child element of the submit
button was clicked and not the submit button itself.



### Bug Fixes


* **pat inject:** Fix issue with submit buttons which are added later. ([edf9f5e](https://github.com/Patternslib/patterns/commit/edf9f5e0ca3899a13b5107c19c3bf6fcc376e10b))

  Fix an issue with submit buttons which were added after initialization
of pat-inject which did not send their value (e.g. via a pat-inject call).

Ref: scrum-1670



### Maintenance


* **pat inject:** Restructure pat-inject 9.2 tests. ([981d71f](https://github.com/Patternslib/patterns/commit/981d71ff52afd327ddb5d0796e0c3b9fbc364d9e))


* Upgrade caniuse-lite db. ([8ccdc6d](https://github.com/Patternslib/patterns/commit/8ccdc6d33569e23b8b4977735d157f3cccd168ee))

## [9.9.8](https://github.com/Patternslib/patterns/compare/9.9.7...9.9.8) (2023-10-23)


### Bug Fixes


* **pat-push:** Fix form submits not working with pat-inject. ([09822c5](https://github.com/Patternslib/patterns/commit/09822c5ee25c7195a62f7b6286017ec39cb85812))


* **pat-subform:** Fix subform submits not working with pat-inject. ([79436cb](https://github.com/Patternslib/patterns/commit/79436cb71fcacde80b55caf366a431dd1c428ed7))



### Maintenance


* **pat-ajax:** Use bare JavaScript submit for tests. ([98e4235](https://github.com/Patternslib/patterns/commit/98e423532afd837ef8961f1089039af659dfad63))


* **pat-inject:** Use bare JavaScript submit for tests. ([bec5184](https://github.com/Patternslib/patterns/commit/bec5184ab244d29c9a16152673ce4bb31664bd91))


* **pat-sortable:** Use bare JavaScript submit for tests. ([59bbe4d](https://github.com/Patternslib/patterns/commit/59bbe4dfc38e43e286919b40e4416d748138efd5))

## [9.9.7](https://github.com/Patternslib/patterns/compare/9.9.6...9.9.7) (2023-10-22)


### Features


* **core events:** Add a event factory for a generic bubbling and cancelable event. ([ed6777e](https://github.com/Patternslib/patterns/commit/ed6777e7f477a5fa78195fe682acdb6bcc191310))



### Bug Fixes


* **pat-inject:** Fix problem with pat-autosubmit together with pat-sortable and/or pat-clone. ([2e3d9a2](https://github.com/Patternslib/patterns/commit/2e3d9a20a70a8c27e25ff58a1172b15a35a9279c))


* **pat-inject:** Fix problem with pat-autosubmit. ([8ab6029](https://github.com/Patternslib/patterns/commit/8ab6029e70f498208fe637e025775755f19e268e))

  Fix a problem since Patternslib 9.9.6 where pat-inject didn't work
together with pat-autosubmit.



### Maintenance


* **pat-autosubmit:** Add a test for delayed autosubmit. ([e487ff5](https://github.com/Patternslib/patterns/commit/e487ff5c826de753d3218ee3e40637cca5a05fc0))


* **pat-autosubmit:** Make use of add_event_listener. ([035bd76](https://github.com/Patternslib/patterns/commit/035bd760c75d92d401dbabf1ee2ce486b6583be9))

  This has advantages regarding preventing double registrations and
allowing wildcard removal.


* **pat-autosubmit:** Number the individual test cases. ([9d20ea1](https://github.com/Patternslib/patterns/commit/9d20ea1d53bc6f1e17658dcf3e55997cd5810362))


* **pat-autosubmit:** Simplify the sortable+clone demo example a bit. ([a8b316b](https://github.com/Patternslib/patterns/commit/a8b316b71ce33f565619cf5c50a957c14d9d227b))


* **pat-inject:** Log a warning if inject isn't initialized when pushState isn't available. ([2b897ca](https://github.com/Patternslib/patterns/commit/2b897ca74af6bcc0a7bd2848c8e59fb01dc4f0fa))

## [9.9.6](https://github.com/Patternslib/patterns/compare/9.9.6-alpha.3...9.9.6) (2023-10-20)

## [9.9.6-alpha.3](https://github.com/Patternslib/patterns/compare/9.9.6-alpha.2...9.9.6-alpha.3) (2023-10-16)


### Features


* **core events:** remove_event_listener - support removal by id and all at once. ([2e78439](https://github.com/Patternslib/patterns/commit/2e78439fcac3827ffd7d77811859bdd0b4ba3f9a))

  Previously registered events can now be removed by a matching id with no
element given, like:
remove_event_listener(undefined, "my-event-id");
When called with no parameters like "remove_event_listener()" all
registered events are removed.


* **core events:** remove_event_listener - support wildcard ids. ([b2d0651](https://github.com/Patternslib/patterns/commit/b2d0651a66b0d2e41c1f9da4ea01b22bd95a9d30))

  The id parameter can be a wildcard string, e.g. `test-*-event`, which
would match any event which starts with "test-" and ends with "-event".
The wildcard "*" can be anywhere in the string and also be used multiple
times. If no wildcard is present the search string is used for an exact
match.


* **core utils:** regexp_from_wildcard - Create regular expressions from wildcard strings. ([4cf724a](https://github.com/Patternslib/patterns/commit/4cf724af6eab7d558dce5bec5d6d378033012386))

  This utility can be used for search strings with wildcards like "test-*-xyz".
The wildcard can be at the beginning, somewhere in the middle or at the
end and multiple wildcards can be used.
This method was factored out from removeWildcardClass for broader usage.



### Bug Fixes


* **core events:** Fix references in add_event_listener and remove_event_listener. ([7dd9aff](https://github.com/Patternslib/patterns/commit/7dd9aff5f5e079ab511225e4dd3a04a33c07de36))

  add_event_listener and remove_event_listener did incorrectly use an
object instead of a map to store element references. This is now fixed.


* **core events:** Fixes for remove_event_listener. ([c2caf48](https://github.com/Patternslib/patterns/commit/c2caf4830f7295e6a4962c16f02dbc1f9e1f029c))

  - Fix removing all events on a given element.
- Clean up the event registry after removing events.


* **pat checklist:** Fix incorrect usage of the dispatch method. ([0e6eb01](https://github.com/Patternslib/patterns/commit/0e6eb0180d18d00da7fdd89d4305d901f322ffeb))

  This fixes a performance problem with pat-checklist.


* **pat-inject:** Don't submit forms with invalid data. ([a0fa4d2](https://github.com/Patternslib/patterns/commit/a0fa4d2743ef0d96c2c58ebf2d6d14bd37188859))

  Fix a problem with pat-inject and pat-validation where forms with
invalid data could be submitted and the submit button wasn't inactive.
The problem was fixed in two ways:

- pat-inject now has a check for browser-native form validation. Invalid
  forms would not be submitted.

- pat-inject now waits a tick before it get's initialized. Modern
  BasePattern based patterns including pat-validation are all deferred
  for 1 tick by design. pat-inject, being and older Pattern isn't
  deferred and thus initialized before pat-inject. It's initialized
  before pat-validation even though we have some Pattern initialization
  reorganization code in place - pat-inject not being deferred will have
  it's event handlers always run before any others. But now, with the
  1-tick defer in place, pat-inject's event handlers are run in the
  correct order - after pat-validation form validation which in case of
  an invalid form would also deactivate the submit button.



### Maintenance


* **core utils:** Dispatch - document postpone parameter. ([cd7822c](https://github.com/Patternslib/patterns/commit/cd7822c53ff677ad16977791ad064baa6960a37d))

  Better document the postpone parameter of the dispatch method.


* **pat checklist:** Infinite scrolling example. ([18ac157](https://github.com/Patternslib/patterns/commit/18ac1575b7f0c96ddd943aaba7d70c01b6ef9340))

  Add infinite scrolling example to demonstrate a performance problem
which is solved by in this release.


* **pat checklist:** Use Patternslib event factory. ([e12aaac](https://github.com/Patternslib/patterns/commit/e12aaace66eae8fcb1052ecb10e5e361a819d0aa))

  Use Patternslib core event factory for the change event.


* **pat checklist:** Use Patternslib event listeners. ([69831f3](https://github.com/Patternslib/patterns/commit/69831f34c49e33ee1224c511cb721c45b1a39268))

  Change to Patternslib core event listeners to avoid double registration
and allow better unregistration.

This fixes a performance problem with pat-checklist.


* Upgrade dependencies. ([35bbd9c](https://github.com/Patternslib/patterns/commit/35bbd9cd3e4a16713481bd199b296fce0632843d))

## [9.9.6-alpha.2](https://github.com/Patternslib/patterns/compare/9.9.6-alpha.1...9.9.6-alpha.2) (2023-08-30)


### Maintenance


* Upgrade pat-tiptap with new tiptap version. ([f0c2602](https://github.com/Patternslib/patterns/commit/f0c26023237d00dad2fb25d2be158995dc6a7b61))

## [9.9.6-alpha.1](https://github.com/Patternslib/patterns/compare/9.9.6-alpha.0...9.9.6-alpha.1) (2023-08-30)


### Breaking Changes


* **pat-scroll:** Remove implicit and unpreventable scroll support for pat-stacks. ([92e1e6b](https://github.com/Patternslib/patterns/commit/92e1e6b7f7a0e952ac8831e67c5567e1c6907f24))

  With a pat-scroll as parent of a pat-stacks enabled navigation anchors,
the page would scroll to the target configured for pat-scroll. This
behavior could not be prevented and led to unwanted effects when using
pat-stacks inside pat-collapsible which itself uses pat-scroll when
configured properly.

This commit removes the scrolling support for pat-stacks within
pat-scroll in favor of an explicit and configurable scrolling behavior
in pat-stacks itself.



### Features


* **core dom:** Add dom.element_uuid to get/set an uuid to a DOM node. ([a7e5de1](https://github.com/Patternslib/patterns/commit/a7e5de149178796ce956386b7b76fb5d98ea8c7e))


* **pat stacks:** Add a destroy method to unregister event handlers. ([8479cfa](https://github.com/Patternslib/patterns/commit/8479cfa170a20a863d36b65309c9706f67b33bd9))


* **pat-stacks:** Add configurable scroll support. ([a8aae63](https://github.com/Patternslib/patterns/commit/a8aae6365c79ad22336cb77d711e21e4fcfee05e))

  Add "scroll-selector" and "scroll-offset" arguments to pat-stacks,
likewise as in pat-collapsible. "scroll-selector" accepts a CSS selector
string or the special values "self" to scroll to the element itself and
"none" to block any scrolling behavior from parent pat-stacks configuration
options.

With these configuration options you can control the scrolling behavior
for pat-stacks on a fine-grained level.



### Maintenance


* **pat-stacks:** Adapt code to Patternslib standards. ([2f95379](https://github.com/Patternslib/patterns/commit/2f95379c136d7b21097e9936c0bb3b3d5e21fc23))


* Upgrade dependencies. ([9bd50b8](https://github.com/Patternslib/patterns/commit/9bd50b843fa7370432d4995285eec917ba52234c))

## [9.9.6-alpha.0](https://github.com/Patternslib/patterns/compare/9.9.5...9.9.6-alpha.0) (2023-08-11)


### Bug Fixes


* **pat-ajax:** Support anchors without a href attribute and forms without an action attribute. ([099da3c](https://github.com/Patternslib/patterns/commit/099da3cde9c4e6de790e11680a2c16daa13bb88f))

  The URL can still be set via the data-pat-ajax attribute.
This fixes a problem where pat-inject enabled forms without an action attribute
but a submit button with a formaction attribute would break.


* **pat-inject:** For submit buttons with a formaction, do not call ajax.onClickSubmit twice. ([22d814f](https://github.com/Patternslib/patterns/commit/22d814ff30e99ad8ea59dd4c1b6a87fcab84ca11))


* **pat-inject:** Support submit buttons without a type attribute. ([6882f45](https://github.com/Patternslib/patterns/commit/6882f45b33c9c3a8bbcae525f75bd454e6319b96))



### Maintenance


* **core parser:** Adapt code to Patternslib standards. ([9079a47](https://github.com/Patternslib/patterns/commit/9079a47a55e1f44e6c8abcfca76d5152811f169a))


* **pat-ajax:** Improve the default function from the url argument to not use jQuery. ([bb8ce9d](https://github.com/Patternslib/patterns/commit/bb8ce9d021cc5d026b09a332b63d507c5956c6c4))

## [9.9.5](https://github.com/Patternslib/patterns/compare/9.9.4...9.9.5) (2023-07-28)


### Bug Fixes


* **pat-close-panel:** Do not prevent closing for formnovalidate buttons. ([1272ac5](https://github.com/Patternslib/patterns/commit/1272ac5497a9e7cacf8f9bfe56f6e9cd5642984e))

  Do not prevent closing of panels when a form with invalid data is
submitted when a button with the formnovalidate attribute is pressed.
This is useful for cases where a "cancel" button actually needs to
submit to roll back any changes which were already made.


* **pat-collapsible:** Allow to explicitly clear the scroll selector. ([9c99a2e](https://github.com/Patternslib/patterns/commit/9c99a2ed95e15cfab8541e8defef8ce0d9174e2b))

  In case of nested pat-collapsible elements, child elements inherit the
options from parent elements, including the scroll-selector. If the
child element should do no scrolling, it needs to explicitly be reset.
This can be done by adding th following options to the collapsible data
attribute:
data-pat-collapsible="scroll-selector: none"



### Maintenance


* **Dependencies:** Upgrade dependencies. ([a46de2e](https://github.com/Patternslib/patterns/commit/a46de2e4a8f5ee9ddb497b6c55ea10d0c72beeab))


* **pat-validation:** Improve documentation - based on HTML standards, CSS‌ pseudo classes, formnovalidate buttons. ([daab725](https://github.com/Patternslib/patterns/commit/daab725afaa87f777b4f98da0c82036126964cf1))


## [9.9.4](https://github.com/Patternslib/patterns/compare/9.9.3...9.9.4) (2023-05-29)


### Maintenance


* Upgrade to @patternslib/dev 3.3.5 which fixes an incorrect release-it hook config. ([e909e34](https://github.com/Patternslib/patterns/commit/e909e3451d9039573a8775ff9a62378ab89f6992))


## [9.9.3](https://github.com/Patternslib/patterns/compare/9.9.2...9.9.3) (2023-05-29)


### Maintenance


* Upgrade to @patternslib/dev 3.3.4 ([61b3c56](https://github.com/Patternslib/patterns/commit/61b3c56d00ab76c656a2b56d6441ed209da2578d))

  This fixes the wrong version number comment in the package-included build files.

## [9.9.2](https://github.com/Patternslib/patterns/compare/9.9.1...9.9.2) (2023-05-29)


### Maintenance


* Upgrade to @patternslib/dev 3.3.3 ([35c63df](https://github.com/Patternslib/patterns/commit/35c63dfb0f4d2f7697656658ac134af24c1c8337))

  This fixes a missing build in npm releases.
Now you can again use jsdelivr and unpkg.


## [9.9.1](https://github.com/Patternslib/patterns/compare/9.9.1-alpha.0...9.9.1) (2023-05-23)

## [9.9.1-alpha.0](https://github.com/Patternslib/patterns/compare/9.9.0...9.9.1-alpha.0) (2023-05-23)


### Bug Fixes


* **pat inject:** Second attempt to fix the scrolling behavior, where the scrolling target could not be found. ([829a6a6](https://github.com/Patternslib/patterns/commit/829a6a6abc5f547611e13253608209fc0dcee1ec))

  The original problem fixed in commit 911b8b8660197d44291c7d5a9537bbb496df1a38
for 9.9.0-beta.1 addressed a problem where the scroll target was not a
direct child of the injected content but some levels deeper. But this
fix broke the situation where the scroll target is a direct child of the
injected content. The fix applied here handles both situations.

## [9.9.0](https://github.com/Patternslib/patterns/compare/9.9.0-beta.3...9.9.0) (2023-05-23)


## [9.9.0-beta.3](https://github.com/Patternslib/patterns/compare/9.9.0-beta.2...9.9.0-beta.3) (2023-05-17)


### Features


* **core dom:** Add get_position, scroll_to_element, scroll_to_top and scroll_to_bottom functions. ([0368c48](https://github.com/Patternslib/patterns/commit/0368c487349278488b6b12c8acfe6b2551290e73))

  To help with scrolling tasks and to unify them these methods were
introduced:
- `get_relative_position`: Get the position of an element relative to
  another.
- `scroll_to_element`: Scroll the given scroll_container to a given element.
- `scroll_to_top`: Scroll the container to the top.
- `scroll_to_bottom`: Scroll the container to the bottom.



### Maintenance


* **pat inject:** Use the new scrolling helpers from core.dom. ([89d3ef3](https://github.com/Patternslib/patterns/commit/89d3ef3718f40e98fca940ce6ba3c001abf2eb03))


* **pat scroll:** Use the new scrolling helpers from core.dom. ([f37bc99](https://github.com/Patternslib/patterns/commit/f37bc997afe21a50313ddcca4bb4cae3a1c0681e))

  This fixes also the scrolling position from the previous release which
would have been wrong for many cases where the scrolling target is
within a positioned element.

## [9.9.0-beta.2](https://github.com/Patternslib/patterns/compare/9.9.0-beta.1...9.9.0-beta.2) (2023-05-17)


### Bug Fixes


* **pat scroll:** Fix scroll to position. ([a6d72f3](https://github.com/Patternslib/patterns/commit/a6d72f305bdda8943f7f63a721d6f8c09e71432c))

  The scrolling offset was incorrectly calculated since Patternslib
9.9.0-alpha.5. Fix the calculation for the scrolling position by using
`offsetTop` and `offsetLeft` instead `getBoundingClientRect`.

## [9.9.0-beta.1](https://github.com/Patternslib/patterns/compare/9.9.0-beta.0...9.9.0-beta.1) (2023-05-17)


### Bug Fixes


* **pat display time:** Default to locale-formatted output. ([c77d01a](https://github.com/Patternslib/patterns/commit/c77d01a4fcf592b45bce3950d2dab5b386aa2f0e))

  Default to formatted output according to the current locale.
This fixes a regression since 4.1.0 which came with the date picker's
styled behavior but let display time output an ISO date instead of a
formatted date when not output format was set.


* **pat inject:** Allow to use a scroll container other than the injection target. ([efde472](https://github.com/Patternslib/patterns/commit/efde472b7f286363a90a08a5d3b6ef4f90ea14f1))

  This fixes a problem when the content should scroll to an element which
is within a scroll container below the injection target. Until now the
scroll container could only be a parent of the injection target. Now it
can be a parent of the scroll-target.


* **pat inject:** Fix scrolling behavior, where the scrolling target could not be found. ([911b8b8](https://github.com/Patternslib/patterns/commit/911b8b8660197d44291c7d5a9537bbb496df1a38))


* **pat validation:** Do not disable input elements with formnovalidate. ([f30af14](https://github.com/Patternslib/patterns/commit/f30af1473b4c5b1cfbba62dc53d4a8c363a85783))

  Do not disable input elements with the `formnovalidate` attribute set
when form validation fails.
E.g. a cancel button: `<button formnovalidate>Cancel</button>`.

  Fixes #1132.
closes [#1132](https://github.com/Patternslib/patterns/issues/1132)


### Maintenance


* **pat inject:** Give tests a individual number to allow easier selectively testing individual tests. ([e819b84](https://github.com/Patternslib/patterns/commit/e819b84f0f272ea5d4e118d195e0b8a8355611ef))

## [9.9.0-beta.0](https://github.com/Patternslib/patterns/compare/9.9.0-alpha.5...9.9.0-beta.0) (2023-05-11)


### Bug Fixes


* **pat calendar:** Do not set a Content-Type header when no body is submitted ([89d34c1](https://github.com/Patternslib/patterns/commit/89d34c15fbb84c36a18a67142c678f5d2cacc54a))

  Closes #1156
closes [#1156](https://github.com/Patternslib/patterns/issues/1156)

* **pat navigation:** Fix current marker anchors with child elements. ([8578b1b](https://github.com/Patternslib/patterns/commit/8578b1bad59933cc7e6cc2fcc5685e2cd4fa2a51))

  The links within a pat-navigation structure might have child elements,
e.g. a span within an anchor. In that case the click target is the span
and not the anchor. Apply a fix where a closest anchor of the click
target is searched, which might be the click target itself.



### Maintenance


* Upgrade dependencies. ([c0b107e](https://github.com/Patternslib/patterns/commit/c0b107e87c1e4afeda9d6dac074142dd688d7d94))

## [9.9.0-alpha.5](https://github.com/Patternslib/patterns/compare/9.9.0-alpha.4...9.9.0-alpha.5) (2023-04-21)


### Bug Fixes


* **pat collapsible:** Adapt to changed pat-scroll. ([7211616](https://github.com/Patternslib/patterns/commit/72116164a65792d58e9bdd89d933e110a9580ca8))



### Breaking Changes


* **pat scroll:** Simplify pattern and remove obsolete functionality. ([b62e6e0](https://github.com/Patternslib/patterns/commit/b62e6e0309f385d272fe221168e06145f33ae533))

  Since pat-navigation now supports marking navigation and content items
with CSS classes based on their scroll position this functionality is
removed from pat-scroll. You can still use pat-scroll in combination
with pat-scroll-marker to achieve the same functionality like before.

Also the jQuery based scroll animation is removed as smooth scrolling is
supported by CSS since long.



### Maintenance


* **core utils:** Deprecate elementInViewport in favor of isElementInViewport. ([a9b5035](https://github.com/Patternslib/patterns/commit/a9b5035f5a31c6ce2e7fd3d793ddfd909f59558a))


* **pat scroll:** Update documentation. ([fdb44bf](https://github.com/Patternslib/patterns/commit/fdb44bf7a84e6db27ea13babdcf6c98792398157))


* Upgrade dependencies. ([75acb81](https://github.com/Patternslib/patterns/commit/75acb81ab133f8f735c0492eb45334876de18593))

## [9.9.0-alpha.4](https://github.com/Patternslib/patterns/compare/9.9.0-alpha.3...9.9.0-alpha.4) (2023-04-19)


### Bug Fixes


* **pat navigation:** Change default scroll-trigger-selector to "a[href^='#'].scroll-trigger". ([efc5826](https://github.com/Patternslib/patterns/commit/efc58267815caaf92a8cf1ba370a39880498062e))

  In the alpha.3 release it was "a[href^='#'].scroll-marker" where it
should have been "a[href^='#'].scroll-trigger". This is fixed now.

## [9.9.0-alpha.3](https://github.com/Patternslib/patterns/compare/9.9.0-alpha.2...9.9.0-alpha.3) (2023-04-19)


### Features


* **core utils:** Add is_option_truthy to check Pattern options for a truthy value. ([6a6e9fa](https://github.com/Patternslib/patterns/commit/6a6e9fae0aef9ceb5f71117133a45c3e1a2a0d82))

  A values "undefined", "null", "false", "none" or "" are considered falsy
and can be used to disable some functionality. Other values including
"0" are considered to be true.


* **core utils:** parseLength: handle unitless lengths as pixels. ([15090e3](https://github.com/Patternslib/patterns/commit/15090e3d19b8384042b25dcfb6bb9361283c5044))


* **pat navigation:** Implement scroll-trigger-selector option. ([818c68d](https://github.com/Patternslib/patterns/commit/818c68d175c254b192a909b4e7c8e4770687c681))

  Define the CSS selector which is used to find navigation links with hash
URLs. The default is "a[href^='#'].scroll-marker" which would find all anchor
elements which href starts with a "#" sign and have the class
scroll-marker.
The restriction on scroll-marker allows for other hash-urls in the same
navigation - e.g. a pat-tooltip which references a local content.
If you set it to "none" the scroll marker functionality is not activated.


* **pat scroll-marker:** Implement selector option. ([678aee5](https://github.com/Patternslib/patterns/commit/678aee5d2725cf47085df246536e57d9b4639b62))

  Define the CSS selector which is used to find navigation links with hash
URLs. The default is "a[href^='#']" which would find all anchor elements
which href starts with a "#" sign.



### Bug Fixes


* **pat navigation:** Allow "none" to be a valid option for scroll-item-visibility. ([456e05a](https://github.com/Patternslib/patterns/commit/456e05ac288638a7a631377c6fb886e49e951493))


* **pat navigation:** Rename scroll-marker- options to scroll-item. ([a40fc0f](https://github.com/Patternslib/patterns/commit/a40fc0fb1d0c68c074d9153d8872edc63eeccda7))

  Implement review comments.

This is not listed as "breaking" change because this change on the
scroll-marker feature happens within the alpha phase.


* **pat scroll-marker:** Allow "none" to be a valid option for visibility. ([e506ed2](https://github.com/Patternslib/patterns/commit/e506ed28b7a3c23d2b67c612c1979d260727282e))

## [9.9.0-alpha.2](https://github.com/Patternslib/patterns/compare/9.9.0-alpha.1...9.9.0-alpha.2) (2023-04-18)


### Features


* **core dom:** Add escape_css_id method. ([5aa7a52](https://github.com/Patternslib/patterns/commit/5aa7a52eebc5780c5cc3a831f3161b8475d352a0))

  Get an escaped CSS selector for a given id string.

id selectors should - but don't have to - start with a letter.
If the id starts with a number or a dash, it should be escaped.
This method does that for you.



### Bug Fixes


* **pat navigation:** Do escaping for hash id selectors, so they are allowed to start with a number. ([75d8283](https://github.com/Patternslib/patterns/commit/75d8283f501149a95ab23b10f398ded6d7ca605c))


* **pat scroll-marker:** Do escaping for hash id selectors, so they are allowed to start with a number. ([d733cb7](https://github.com/Patternslib/patterns/commit/d733cb7d7bbfc8918b3ada1890f6f0808bdc1207))


* **pat scroll-marker:** The init method does not need to be async. ([c308b66](https://github.com/Patternslib/patterns/commit/c308b66b0fcfd0ff72e555bda85a4f54f9018285))

## [9.9.0-alpha.1](https://github.com/Patternslib/patterns/compare/9.9.0-alpha.0...9.9.0-alpha.1) (2023-04-17)


### Bug Fixes


* **pat scroll-marker:** Do not break if no scroll-marker observables have been found. ([be6723f](https://github.com/Patternslib/patterns/commit/be6723faaf6040f0339896a2673656867b04615c))


* **pat scroll-marker:** Use the correct scroll container. ([ccc3ddc](https://github.com/Patternslib/patterns/commit/ccc3ddc4d5d2a839faad86f97a67f67f6b49eb61))

  The scroll container was potentially wrong and is a parent of the
hash-link target contents and not a parent of the navigation where
pat-scroll-container (or pat-navigation) are defined upon.



### Maintenance


* Upgrade dependencies. ([41e7a94](https://github.com/Patternslib/patterns/commit/41e7a945f45c4d247c184c4e1a39d220f40e6039))


* Upgrade dependencies. ([981739d](https://github.com/Patternslib/patterns/commit/981739d525b4e8eeb8f949ef67341de920dd0e99))

## [9.9.0-alpha.0](https://github.com/Patternslib/patterns/compare/9.8.3...9.9.0-alpha.0) (2023-04-17)


### Features


* **core basepattern:** Allow to specify parser options on the pattern. ([eb66159](https://github.com/Patternslib/patterns/commit/eb66159e82ba019a3210d8d862ea65dcbd178df6))


* **core basepattern:** Throw pre-init.PATTERNNAME.patterns event. ([cacb743](https://github.com/Patternslib/patterns/commit/cacb743268e018563deef2795ccaf992044cf7f9))

  Throw a bubbling pre-init.PATTERNNAME.patterns event before initializing
the event for new class-based patterns.


* **core base:** Throw pre-init.PATTERNNAME.patterns event. ([e9a8f2f](https://github.com/Patternslib/patterns/commit/e9a8f2fa4f2151928fd473c75e339496d93e0d8c))

  Throw a bubbling pre-init.PATTERNNAME.patterns event before initializing
the event for old prototype based patterns.


* **core dom:** Add get_scroll_x and get_scroll_y helper methods to get the horizontal/vertical scrolling position. ([a3ecf93](https://github.com/Patternslib/patterns/commit/a3ecf9350c2720e6ac2cf6a5e50eea28691067a4))


* **core dom:** Implement get_visible_ratio to calculate the visible ratio between an element and a container. ([622d5e2](https://github.com/Patternslib/patterns/commit/622d5e21bc6295ec93d11224a2ff78ee010a617a))


* **core utils:** add parseLength method for parsing px and % lengths. ([95c16b8](https://github.com/Patternslib/patterns/commit/95c16b8dab1f9324e8751fbd7211da1a9e82d47f))


* **core utils:** Add threshold_list helper for intersection observers. ([52d9ecf](https://github.com/Patternslib/patterns/commit/52d9ecf1ecb2e14d5f0e4e3fd9f39531b0846dab))


* **core utils:** debouncer - Add postpone option for callback to be run after all debounce calls or in between. ([12c980b](https://github.com/Patternslib/patterns/commit/12c980b02ce140e58b9d256520e056561795ac1b))

  If "postpone" is set to "true" (the default and previous behavior) the
callback will only be called after no more debouncer calls are done for
the given timeout.
If "postpone" is set to "false" the callback will be run after the
timeout has passed and calls to "debouncer" in between are ignored.


* **pat navigation:** Add scroll-marker functionality. ([fb8eb82](https://github.com/Patternslib/patterns/commit/fb8eb82783b1a2f957dfa4f3f896c65dbda2d455))

  The pattern now sets current and in-view classes on the navigation and
the content when scrolling to hash-link targets.


* **pat scroll-marker:** Add pattern to set navigation classes based on the scroll position. ([6483649](https://github.com/Patternslib/patterns/commit/64836491c2591b399fe543bd4aacb1e50b826b3c))

  The new scroll-marker pattern allows you to set classes on the
navigation and content elements for hash-links. If a content section
with a hash id and a corresponding navigation link with the same
hash-url is visible, the navigation and content section are marked with
CSS classes.



### Maintenance


* **pat inject:** Use dom.find_scroll_container instead jQuery :scrollable selector. ([14af661](https://github.com/Patternslib/patterns/commit/14af6612c38e79bd073ee08d9e1e1a6048dfe086))


* **pat navigation:** Don't do option grouping. There will some options be added where grouping get's in the way. ([3c55864](https://github.com/Patternslib/patterns/commit/3c5586466f4ba72a1d9d2c80b5f978200b6e263f))


* **pat navigation:** Switch to class based pattern. ([5b0fc43](https://github.com/Patternslib/patterns/commit/5b0fc43295bb7eab46cb483e8744f1fafb839269))


* **pat scroll-box:** Cleanup code. ([148f79a](https://github.com/Patternslib/patterns/commit/148f79a45b482c78e04f8b5e7e0c4342a567bba7))


* **pat scroll-box:** Use dom.scroll_y instead of own implementation. ([e5a4b24](https://github.com/Patternslib/patterns/commit/e5a4b244c65974619b9716e3baecfe5e7376be58))


* **pat scroll:** Code cleanup. ([a66a9f8](https://github.com/Patternslib/patterns/commit/a66a9f8b24ca18f658a25ecc31ef2762131b8c3c))


* **pat-inject:** Remove obsolete hooks option. ([411653d](https://github.com/Patternslib/patterns/commit/411653d0e01bdf659b05da2ca6c67b843c204751))

  The hooks option allowed to throw custom events after successful
injection. It was a multi-value argument but only allowed "raptor" as
value. Raptor was a WYSIWYG editor which has not been further developed
since 10 years and which we're not supporting anymore since quite some
time. Thus this option could be safely removed and this change is not a
breaking change.

If you need to react on events, see the documented event list in
pat-inject's documentation.


* **pat-inject:** Remove obsolete raptor-ui trigger. ([ae01e20](https://github.com/Patternslib/patterns/commit/ae01e205a9b58aafac71a323c5e36f4f5154f4b8))

  Remove the ".raptor-ui .ui-button.pat-inject" trigger selector which was
for raptor WYSIWYG HTML editor support. This editor isn't actively
developed since almost 9 years and not supported anymore. This is not a
breaking change.


* Upgrade dependencies. ([15b6adb](https://github.com/Patternslib/patterns/commit/15b6adbaa11529cf3f93aef1c4fc3cd2f6367a81))


* Upgrade luxon to 3.3.0. ([b19f1e5](https://github.com/Patternslib/patterns/commit/b19f1e5cf1f493a208d25e11f6e0af0c617aa4dc))

  The Module federation warning "Unable to find required version" is fixed
since webpack v5.78.0 for modules which do package.json
self-referencing.

Ref:
- https://github.com/webpack/webpack/issues/16683
- https://github.com/webpack/webpack/pull/16685

## [9.8.3](https://github.com/Patternslib/patterns/compare/9.8.2...9.8.3) (2023-04-17)


### Maintenance


* **Docs:** Remove section about IE polyfills from README. ([b9c3697](https://github.com/Patternslib/patterns/commit/b9c369728e773854651a0acc544529d8b6410278))The IE polyfills were removed in Patternslib 9.8.0-alpha.2.

* **pat inject:** Document events thrown by the pattern. ([d3a7a0e](https://github.com/Patternslib/patterns/commit/d3a7a0e54d820fc41377347932218c263c20e5b9))

* **pat inject:** Document the scroll argument. ([1b9604e](https://github.com/Patternslib/patterns/commit/1b9604e7127114e70dc3f6f99b1e5bd643a21e59))

## [9.8.3-alpha.2](https://github.com/Patternslib/patterns/compare/9.8.2...9.8.3) (2023-03-09)


### Maintenance


* Upgrade pat-tiptap to 4.8.1. ([eda16d7](https://github.com/Patternslib/patterns/commit/eda16d7d1d5dcffcc686f5b58d7521e39f9a7c57))

## [9.8.3-alpha.1](https://github.com/Patternslib/patterns/compare/9.8.2...9.8.3) (2023-03-09)


### Bug Fixes


* **core events:** await_pattern_init - check for event coming from correct element. ([a532ebf](https://github.com/Patternslib/patterns/commit/a532ebf7fadfb645c8288f700a7c505bf2956b4c))Check if the init/not-init events were thrown from the Pattern's own
element. When a child element did an unsuccessful Pattern init (rejected
because already initialized) and at the same time the parent element also tried
to initialized the same Pattern await_pattern_init could fail. The not-init
event bubbled up which was incorrectly catched by await_pattern_init on the
parent element.


### Maintenance


* **core events test:** Remove unused test. ([ca16b1d](https://github.com/Patternslib/patterns/commit/ca16b1d6f63e6032c978fe47eed9be2604f09b70))

* **core utils debounce tests:** await for number of debounce calls to correctly test the debounce method. ([0c3dea7](https://github.com/Patternslib/patterns/commit/0c3dea7943518c5bf7ab07370037eff8b023b3fa))

* Upgrade dependencies. ([bfaf95c](https://github.com/Patternslib/patterns/commit/bfaf95c1a7840a4004c47345aa41b9ce891b8270))

## [9.8.3-alpha.0](https://github.com/Patternslib/patterns/compare/9.8.2...9.8.3) (2023-03-06)


### Bug Fixes


* **pat auto submit:** Fix cloned elements not submitted when their input changes. ([f36c69b](https://github.com/Patternslib/patterns/commit/f36c69b640e765d7fafabddef65d511ddb9df00e))


## [9.8.2](https://github.com/Patternslib/patterns/compare/9.8.1...9.8.2) (2023-02-24)

## [9.8.2-alpha.0](https://github.com/Patternslib/patterns/compare/9.8.1...9.8.2) (2023-02-14)


### Maintenance


* Upgrade dependencies. ([81915cd](https://github.com/Patternslib/patterns/commit/81915cdebbc943b18951a98cab97c8dcc2257ad7))

## [9.8.1](https://github.com/Patternslib/patterns/compare/9.8.1-alpha.0...9.8.1) (2023-02-02)


### Features


* **build:** Update patternslib.com with each non-pre release. ([143031d](https://github.com/Patternslib/patterns/commit/143031df875e31cfec1577dac3886950a5721d00))


### Bug Fixes


* **Build:** Fix luxon (again) to 2.4.0 to avoid webpack MF error due to non standard package.json setup. ([9661ae7](https://github.com/Patternslib/patterns/commit/9661ae7cc9bfbe51b8987ac2d70ae08d697be499))

* **pat checklist:** Also set the "checked" and "unchecked" classes on the toggle checkbox. ([8154775](https://github.com/Patternslib/patterns/commit/81547755be231b47689dc26492cd62811096e0b5))


## [9.8.1-alpha.0](https://github.com/Patternslib/patterns/compare/9.8.0...9.8.1-alpha.0) (2023-01-25)


### Features


* **pat checklist:** Toggle checkbox to toggle checked boxes true/false. ([2a435fa](https://github.com/Patternslib/patterns/commit/2a435fa7d616e14722312a6b9b43ee98e3f0c7ea))


### Maintenance


* **Build:** Upgrade dependencies. ([7e7cc20](https://github.com/Patternslib/patterns/commit/7e7cc20b50044bbbc4b26647b452a2a8bddcfd1f))

* **pat-checklist:** Document the available options. ([625f7e5](https://github.com/Patternslib/patterns/commit/625f7e54e360aa7ae6bfa5adea4fd73626e3f24d))


## [9.8.0](https://github.com/Patternslib/patterns/compare/9.8.0-beta.6...9.8.0) (2022-12-23)

### Maintenance

-   **Build:** Upgrade dependencies. ([befb845](https://github.com/Patternslib/patterns/commit/befb845e71f40f6fdb79c433c3f27d62529c2523))

## [9.8.0-beta.6](https://github.com/Patternslib/patterns/compare/9.8.0-beta.5...9.8.0-beta.6) (2022-12-22)

### Bug Fixes

-   **pat-sortable:** Initialize already existing sortable handles. ([b3f5077](https://github.com/Patternslib/patterns/commit/b3f5077e5ed39a0d5a68f1cfecf1d07adc7e0745))

    Also allow the sortable itself to be the handle.

## [9.8.0-beta.5](https://github.com/Patternslib/patterns/compare/9.8.0-beta.4...9.8.0-beta.5) (2022-12-22)

### Features

-   **pat-sortable:** Support initialization after injection. ([afaf388](https://github.com/Patternslib/patterns/commit/afaf38850399ccb739b38f29d2d1e83a585bea09))

## [9.8.0-beta.4](https://github.com/Patternslib/patterns/compare/9.8.0-beta.3...9.8.0-beta.4) (2022-12-22)

### Bug Fixes

-   **pat-sortable:** Show dragable item image while dragging. ([1c9eb80](https://github.com/Patternslib/patterns/commit/1c9eb800dd5d81c00ce4f249d101cdd589e9c83e))

-   **pat-sortable:** sortable-handle needs to be injected at last element of the sortable item. ([db02541](https://github.com/Patternslib/patterns/commit/db02541d7199deb3592723cc12a0c6be1a13b753))

## [9.8.0-beta.3](https://github.com/Patternslib/patterns/compare/9.8.0-beta.2...9.8.0-beta.3) (2022-12-22)

### Features

-   **core events:** Add dragstart and dragend event factories. ([73d7fc7](https://github.com/Patternslib/patterns/commit/73d7fc748f1c2c6be8f9fd1d0d405aadea140594))

### Bug Fixes

-   **Build:** Load modernizr early and non-asynchronously. ([8bc9b66](https://github.com/Patternslib/patterns/commit/8bc9b66e96285496fdb129ca1fa07759ddd4fd42))

    Include the modernizr bundle by injecting a script tag. This ensures
    modernizr is loaded synchronously and executing early and sets it's feature
    detection classes before the layout is done by the browser.

    This reverts the breaking change from the previous Patternslib 9.8.0-beta.2
    release. The separate modernizr.min.js build file is still kept, but
    modernizr is included by the main Patternslib bundle. There is no need to
    add another script tag to include modernizr.

    You can disable loading of modernizr by setting the following before the
    Patternslib bundle.min.js is included:

    <script>window.__patternslib_disable_modernizr = true;</script>

    Also, the "js" class is set on the HTML root tag when a "no-js" class was
    present regardless of the "\_\_patternslib_disable_modernizr" setting.

    Since Patternslib 9.0.0-alpha.0 where we introduced webpack module
    federation for our bundles, Modernizr is loaded asynchronously and applying
    it's CSS classes a tick too late. For example, the change from the "no-js"
    to the "js" class was done while the tiles have already been drawn and
    visible on the screen, resulting in screen flickering. There are a number
    of projects which depend on Modernizr being applied early.

-   **pat-sortable:** Initialize sorting on cloned elements. ([d7abbc0](https://github.com/Patternslib/patterns/commit/d7abbc01febabec2162d58251c59495a89d2ed6f))

    Fix sorting behavior on cloned elements, which broke on Patternslib 9.8.0-alpha.0.

### Maintenance

-   **Build:** Do not include the example minimalpattern in the build. ([9712019](https://github.com/Patternslib/patterns/commit/971201918da325644a8fa04d1c1886424055913e))

-   **Build:** Remove now unused globals module. ([8e05515](https://github.com/Patternslib/patterns/commit/8e05515fbca24f0a16536f20263b09b4506d7f2c))

    jQuery is now imported and set earlier.

-   **Docs:** Update some documentation. ([4ccf1bd](https://github.com/Patternslib/patterns/commit/4ccf1bd23fa3983844836973a6febd3549836106))

-   **pat-sortable:** Modernize tests. ([bf25dc4](https://github.com/Patternslib/patterns/commit/bf25dc4e8c671414ff1438dce2d91daf85f7477b))

## [9.8.0-beta.2](https://github.com/Patternslib/patterns/compare/9.8.0-beta.1...9.8.0-beta.2) (2022-12-19)

### Bug Fixes

-   **Build:** Also include necessary \_sass directory in the npm package. ([70da6b1](https://github.com/Patternslib/patterns/commit/70da6b1a1d791e36beda951dd1b7feebff695a33))

-   **Build:** Also include the webpack configs in the npm package. ([f6bf2bf](https://github.com/Patternslib/patterns/commit/f6bf2bf3dfba9616b60fb599db305ad1173c1a45))

    Previous packages depending on @patternslib/patternslib also extended
    Patternslib' webpack configs. Include these configs for backwards
    compatibility.

-   **pat-bumper:** Remove style import from the patterns SCSS file. ([094010b](https://github.com/Patternslib/patterns/commit/094010bf5a315af2220b2d446afb31e442e01852))

### Breaking Changes

-   **Build:** Separate modernizr into a own bundle. ([875b041](https://github.com/Patternslib/patterns/commit/875b04112e93f85c7215565151e80e0d44ae0649))

    Since Patternslib 9.0.0-alpha.0 where we introduced webpack module
    federation for our bundles, Modernizr is loaded asynchronously and applying
    it's CSS classes a tick too late. For example, the change from the `no-js`
    to the `js` class was done while the tiles have already been drawn and
    visible on the screen, resulting in screen flickering. There are a number
    of projects which depend on Modernizr being applied early.

    This change now fixes the problem by separating the Modernizr build from
    the Patternslib bundle.

    If you depend on Modernzir, please include the new `modernizr.min.js`
    bundle in a script tag, preferably before the Patternslib bundle
    `bundle.min.js`.

    The global switch "window.\_\_patternslib_disable_modernizr" is also
    removed, as it got useless.

### Maintenance

-   Add modernizr.min.js bundle to main index.js demo file for demonstration. ([96a7ed2](https://github.com/Patternslib/patterns/commit/96a7ed25c5cfe8e3c4454892ae787007ffa53467))

-   **Build:** Directly build the modernizr bundle. ([ee2acdc](https://github.com/Patternslib/patterns/commit/ee2acdc686bc26e799026e1ca8d1e434ad0f79c4))

    Do not use an webpack entry to build the modernizr bundle with an webpack
    runtime overhead. Instead, build it directly but abusing the webpack
    CopyPlugin transform mechanism. We could also build the modernizr bundle
    from the Makefile but that wouldn't provide the file when watching or when
    running webpack-dev-server.

-   **Build:** Optimize modernizr configuration. ([e1fd8de](https://github.com/Patternslib/patterns/commit/e1fd8dee625257cb2922429a6eb828d29d053f7d))

    Remove unnecessary tests in .modernizrrc.js and slim down the build size.

-   Upgrade dependencies. Also Upgrade to jQuery 3.6.2. ([071e084](https://github.com/Patternslib/patterns/commit/071e08427031bd1fad7bebccefd11f34457c915a))

## [9.8.0-beta.1](https://github.com/Patternslib/patterns/compare/9.8.0-beta.0...9.8.0-beta.1) (2022-12-11)

### Features

-   **core basepattern:** Add a destroy method. ([f9ca65a](https://github.com/Patternslib/patterns/commit/f9ca65a1b56c8908dec7114d66dca963f5808357))

    The destroy method removes the pattern instance from the element.
    This is necessary to re-initialize the same pattern on the same element.

-   **core events:** Support await_pattern_init with pattern double registration attempt. ([e8640a9](https://github.com/Patternslib/patterns/commit/e8640a95d11f5e9c910860c5408fd47a898931d1))

    When a pattern is tried to be initialized on the same element twice, throw
    an event and use that event in await_pattern_init to reject the promise.
    When using await_pattern_init you might want to try/catch the block to
    handle any possible double-registration errors.

-   **core events:** Support once-events in add_event_listener. ([fc0e333](https://github.com/Patternslib/patterns/commit/fc0e3334bbbec9be6d539f1e17d18d07cbe79704))

    Add support for once-events in add_event_listener and unregister them when
    called from the event_listener_map.

### Bug Fixes

-   **pat-tooltip:** Cleanup tooltip after it's destroyed. ([ac27e20](https://github.com/Patternslib/patterns/commit/ac27e20614cadc4715ecc1219d5c4cd1541d362d))

    When the tooltip is destroyed, also call the tooltip's BasePattern destroy
    method to clean up and release the tooltip from the element. After that it
    can be instantiated on the same element again. This change was necessary
    after the recent BasePattern change.

-   **pat-validation:** Make sure to cancel submit events on invalid forms. ([e218af2](https://github.com/Patternslib/patterns/commit/e218af2290af35c6d4dbea3ab3d3d843aeeb787b))

    Make sure that submit events are canceled on invalid forms by using a
    capturing event handler which is invoked before non-capturing events.

    The previous commit exposed a problem with the submit event handling, where
    the then non-capturing submit event handler was registered later than the
    one from pat-inject because pat-validation's async init method where
    pat-inject's init method is yet non-async. That happened even the
    pat-validation's pattern initialization is enforced to run first due to
    registration reordering in the Pattern registry. Now with the capturing
    event handler this problem is fixed.

### Maintenance

-   **core basepattern:** Use identity instead equality comaprison instead in tests for stricter testing. ([ce962d2](https://github.com/Patternslib/patterns/commit/ce962d2d09b41ab39b746d0f9f432df81cc96e61))

-   Exclude more files from npm packages. ([c312b96](https://github.com/Patternslib/patterns/commit/c312b961520bbe8edd2b425157ded450e2d2144d))

-   Only include dist/ and src/ directories in the npm package. ([babc4b6](https://github.com/Patternslib/patterns/commit/babc4b6cf368fc3c6f863f16c5b2f6c620e3b672))

-   **pat-validation:** Change to class based pattern. ([11543ea](https://github.com/Patternslib/patterns/commit/11543ea97d944f13e53f2758fa0fd5267ea513af))

    This is needed for better customization in deriving projects.

-   Upgrade dependencies. ([399105f](https://github.com/Patternslib/patterns/commit/399105f44a88d0ff7761c9151eeb153c7cba27a9))

-   Use browserslist defaults. ([8867fd8](https://github.com/Patternslib/patterns/commit/8867fd84747fcf20df26a39538a7e6adaa450252))

## [9.8.0-beta.0](https://github.com/Patternslib/patterns/compare/9.8.0-alpha.3...9.8.0-beta.0) (2022-12-07)

### Bug Fixes

-   **Build:** Fix tiptap error. ([6e67655](https://github.com/Patternslib/patterns/commit/6e676550550b3b68aab266fc41b3c61622b00321))

    Fix tiptap "Unhandled Promise Rejection" error due to multiple versions of
    a tiptap dependency installed. Removing yarn.lock in re-installing solves
    this.

## [9.8.0-alpha.3](https://github.com/Patternslib/patterns/compare/9.8.0-alpha.2...9.8.0-alpha.3) (2022-12-07)

### Bug Fixes

-   **pat-clone-code:** Fix a Content-Security-Policy problem. ([e38f987](https://github.com/Patternslib/patterns/commit/e38f987d968a641552079f4ffe9afbcf02663eeb))

    Do not use dom.template for the wrapper template to not get caught by the
    browser's Content-Security-Policy. If set, a unsafe-eval error would be
    thrown and the pattern refuse to run.

### Breaking Changes

-   **pat-validation:** Remove error-template option. ([78c544b](https://github.com/Patternslib/patterns/commit/78c544b47267720b358246e717091789fe079d14))

    This is a breaking change.

    Due to a Content-Security-Policy problem with dom.template when unsafe-eval
    is not set - which you wouldn't set if possible - we had to remove the
    error-template parameter. Instead the template is now defined in a
    `error_template` method on the Patten class and can be customized by
    subclassing and extending the pat-validation pattern or by patching it via
    Pattern.prototype.

### Maintenance

-   **Build:** Upgrade dependencies. ([fed2716](https://github.com/Patternslib/patterns/commit/fed27168ba605372de807c4af13fdb28e7e53437))

-   **core dom template:** Warn about using dom.template due to a CSR probmel. ([989fa9f](https://github.com/Patternslib/patterns/commit/989fa9fd9d1eb3c3b24df28a9fe529b8875689a9))

    Warn about a problem of dom.template with a Content-Security-Policy set. If
    a CSR rule is set then dom.template would break the code unless
    'unsafe-eval' is allowed (which you wouldn't normally allow when using a
    CSR). Therefore it is not recommended to use this template function.

-   **pat-clone-code:** Better example, correct documentation. ([028ba07](https://github.com/Patternslib/patterns/commit/028ba07ef89f118bc317ed7bcb11c58835e22568))

-   Remove IE related code paths. ([9de0d95](https://github.com/Patternslib/patterns/commit/9de0d9521511b2c037d9c290f153ae9745585693))

## [9.8.0-alpha.2](https://github.com/Patternslib/patterns/compare/9.8.0-alpha.1...9.8.0-alpha.2) (2022-12-07)

### Features

-   **Build:** Include the build in the npm package. ([544b589](https://github.com/Patternslib/patterns/commit/544b58993af72e02872efcb9564a54af60b64ba8))

    The compiled build is now included in npm packages by including the dist
    directory in .npmignore. To not increase the package size too much the
    JavaScript map files are not included. Now you can include Patternslib by
    using unpkg or jsDelivr like so:

https://unpkg.com/@patternslib/patternslib@9.8.0-alpha.2/dist/bundle.min.js
or
https://cdn.jsdelivr.net/npm/@patternslib/patternslib@9.8.0-alpha.2/dist/bundle.min.js

-   **core dom:** Add is_input method. ([554e32e](https://github.com/Patternslib/patterns/commit/554e32e08b825e6799df47f23ac643349be2de5a))

    Add `is_input` to test if a element is of input type. This is basically the
    same as `$(":input")` from Sizzle/jQuery.

-   **pat-markdown:** Soft-depend on pat-syntax-highlight. ([cf0f6e3](https://github.com/Patternslib/patterns/commit/cf0f6e31d99eac3b4ee925f0ee3f0194c85c6b0b))

    Only highlight code blocks when the pattern is available.

    Not hard-depending and importing pat-syntax-highlight fixes a problem where
    only including pat-markup also included pat-syntax-highlight and it's big
    highlight.js library.

    This can reduce the generated bundle size significantly.

-   **pat-tooltip:** Soft-depend on pat-markdown. ([1f81238](https://github.com/Patternslib/patterns/commit/1f81238d7cb0e838dba4cbd085b7c0369623be0b))

    Only register the markdown data type handler when the pattern is available.

    Not hard-depending and importing pat-markdown fixes a problem where only
    including pat-tooltip also included pat-markdown and pat-syntax-highlight
    with it's big highlight.js library.

    This can reduce the generated bundle size significantly.

### Bug Fixes

-   **pat-bumper:** Fix runtime error due to reference to wrong container. ([893d392](https://github.com/Patternslib/patterns/commit/893d392738be0b98d2e5b2cf19e89714dc92965c))

-   **pat-collapsible:** Class-based patterns cannot be jQuery plugins. ([eedcc47](https://github.com/Patternslib/patterns/commit/eedcc474130244cdb3a5944a910af60e69d707ba))

-   **pat-syntax-highlight:** Do not load all languages. ([c34d4a0](https://github.com/Patternslib/patterns/commit/c34d4a0e65739c4f00752fef77e98e8d8cdf74c1))

    Change the import so that no language is included by default. Instead
    import the languages dynamically.

    This reduces the download size when pat-syntaax-highlight is used
    significantly.

-   **pat-syntax-highlight:** Fix language registration. ([19bbb53](https://github.com/Patternslib/patterns/commit/19bbb53d11d46a9a183c64454930f70d603dca18))

    Fix a typo where all languages were registered as "javascript".

### Maintenance

-   Add deprecation note for public_path. ([f6d8124](https://github.com/Patternslib/patterns/commit/f6d8124a84d744f217a8eec2d5b7b184d210439d))

-   **Build:** Remove the IE11 polyfills-loader. ([6eaddec](https://github.com/Patternslib/patterns/commit/6eaddecd4fa6dcdb0670ee4cc4e8658f7cad7b68))

    Clear out the polyfills-loader script but keep the module for backwards
    compatibility. No IE11 compatibility polyfills are included anymore as
    support for IE11 has recently really and finally dropped. The
    polyfills-loader.js file is still shipped but empty for compatibility with
    projects including the polyfills loader.

-   **Build:** Remove unused prismljs and google-code-prettify modules. ([ed808e5](https://github.com/Patternslib/patterns/commit/ed808e5cb4b6a1adbebf3609bf1ff65b69557561))

-   **Build:** Update browserslist setting. ([a29b9e8](https://github.com/Patternslib/patterns/commit/a29b9e8edcfd87326b5a9c18b35733ebf0afa58a))

    Explicitly remove ie11 from browserslist. It wasn't used due to the "not
    dead" setting anyways.

-   **Build:** Upgrade @patternslib/dev. ([ed8d13a](https://github.com/Patternslib/patterns/commit/ed8d13aaa3e696ff7534ae91ba79bab91376d8f4))

-   **Build:** Upgrade pat-tiptap to 4.7.0. ([ad0be10](https://github.com/Patternslib/patterns/commit/ad0be10f070b3a23057f957aad036eb97b594baf))

-   **core basepattern:** Avoid code linting problem. ([d2836bd](https://github.com/Patternslib/patterns/commit/d2836bdd0ec5dc63ca1a96711fd34d6d6efd5f1a))

    Avoid code linting problem and make clear the init method is/can be
    asynchronous.

-   **pat-markdown:** Improve registering the markdown handler for pat-inject. ([3f17e99](https://github.com/Patternslib/patterns/commit/3f17e9989de092da5b95480a6dd7334912933799))

    Wait a tick before registering the markdown type handler for pat-inject.

    With that there is no need for pat-inject to be imported before
    pat-markdown, as long as it is imported side by side with pat-markdown.

-   **pat-markdown:** Switch to class based pattern. ([c6dc8b0](https://github.com/Patternslib/patterns/commit/c6dc8b093f252d94b69a2e57812f9ca5b8070c30))

-   **pat-stacks:** The trigger should be a static property. ([4f0bb0f](https://github.com/Patternslib/patterns/commit/4f0bb0f0efa32975480c3d755a09dfe79390f8c9))

-   **pat-syntax-highlight:** The trigger should be a static property. ([e341681](https://github.com/Patternslib/patterns/commit/e341681c27575e99e5a6d1fb90277bf9d75b0046))

-   **pat-tooltip:** Switch to class based pattern. ([4fdb12a](https://github.com/Patternslib/patterns/commit/4fdb12a751e5fa798dcdc810f461383c334ee7fb))

## [9.8.0-alpha.1](https://github.com/Patternslib/patterns/compare/9.8.0-alpha.0...9.8.0-alpha.1) (2022-12-06)

### Bug Fixes

-   **pat-bumper:** Do not calculate padding/margin on viewport. ([baae37c](https://github.com/Patternslib/patterns/commit/baae37c1f287ec204146b4a99fb508f19234c223))

    On the viewport as scrolling container paddings and margins are not
    influencing the sticky element's position. This is contrary to other
    scrolling containers within the document. The position calculation is
    easier and only consists of the clientWidth/Height to respect scrollbar
    widths.

-   **pat-bumper:** Fix position calculation for sticky elements. ([4da8d70](https://github.com/Patternslib/patterns/commit/4da8d7023acb5b430d172bca3a226dad7a5f3b2e))

    Following the sticky position specification only top, right, bottom and
    left values are used to compute the position relative to the scrolling
    container.

-   **pat-bumper:** Support dynamic position values. ([b70fad2](https://github.com/Patternslib/patterns/commit/b70fad2c8e8662ef0af8a3e628ee154bd95beb7b))

    The container and element positions need to be calculated every time, as
    they are likely to be changed by dynamically assigned classes. This can be
    the case for different position values based on the scrolling direction
    classes set by pat-scroll-box.

### Maintenance

-   **Build:** Upgrade dependencies. ([5e5b54d](https://github.com/Patternslib/patterns/commit/5e5b54d1cd40fe2069dd7b5ef38674dc0afb6988))

-   **pat-autofocus:** Fix sporadic autofocus test failures. ([9c13c56](https://github.com/Patternslib/patterns/commit/9c13c567f46677576664140d183c69982f48d3e8))

## [9.8.0-alpha.0](https://github.com/Patternslib/patterns/compare/9.7.0...9.8.0-alpha.0) (2022-12-05)

### Features

-   **core basepattern:** Provide the parser as static attribute. ([49db677](https://github.com/Patternslib/patterns/commit/49db6776199aea5860ab9074ddacb06869dbc705))

    This change is backwards compatible Change the parser attribute to a static
    attribute and provide it also on the object. This change was necessary
    because pat-inject was using the parser on a registered Pattern class to
    rebase URL configurations in the rebaseHTML method. There was no access to
    the parser attribute on non-instatiated objects before, now it is.

-   **pat-autosuggest:** Add a configurable separator for multiple values. ([21cbe8f](https://github.com/Patternslib/patterns/commit/21cbe8fd6d2dd142abacc752073f6e41e4d73058))

### Bug Fixes

-   **pat-auto-suggest:** Adapt to changes from pat-depends where the event is called on the pat-depends element itself. ([926de33](https://github.com/Patternslib/patterns/commit/926de3383901bd9e7808d9ee05e4e56171c9c9aa))

-   **pat-autofocus:** Refocus on DOM updates by other Patterns. ([4dc2963](https://github.com/Patternslib/patterns/commit/4dc2963faca04c39caf9a1c2ac954045f1ff37db)), closes [#1092](https://github.com/Patternslib/patterns/issues/1092)

    Set the focus if appropriate when the DOM has changed and a pat-update
    event has thrown. Please note, this does not use an IntersectionObserver
    but relies on other Patterns using the pat-update event. This behavior
    got lost in Patternslib 6.1 and is now restored.Fixes: #1092

-   **pat-bumper:** Correctly set the bumpuing classes. ([e66b987](https://github.com/Patternslib/patterns/commit/e66b9872c796672a95e24d9557d2c028030b4c29)), closes [#1083](https://github.com/Patternslib/patterns/issues/1083)

    The bumping classes are now set correctly on any bumping direction.

    The logic is adapted to work with any top, right, bottom, left, margin,
    border and padding setting on a wrapping container, two different
    containers for x and y scrolling and on the window viewport as
    container.Fixes: #1083

-   **pat-scroll-box:** Fix failing tests due to timing inconsitencies. ([7a03ef8](https://github.com/Patternslib/patterns/commit/7a03ef8b9d129e1129dc09722b7bda158aff9534))

### Maintenance

-   **core utils:** utils.hideOrShow: add updated dom to pat-update event data. ([0b5f92f](https://github.com/Patternslib/patterns/commit/0b5f92f5b42cd4b206443ffd01b21dd865c8b887))

-   **pat stacks:** Modernize code. ([7928880](https://github.com/Patternslib/patterns/commit/7928880b2a76c458789d123cc6b5f515c55996b5))

-   **pat-autofocus:** Switch to class based patterns. ([4302d6c](https://github.com/Patternslib/patterns/commit/4302d6c98de16394d593ef9785273fd37e1078b2))

-   **pat-bumper:** Correct documentation. ([fa0254c](https://github.com/Patternslib/patterns/commit/fa0254cc3ac7a5c6f820057c93668c2a638cc1b4))

-   **pat-bumper:** No IE11 support anymore. ([bae3f55](https://github.com/Patternslib/patterns/commit/bae3f55235847500cffda290108bc99ca786b1e0))

-   **pat-bumper:** Switch to class based patterns. ([2b04cbc](https://github.com/Patternslib/patterns/commit/2b04cbc832c8f3d219fb60e0616fd3b9f0d52f57))

-   **pat-clone-code:** Make parser attribute a static attribute. ([eb70b84](https://github.com/Patternslib/patterns/commit/eb70b84b1bfbd7516a387c17f12ebc29f1fac0d8))

-   **pat-clone:** Add updated dom to pat-update event data. ([18375fe](https://github.com/Patternslib/patterns/commit/18375fe6732e38740e5a7546852e20f784d60f51)), closes [#1092](https://github.com/Patternslib/patterns/issues/1092)

    Related: #1092

-   **pat-clone:** Modernize code. ([f0d8d5b](https://github.com/Patternslib/patterns/commit/f0d8d5b5e3048c295d7a69bb40235f274e15d7a6))

-   **pat-collapsible:** Add updated dom to pat-update event data. ([fde478c](https://github.com/Patternslib/patterns/commit/fde478ccbc98e6c51998bd332d8d5880269459a0)), closes [#1092](https://github.com/Patternslib/patterns/issues/1092)

    Related: #1092

-   **pat-collapsible:** Modernize code. ([870f6dc](https://github.com/Patternslib/patterns/commit/870f6dcdbadd9f58a534bf8c9675ea047c34ab8a))

-   **pat-collapsible:** Switch to class based pattern. ([417b0d6](https://github.com/Patternslib/patterns/commit/417b0d6332ee9adb0c7f99407a7dc5d9e7998f45))

-   **pat-depends:** Always throw update event and add changed dom structure. ([6152afd](https://github.com/Patternslib/patterns/commit/6152afd289f837d036edfb9947059217974696bb)), closes [#1092](https://github.com/Patternslib/patterns/issues/1092)

    Trigger pat-update on pat-depends itself and add updated dom structure to
    pat-update event data. This allows other patterns to also listen to changes
    in pat-depends. Goes together with the previous change on
    pat-autofocus.

    Related: #1092

-   **pat-equaliser:** Add updated dom to pat-update event data. ([c66a431](https://github.com/Patternslib/patterns/commit/c66a43124d76f501bfdeb2ee09bcd39c5f2d550d))

-   **pat-scroll:** Add updated dom to pat-update event data. ([fc23966](https://github.com/Patternslib/patterns/commit/fc23966c8415d7d6e6fe31ae7ecb78bb7d2f8c65))

-   **pat-scroll:** Code cleanup. ([4f27b99](https://github.com/Patternslib/patterns/commit/4f27b99a34d982a203f889ff157ebd0e9d7addb2))

-   **pat-scroll:** Fix test markup. ([9b788a0](https://github.com/Patternslib/patterns/commit/9b788a0c19cce9592691ce7446b35ef1d4cd3c87))

-   **pat-sortable:** Add updated dom to pat-update event data. ([18711eb](https://github.com/Patternslib/patterns/commit/18711eb95a85152aea8eff7ba708117bee71d658))

-   **pat-stacks:** Add updated dom to pat-update event data. ([41f8bb3](https://github.com/Patternslib/patterns/commit/41f8bb354b212ce560c279ae0724ae2f37501c04))

-   **pat-stacks:** Switch to class based pattern. ([6065eae](https://github.com/Patternslib/patterns/commit/6065eae3db68a62f7f1c7326ba87320e86236c41))

-   **pat-switch:** Add updated dom to pat-update event data. ([7434236](https://github.com/Patternslib/patterns/commit/7434236c7ea51aafc04dfeaaa08bd9fb1e2f2ed8))

-   **pat-toggle:** Add updated dom to pat-update event data. ([56a0073](https://github.com/Patternslib/patterns/commit/56a00730461c7d9481f9862afc2a009fb75ac0ae))

## [9.7.0](https://github.com/Patternslib/patterns/compare/9.7.0-alpha.5...9.7.0) (2022-11-15)

### Maintenance

-   **Build:** Upgrade dependencies. ([9258dff](https://github.com/Patternslib/patterns/commit/9258dffacb9e088d9d4bc7a9831e508bb1394a76))

## [9.7.0-alpha.5](https://github.com/Patternslib/patterns/compare/9.7.0-alpha.4...9.7.0-alpha.5) (2022-10-26)

### Bug Fixes

-   **pat markdown:** Restore old behavior where the trigger element was replaced with the rendered content wrapped in a div. ([ecb0330](https://github.com/Patternslib/patterns/commit/ecb0330e5a7c3909d1b7e3bf7c7dbf7dc90c5223))

## [9.7.0-alpha.4](https://github.com/Patternslib/patterns/compare/9.7.0-alpha.3...9.7.0-alpha.4) (2022-10-24)

### Features

-   **core dom:** Add "delete_data" to remove a previously set variable on a DOM element. ([6b128bf](https://github.com/Patternslib/patterns/commit/6b128bf3ccfbecd49ac5267505d734bb2bb45db4))

### Bug Fixes

-   **pat inject:** Fix closing of panels after successful inject. ([3ff3b60](https://github.com/Patternslib/patterns/commit/3ff3b60d293cc04af36189db15719cfa8810c450))Fix case where close-panel event was suppressed while injection is in progress but suppressing was never released.
    This prevented any other close-panel events from being handled properly.

## [9.7.0-alpha.3](https://github.com/Patternslib/patterns/compare/9.7.0-alpha.2...9.7.0-alpha.3) (2022-10-17)

### Features

-   **core basepattern:** Add one-time event listener registration method. ([7df79e7](https://github.com/Patternslib/patterns/commit/7df79e7018b884cba3210e37b888530aa5898282))This implements the one-time listener from the Base pattern.
    The "one" listener helper is used in "core.events.await_pattern_init" to wait for the pattern initialization to be finished.

### Bug Fixes

-   **core base:** Do not fail if initialized with an empty jQuery object. ([34b14b4](https://github.com/Patternslib/patterns/commit/34b14b48f039352eadf3912b514900e050f1ff10))

## [9.7.0-alpha.2](https://github.com/Patternslib/patterns/compare/9.7.0-alpha.1...9.7.0-alpha.2) (2022-10-15)

### Features

-   **Build:** Add distribution files to npm. ([a6e10a3](https://github.com/Patternslib/patterns/commit/a6e10a360f678317abbaa5f448180d4552576882))By adding the build to the npm package you can include Patternslib via CDN like:
    https://cdn.jsdelivr.net/npm/@patternslib/patternslib@9.7.0-alpha.2/dist/bundle.min.js
    or
    https://unpkg.com/@patternslib/patternslib@9.7.0-alpha.2/dist/bundle.min.js

-   **Tests:** Add $(":visible") pseudo selector for jQuery. ([7e8ccf4](https://github.com/Patternslib/patterns/commit/7e8ccf45733780b07d3e0985c5067454248b8312))

### Maintenance

-   **Build:** Move webpack Module Federation config from here to @patternslib/dev but keep backwards compatible exports in here. ([a0f7c07](https://github.com/Patternslib/patterns/commit/a0f7c0736e219be08744ce01cc675dd6f1d24ea5))

-   **Build:** Upgrade dependencies. ([d6c34ac](https://github.com/Patternslib/patterns/commit/d6c34ac4923fab5fa1a5917a8990948d66d16943))

-   **Docs:** Document core.dom.is_visible. ([e4f7bfe](https://github.com/Patternslib/patterns/commit/e4f7bfe02d8014169186d3fab19b4850a946eec8))

-   **Tests:** Remove unnecessary console.log from pat-validation tests. ([fdaea14](https://github.com/Patternslib/patterns/commit/fdaea14b53dc092b87044039fed0435a2f5597ed))

-   **Tests:** Remove unnecessary console.log statements from pat-clone-code tests. ([19843ad](https://github.com/Patternslib/patterns/commit/19843ad9a73b36485edcce4efb248c1a66a710a2))

-   **Tests:** Update is_visible mock to latest code changes - hidden is not set anymore due to form validation incompatibilities with Chrome. ([41e56e0](https://github.com/Patternslib/patterns/commit/41e56e0075ae53707667f1e92559ebe01e8bb74c))

-   **Tests:** Use real path for @patternslib/patternslib module mapping. When extending this config elsewhere the path would not be right. ([37520b7](https://github.com/Patternslib/patterns/commit/37520b72bd2c8c407659db5613b9ce79013bb0ff))

## [9.7.0-alpha.1](https://github.com/Patternslib/patterns/compare/9.7.0-alpha.0...9.7.0-alpha.1) (2022-10-11)

### Features

-   **Build:** Add global switch window.\_\_patternslib_disable_modernizr to optionally disable modernizr. ([2a0ec96](https://github.com/Patternslib/patterns/commit/2a0ec9641639f2f2fb77c1e565d2a109fbda6224))While this is convenient to quickly disable modernizr and also splits modernizr out from the main bundle entry file it was necessary for the clone-code pattern to get a clean code example for the whole html tree.

-   **core registry:** Move clone-code Pattern to the beginning. ([9f7f5ef](https://github.com/Patternslib/patterns/commit/9f7f5efeedec1cb79d7a1e69a1c01ebd927ce6ef))We want clone-code to clone the markup before any other patterns are
    modifying it.

-   **pat-date-picker:** Add placeholder support for styled behavior. ([752036f](https://github.com/Patternslib/patterns/commit/752036f9848172a2b74f6070c5be71e12a0ca046))/cc @cornae
    This fixes the following two issues:

Fixes: https://github.com/Patternslib/Patterns/issues/837
Fixes: https://github.com/quaive/ploneintranet.prototype/issues/1289

-   **pat-markdown:** Initialize syntax highlight when parsing markup. ([8fd88c0](https://github.com/Patternslib/patterns/commit/8fd88c01dfb21ab970d0e8679988ec805cba147c))

-   **pat-markdown:** Switch to marked as markdown library to support better syntax highlight libraries. ([3739935](https://github.com/Patternslib/patterns/commit/3739935a53315f0a1f0ad63b1626df4c5bcea62c))

-   **pat-sortable:** Add the sortable-item class to each sortable element. ([0513102](https://github.com/Patternslib/patterns/commit/051310242928b7bc283827f49816178a3e0f3531))The current situation requires the integrator to add the `sortable-item` class
    on all sortables manually. If that is not done there can be styling problems
    like a missing insert marker which makes it hard to use the pattern. As the
    pattern already defines what should be a sortable it we also let the pattern
    assign the class "sortable-item".

-   **pat-sortable:** Optionally import the sortable styles. ([fe90c73](https://github.com/Patternslib/patterns/commit/fe90c731093f4b84baef2e7359cb0829a9377bd3))Import the sortable styles when the global variable
    `__patternslib_import_styles` is set to `true` (the default is `false`).
    This allows to show the sortable marker without having to separately
    load all the styles.

-   **pat-sortable:** Support dynamic sortable lists. ([5f3076c](https://github.com/Patternslib/patterns/commit/5f3076c99e00e3012380c2eb927e616f22c27427))When new items were added to a sortable list e.g. via pat-clone or
    pat-inject, those items could not be sorted. We are now re-initializing
    the sortable pattern after a `pat-update` event and make new elements
    sortable.

-   **pat-syntax-highlight:** Switch to highlight.js. ([85212ba](https://github.com/Patternslib/patterns/commit/85212ba338ce488f737185553fdd3cd6444ac035))highlight.js allows to dyamically load languages in a webpack
    environment (almost, see next commit). Prism.js is mainly a Node.js
    library and currently not suited to load languages dynamically.

-   **pat-validation:** Validate also newly added form elements. ([8838da0](https://github.com/Patternslib/patterns/commit/8838da03a6ac9784a71d16358fc674265e9dd6ae))When form elements were added via user interaction - e.g. by using
    pat-clone or pat-inject - those elements were not validated. Now the
    form validation is re-initialized after a `pat-update` event and this
    problem is fixed.

### Bug Fixes

-   **core registry:** Do not scan TextNode content for patterns. ([76a83c5](https://github.com/Patternslib/patterns/commit/76a83c53c70643a77be2af045c1060823c0a4701))TextNode cannot hold markup, so there is also no needto scan those
    elements for patterns.

-   **pat-date-picker:** Do not throw a blur event after selecting a date. ([a20a883](https://github.com/Patternslib/patterns/commit/a20a883434c6010babd702f86df07ff5f53d7445))When a date was selected with the date picker a `blur` and `changed`
    event was thrown. Now we only throw a `changed` event if da date was
    selected. If no date was selected we throw a `blur` event allow
    pat-validation do validate required date input fields when no value was
    given.

-   **pat-syntax-highlight:** Depend on highlight.js <11. ([0f00d8c](https://github.com/Patternslib/patterns/commit/0f00d8c58d0b9f349e7214c7132bde87a449f010))highlight.js version 11 does not allow dynamic imports of languages and
    styles with webpack due to an exports field in package.json.

See: https://github.com/highlightjs/highlight.js/issues/3634

-   **pat-validation:** Fallback error messages for not-before and not-after. ([831ee60](https://github.com/Patternslib/patterns/commit/831ee60c5741c0b4dba6c3c2d7ba5beda1c71bf1))If no error messages were provided for the not-before and not-after
    constraints on date fields no error messages were shown even when those inputs
    had form validation errors.
    Now we are always providing a fallback error message based on the label
    or input name.

-   **pat-validation:** Fix problem with multiple form validation runs. ([a8b7981](https://github.com/Patternslib/patterns/commit/a8b7981de8138b7fe5ce5d7ca3c81517381afc89))Due to some event listers calling each other multiple times, the form
    was validated up to 5 times in one validation run. This commit fixes
    multiple validation runs when a form element was disabled, e.g. when the
    submit button was disabled after validation errors.

### Maintenance

-   **core utils:** Improve escape/unescape for safer version which makes use use of browser features. ([97ca0b1](https://github.com/Patternslib/patterns/commit/97ca0b11a36c17e46d949f6204a7094c07a25332))

-   **core utils:** safeClone - document which versions of IE are affected. ([8bec57a](https://github.com/Patternslib/patterns/commit/8bec57af7a5722bfd6070b2cb039749b427f5d6e))

-   **pat-markdown:** Modernize code. ([81c4e14](https://github.com/Patternslib/patterns/commit/81c4e14c035164007592523647a58807d8b2a899))

-   **pat-syntax-highlight:** Switch to class based pattern. ([8fb23e1](https://github.com/Patternslib/patterns/commit/8fb23e1f339de8260a3ad221af0302d149064b27))

-   **pat-toggle:** Add alias attribute for attr to toggle an attribute. ([fcfdb84](https://github.com/Patternslib/patterns/commit/fcfdb8481a14f4add1b4de120c9feb1b1400e6df))

-   **pat-validation:** Rename log to logger for better naming. ([9ed77c8](https://github.com/Patternslib/patterns/commit/9ed77c8b074b126cf32a4bca248273002426c426))

-   **pat-validation:** Use more debug messages. ([c8c656a](https://github.com/Patternslib/patterns/commit/c8c656a1d50a5388f81739b8888b604b9b4d26ca))

## [9.7.0-alpha.0](https://github.com/Patternslib/patterns/compare/9.6.1...9.7.0-alpha.0) (2022-09-28)

### Features

-   Add class based base pattern. ([5933a35](https://github.com/Patternslib/patterns/commit/5933a35bb2e511642d64fd53709d74492e41ad57))This is a new way to define Patterns by extending the BasePattern class and instantiating it on an element.
    This is additionally to the old Base pattern approach or even the very old approach of just defining a Pattern following the specs.
    The BasePattern class in core/basepattern uses JavaScript classes with all the object oriented benefits.
    Yes, that might be syntactic sugar, but then again not.

For usage see: src/core/basepattern.md

### Maintenance

-   **core registry:** Support class based pattern initialization. ([2c9e9dd](https://github.com/Patternslib/patterns/commit/2c9e9dde5c90a0a1a7cc0c490aaf4c29deb7a0c5))

## [9.6.1](https://github.com/Patternslib/patterns/compare/9.6.0...9.6.1) (2022-09-28)

### Bug Fixes

-   **core dom:** show/hide - do not set the hidden attribute. ([af24138](https://github.com/Patternslib/patterns/commit/af241382947f5fe9d2e4108baa34329fe9cdd610))In Chrome and Safari hidden but required input fields (e.g. hidden automatically by pat-autosuggest or pat-date-picker) cannot be submitted if they fail the browser's native validation.
    The browser tries to set a validation message but fails because the element is not focusable.
    See: https://stackoverflow.com/a/28340579/1337474

## [9.6.0](https://github.com/Patternslib/patterns/compare/9.5.0...9.6.0) (2022-09-28)

### Features

-   **core events:** Add blur and focus event factories. ([c5942d2](https://github.com/Patternslib/patterns/commit/c5942d2a784d116656913df73d681dfc48ff65c8))

-   **pat auto suggest:** Improve pat-validation integration. ([11e9a0b](https://github.com/Patternslib/patterns/commit/11e9a0b981ad1614fb700081c0de0c05d5181dff))Allow pat-validate to check for validity when select2 was interacted with but
    no value selected.

-   **pat date picker:** Improve pat-validation integration. ([57c974b](https://github.com/Patternslib/patterns/commit/57c974bd01e426bd6b8b1c69aaeffee8ee27c6cb))Allow pat-validate to check for validity when date picker was interacted with
    but no value selected.

-   **pat validation:** Validate whole form on submit or single error. ([bc27e41](https://github.com/Patternslib/patterns/commit/bc27e41cbd5586713cda8f1e7ae4cc2d69dc9f67))Validate the whole form when a single error happens and some elements were
    disabled or when a form submit is done.
    This gives the user a better feedback about any data problems in the
    form and allows the user to see any other errors at all since the submit
    elements could have been disabled and form validation would eventually
    not be triggered.

### Maintenance

-   **Build:** Upgrade dependencies. ([b3f4f0a](https://github.com/Patternslib/patterns/commit/b3f4f0a1bdcbb2f5647f6001a85bd29cbc60dac6))

-   **core dom:** Fix signature of removeAttribute in show method. ([58ddc8e](https://github.com/Patternslib/patterns/commit/58ddc8ebbfd8e290d438e971c8305064ebe035fe))

-   **pat date picker:** Use logging framework instead of console.log. ([e35932f](https://github.com/Patternslib/patterns/commit/e35932f2232e4cd3b319861edd9ba284206157ea))

-   Update close-panel documentation. ([4a4cd49](https://github.com/Patternslib/patterns/commit/4a4cd4943fec5332d103dbf3923681cb6f9a2576))

## [9.5.0](https://github.com/Patternslib/patterns/compare/9.4.0...9.5.0) (2022-09-27)

### Features

-   **pat close panel:** Better close-panel support. ([fbc20a8](https://github.com/Patternslib/patterns/commit/fbc20a8616e29af2f783788c8c302b0529917cd6))- Do not close panels when the form is invalid and submitted.

*   Simplify the close panel logic by switching to event based triggering.
*   Allow to postpone close panel events by pat-inject until successful
    injection.
*   Simplify pat-modal's close-panel logic.

-   **pat validation:** Add submit buttons to disable selector per default. ([e6f8ba3](https://github.com/Patternslib/patterns/commit/e6f8ba3afcee69cf68198a8b0ce9630c721c0144))

### Bug Fixes

-   **core registry:** Always put pat-validation first in the pattern execution chain. ([27fb575](https://github.com/Patternslib/patterns/commit/27fb5755b86561f31ee50c2004bcc80a570d1bb4))

-   **pat validation:** Fix problem with submitting invalid forms with pat-inject. ([b01819a](https://github.com/Patternslib/patterns/commit/b01819a294cfbc199f225a2cd3a40e2cbdb44b96))Stop submit event propagation if the form is invalid.
    This fixes a problem where a invalid form could be submitted via pat-inject.

### Maintenance

-   **pat navigation:** Remove console.log debug message from tests. ([4529761](https://github.com/Patternslib/patterns/commit/4529761f72a7c47b218b9258b2b1f2ee645429a6))

-   **pat validation:** Add modal use case to demo. ([aa99e2e](https://github.com/Patternslib/patterns/commit/aa99e2e31d70d9a375135863d04c215362bec2e8))

## [9.4.0](https://github.com/Patternslib/patterns/compare/9.3.1...9.4.0) (2022-09-23)

### Features

-   **pat forward:** Do not steal the click event. ([7755aa8](https://github.com/Patternslib/patterns/commit/7755aa841b395579894c576d978b0d21cf5a91ce))When a pat-forward element is clicked, allow to propagate the click event so that other handlers can also react.
    Fixes: https://github.com/Patternslib/Patterns/issues/1063

-   **pat tooltip:** Keep the title attribute for source ajax and content. ([fa6bff7](https://github.com/Patternslib/patterns/commit/fa6bff78b3f14a226d60a7bfaff12d82597a15fa))The tooltip element's title attribute is only stripped if the source is set to title (the default) and kept otherwise.
    Fixes: https://github.com/Patternslib/Patterns/issues/945

### Bug Fixes

-   **pat inject:** Update the URL earlier ([a02488d](https://github.com/Patternslib/patterns/commit/a02488d546666e04d3ac605f5d44fb77683229aa))Update the history/URL after the injection has been done and before post
    processing - e.g. scanning for new patterns - is happening.
    Other patterns like pat-navigation are depending on an updated URL state.

-   **pat navigation:** Fix selector for checking existing current classes. ([3091a29](https://github.com/Patternslib/patterns/commit/3091a2984b05c32633e2af855a629422ce4a5305))

## [9.3.1](https://github.com/Patternslib/patterns/compare/9.3.0...9.3.1) (2022-09-21)

### Maintenance

-   **Build:** Upgrade pat-upload to 3.1.1 to fix the previous pat-upload brown bag release. ([030b801](https://github.com/Patternslib/patterns/commit/030b801ac233188ecbd454e3e84285c764143011))pat-upload 3.1.0 did not include the advertised changes and was basically the same as 3.0.0.

## [9.3.0](https://github.com/Patternslib/patterns/compare/9.3.0-beta.0...9.3.0) (2022-09-20)

### Features

-   **pat navigation:** Mark the navigation items after injection. ([ec2a795](https://github.com/Patternslib/patterns/commit/ec2a7957da8bfca9e96f8b1aea6a81002aa79b30))After a pat-inject has updated the navigation, re-mark all navigation items.
    This is an alternative and approach to the previous mutation observer based one.

### Maintenance

-   **Build:** Upgrade dependencies. ([60b4e2e](https://github.com/Patternslib/patterns/commit/60b4e2e1693dcfbe34e8bf7a3d46de9ddef05f6f))

## [9.3.0-beta.0](https://github.com/Patternslib/patterns/compare/9.2.1...9.3.0-beta.0) (2022-09-16)

### Maintenance

-   **core base:** Remove console.log statement from tests. ([09d533e](https://github.com/Patternslib/patterns/commit/09d533e3d8995eb5e72fec374a7a7410a8a7f707))

### Breaking Changes

-   **pat navigation:** Improve performance by removing the unnecessary mutation observer. ([7c28913](https://github.com/Patternslib/patterns/commit/7c289134205042f358e458c47a2a695d8e6192a8))Since we're almost always using pat-inject for replacing or adding DOM nodes
    and we already have support for pat-inject here, the mutation observer is not
    necessary. Removing it improves the performance in situations where the
    navigation structure is updated - for example off-canvas navigation updates
    with pat-tabs would invoke many mutation observer callback hits. The previous
    performance improvement solved the performance penalty by deferring the
    callback for 10ms, but this is taking that further by avoiding it at all.

## [9.2.1](https://github.com/Patternslib/patterns/compare/9.2.0...9.2.1) (2022-09-16)

### Bug Fixes

-   **pat navigation:** Do not break when no item wrapper is found. ([6c84a41](https://github.com/Patternslib/patterns/commit/6c84a414215f8cfb589a02666a567895a543c4b8))

-   **pat navigation:** Improve the performance when the navigation elements change. ([a6ec32b](https://github.com/Patternslib/patterns/commit/a6ec32ba74340b567b8e36e5a2687b1072731f55))Debounce the mutation observer callback which initialized the markings for 100ms for better performance.

-   **pat navigation:** Initialize the click handler on the element directly. ([0b099cc](https://github.com/Patternslib/patterns/commit/0b099cc4c170f93d895d6ef536a017e47d8e4150))This way it needs to be initialized only once, even if the subtree changes.
    Remove the init_listeners from the mutation observer for better
    performance.

-   **pat navigation:** Only search within the current element. ([417085e](https://github.com/Patternslib/patterns/commit/417085e7837285a46420ee1ac28ff1e7ee14745f))

-   **pat navigation:** Remove mockup-related checking of input fields. ([1e5afe7](https://github.com/Patternslib/patterns/commit/1e5afe7a8a4de67c556d70ad30c4f2feed3ba4a5))

## [9.2.0](https://github.com/Patternslib/patterns/compare/9.1.1...9.2.0) (2022-09-15)

### Features

-   **pat close panel:** Support for closing dialog panels. ([7593048](https://github.com/Patternslib/patterns/commit/7593048044126153d7868b36128ac4ec2e3c7564))

-   **pat navigation:** Add URL-based navigation markers. ([9a0f7a3](https://github.com/Patternslib/patterns/commit/9a0f7a3dc4684361a3dc6c1c8663f9cb139e6e72))That feature was also present in the old implementation but is now improved.

-   **pat navigation:** Always set in-path classes. ([16bc8a2](https://github.com/Patternslib/patterns/commit/16bc8a26733771e7ea184ec7ada018a3a3422043))When doing URL based checkings do always set the in-path classes for an active submenu item, even if it does not match the URL path hierachy.

-   **pat navigation:** Support click-only markings. ([904e54f](https://github.com/Patternslib/patterns/commit/904e54fabedf3a128857a45dccf13974e61f7916))Mark the navigation items also on clicks on anchors without pat-inject.

-   **pat navigation:** When a navigation wrapper is in-path, also mark the corresponding anchor as in-path. ([e9da003](https://github.com/Patternslib/patterns/commit/e9da00330f2f6a866d1e1b7e688e3fca6f3eeecf))

### Bug Fixes

-   **Build:** Register jQuery globally. ([e72f41a](https://github.com/Patternslib/patterns/commit/e72f41aedf1ca45a1c1ac785b726ca9180621231))Since the module federation support jQuery was registered globally too late for some scripts.
    Now jQuery is registered as soon as the index.js is loaded.
    This allows for following scripts to use jQuery.

-   **core base:** Do not break when initialized with no element. ([cd16107](https://github.com/Patternslib/patterns/commit/cd1610732d47a48a2a2d5ba25f56ef8dc5a74458))

### Breaking Changes

-   **pat navigation:** Set explicit pattern trigger. ([968edca](https://github.com/Patternslib/patterns/commit/968edca2c677359115ff0687b1174ba1d2307c33))Do only trigger the pattern on the `.pat-navigation` class and remove the trigger for `.navigation` classes and `<nav>` elements.

### Maintenance

-   **core dom:** Code optimization for dom.find_parents. ([de1fb71](https://github.com/Patternslib/patterns/commit/de1fb718e794b26ba03fe2c18cec13e560589965))

-   **core dom:** Update documentation. ([4ac25cc](https://github.com/Patternslib/patterns/commit/4ac25cc146a7f4dcb3767f8541fe02881714bd87))

-   HTMLDialogElement support not in @patternslib/dev 2.7.0. ([d2c279f](https://github.com/Patternslib/patterns/commit/d2c279f22b2db60828014cbe4646c7a76e5876db))

-   Modernize header markup in demo files. ([2f366e9](https://github.com/Patternslib/patterns/commit/2f366e9b84caa937db0d9ceb520f49d159933b82))

-   **pat inject:** Move core.utils.rebaseURL to inject patterns. ([144240d](https://github.com/Patternslib/patterns/commit/144240de790d6b4e9d6e73f8fef7cd02d8fb66d7))core.utils.rebaseURL was only used by the inject pattern and is in this form not useful for broader use.
    If you need to rebase an relative or absolute URL against a base url, use:
    new URL(url, base_url)

-   **pat inject:** Specify allowed values for the history parameter. ([e36c58c](https://github.com/Patternslib/patterns/commit/e36c58cf147551f77c11e55d2dcf0f16ae024cd4))

-   **pat navigation:** Modernize code. ([f5269de](https://github.com/Patternslib/patterns/commit/f5269de5666be68ba0e38989fe22ebb2b63dd5a3))

-   **pat navigation:** Refactor implementation for more stability. ([458e76b](https://github.com/Patternslib/patterns/commit/458e76bf47e4ea2ad6ac1741a5872b574862280a))

-   Upgrade dependencies. ([806fc24](https://github.com/Patternslib/patterns/commit/806fc24f8bc032df5042e9b76d6fb0da490941e4))

## [9.1.1](https://github.com/Patternslib/patterns/compare/9.1.0...9.1.1) (2022-09-08)

### Bug Fixes

-   **pat display time:** Fix relative time for timezone corner cases. ([3c62c65](https://github.com/Patternslib/patterns/commit/3c62c658099be5ef155069cac943bffc3959bf4e))For date-only from-now, just use Intl.RelativeTimeFormat to avoid any
    timezone calculation mistakes. This prevents a case where in days in the
    future or past were shown as 9 days due to timezone differences in some
    circumstances.

### Maintenance

-   **pat display time:** Extend the demo. ([2bd1ff6](https://github.com/Patternslib/patterns/commit/2bd1ff6f970c602a84c4e65548e977ddd9b75f1a))

-   **pat inject:** Correct docs that the history parameter does not have record set as default. ([7f06eda](https://github.com/Patternslib/patterns/commit/7f06edaa873d67c1105838c989ed9011e73c9cfd))

-   **pat inject:** Re-organize the demos. ([3d3e8c3](https://github.com/Patternslib/patterns/commit/3d3e8c356d9156757719a75c2b452a2d3ac44703))- Create dedicated `demo` folder and move demo files in there.

*   Remove inject-history folder and move demo into inject.

## [9.1.0](https://github.com/Patternslib/patterns/compare/9.1.0-beta.4...9.1.0) (2022-09-06)

### Bug Fixes

-   **pat sortable:** Fix sorting functionality when sort item has any other class than .sortable. ([75815a6](https://github.com/Patternslib/patterns/commit/75815a6659b4385c1301f1947424861bcacb08c2))

### Maintenance

-   **pat display time:** Fix tests and demo which failed due to timezone offsets around midnight. ([a5d0695](https://github.com/Patternslib/patterns/commit/a5d06958811173445fa6033a2b8a44eb11756a91))

## [9.1.0-beta.4](https://github.com/Patternslib/patterns/compare/9.1.0-beta.3...9.1.0-beta.4) (2022-09-05)

### Bug Fixes

-   **Build:** Resolve to jquery 3.6.1 to not include mutliple jquery versions. ([e1c7d01](https://github.com/Patternslib/patterns/commit/e1c7d017d9ae5a6252db9f0f57b13543273f0002))

## [9.1.0-beta.3](https://github.com/Patternslib/patterns/compare/9.1.0-beta.2...9.1.0-beta.3) (2022-09-05)

### Features

-   **pat sortable:** Trigger pat-update after sorting changes. ([3bb5513](https://github.com/Patternslib/patterns/commit/3bb5513165c4d0791bafc78533c14d31bfe2038a))Other patterns can react on that for example submitting the form with pat-auto-submit.

### Bug Fixes

-   **pat auto submit:** Support pat-clone and pat-sortable. ([4ec72ef](https://github.com/Patternslib/patterns/commit/4ec72ef5bb71ce429ac144e1499c9ca1f4962a1b))When pat-clone adds an element, initialize that element to listen for changes.
    When pat-clone removes an element or pat-sortable changes the order, submit the form.

### Maintenance

-   **Build:** Upgrade dependencies. ([e5e2c7b](https://github.com/Patternslib/patterns/commit/e5e2c7b1d2377bb9184f3e19db6296a3826c74a4))

## [9.1.0-beta.2](https://github.com/Patternslib/patterns/compare/9.1.0-beta.1...9.1.0-beta.2) (2022-08-23)

### Maintenance

-   Upgrade pat-tiptap to 4.5.0. ([423dfc7](https://github.com/Patternslib/patterns/commit/423dfc76267f72a34c69f4f13a1b588f37814bcc))

## [9.1.0-beta.1](https://github.com/Patternslib/patterns/compare/9.1.0-beta.0...9.1.0-beta.1) (2022-08-19)

### Features

-   **core base:** Add pattern property autoregister to allow patterns which are not automatically registered in the patternslib registry. ([ef4d234](https://github.com/Patternslib/patterns/commit/ef4d234e7bae2990b556e03159127565b372a0b2))

-   **pat inject:** Dispatch a patterns-injected-delayed event 10ms after the injection has been done and pass the injected content with it. This allows to re-scan the injected content in cases where a pattern wasn't registered at injection time. ([00b66fe](https://github.com/Patternslib/patterns/commit/00b66fee54875a40029291a8a884b2ab1762f5d1))

### Bug Fixes

-   **pat inject:** Fix code error with not scanning and triggering for comment nodes. ([c281ae4](https://github.com/Patternslib/patterns/commit/c281ae45d8d4c6f6640b57a698a5115a914dddf7))

-   **pat validation:** Do not trigger a pat-update after validation. ([b4603c9](https://github.com/Patternslib/patterns/commit/b4603c9ea6e485fb12b5e319f1421dc593d081b6))

### Maintenance

-   **Build:** Unlink all eventually linked [@patternslib](https://github.com/patternslib) dependencies before building bundles. ([debeeea](https://github.com/Patternslib/patterns/commit/debeeead65c1f29003367567c254a2ff3150487a))

-   **Build:** Upgrade dependencies. ([515bf42](https://github.com/Patternslib/patterns/commit/515bf42d4424459cf1c98b03f0651f63077de411))

-   **pat inject:** Minor test restructuring. ([e740a88](https://github.com/Patternslib/patterns/commit/e740a8896fccb3a1b998a93272e0eb76befec5c7))

-   **pat validation:** Add input with type URL example to demo. ([b3e98e0](https://github.com/Patternslib/patterns/commit/b3e98e0f9beac543b285e85f009b245b5776787f))

## [9.1.0-beta.0](https://github.com/Patternslib/patterns/compare/9.0.1...9.1.0-beta.0) (2022-08-11)

### Features

-   **core utils:** Add date_diff to calculate the difference in days between two dates, respecting DST‌ offsets. ([dd5cc7b](https://github.com/Patternslib/patterns/commit/dd5cc7b310d2d58646892a5e71d17a08f7757909))

-   **core utils:** Add is_iso_date check for testing for iso dates only. ([a90afd6](https://github.com/Patternslib/patterns/commit/a90afd6f7e004b4afb6bc0163bd0f1c8efb5008e))

-   **pat display time:** Improve the output for date-only dates in relative mode. ([e3909a4](https://github.com/Patternslib/patterns/commit/e3909a4aa1d9f3d1baab934094ce03f096776bdf))When output is from-now (relative date) and the date is a date-only date without a time component, do not include the time in the output.

### Maintenance

-   **Build:** Include bundle name and version in generated files (Feature of @patternslib/dev 2.4.0.) ([392998e](https://github.com/Patternslib/patterns/commit/392998efa29264e4e06099ec0ec81742cdc45248))

-   **pat display time:** Improve the documentation. ([ef13602](https://github.com/Patternslib/patterns/commit/ef1360264f6cdbbdf4126707ab3a49dd669a0cbf))

-   Upgrade dependencies. ([070b262](https://github.com/Patternslib/patterns/commit/070b26269e271091b6b1c071dbc5bffd96ec0ac8))

## [9.0.1](https://github.com/Patternslib/patterns/compare/9.0.0...9.0.1) (2022-07-20)

### Bug Fixes

-   **Build:** Fix luxon to 2.4.0 to avoid webpack MF error due to non standard package.json setup. ([784f036](https://github.com/Patternslib/patterns/commit/784f036e34b5cae6f5480a02082d985b6b270760))

-   **pat tooltip:** Avoid repositioning of the tooltip arrow. ([880ebdb](https://github.com/Patternslib/patterns/commit/880ebdb9587dfb66b4d0191aa1df9a68f9fe1791))- Setting the tooltip-container class before async calls.

*   Avoid unnecessary repaints by grouping dom manipulations together.
*   Merge onMount and onShow into onShow method.

## [9.0.0](https://github.com/Patternslib/patterns/compare/9.0.0-beta.1...9.0.0) (2022-07-17)

### Features

-   **Webpack Module Federation:** Dispatch the event patternslib_mf--loaded when all remotes have been initialized. ([9c86483](https://github.com/Patternslib/patterns/commit/9c86483b5f5c117fb20c453eb5dd32558115f8b7))

### Bug Fixes

-   **pat modal:** Trigger `pat-modal-ready` event only once. ([ddb7c5d](https://github.com/Patternslib/patterns/commit/ddb7c5d5adbee5d4436025b332045a11cf6746cc))For pat-modal instances on anchor elements where pat-inject is involved the
    event `pat-modal-ready` was triggered twice. This is now fixed and the event
    is only triggered after the modal was inserted.

-   **pat tooltip:** Fix problem with misaligned tooltip arrow with remote content. ([4656100](https://github.com/Patternslib/patterns/commit/46561005cb82c4a7b3f459e8099f37d604d8c95f))

-   **pat tooltip:** Initialize Patterns directly after getting content. ([e601fd8](https://github.com/Patternslib/patterns/commit/e601fd8e16690d2819df5f9a77db30963cdcc2df))This fixes a problem where onMount was initializing Patterns before get_content returned and inserted the content.

### Maintenance

-   **Bundle:** Upgrade pat-tiptap to 4.3.0. ([24bfa4b](https://github.com/Patternslib/patterns/commit/24bfa4bedab30b54f4b4231a981e3393742bbfb3))

-   **core base:** Document prevention of pattern double initialization in asynchronous cases. ([1d9bb38](https://github.com/Patternslib/patterns/commit/1d9bb381e6151fbe0e3f7d642f45b0bd4af8854d))

-   **pat modal:** Document how pat-modal works. ([2015e89](https://github.com/Patternslib/patterns/commit/2015e897de7c50fcfa894f2f86f53fb5a1d26056))

## [9.0.0-beta.1](https://github.com/Patternslib/patterns/compare/9.0.0-beta.0...9.0.0-beta.1) (2022-07-08)

### Bug Fixes

-   **pat depends:** Allow input names with colons in the parser, as used in Plone. ([48298c2](https://github.com/Patternslib/patterns/commit/48298c2e1ebe5e009b32b041d6ded50476fc3ed5))

### Maintenance

-   **Build:** Upgrade Moment to 2.29.4. ([a0bf6fd](https://github.com/Patternslib/patterns/commit/a0bf6fd9cbe29110fb1d40c98fff115dd9097172))

-   **Build:** Upgrade to @patternslib/dev 2.3.0. ([a02619e](https://github.com/Patternslib/patterns/commit/a02619eb8a07d14ccc74404ad9d0d188fe3a8f7a))

-   **pat checkbox:** Do not include styles and make the demo better usable. ([7cd1dc3](https://github.com/Patternslib/patterns/commit/7cd1dc32ac5ed10edc096b5d0ccfa0f39b81912d))

-   **pat depends:** Change Makefile to generate the parser optimized for size and output it as ES module. ([3bfd39f](https://github.com/Patternslib/patterns/commit/3bfd39ff51fbe29003f6c05c4b76ce6bbfe2737a))

-   **pat depends:** Depend on latest pegjs for generating the depends parser. ([5339822](https://github.com/Patternslib/patterns/commit/5339822c7b8ab1343912637bda69e0b1c71daf05))

-   **pat depends demo:** Add demo with optional date fields. ([bfd5dbe](https://github.com/Patternslib/patterns/commit/bfd5dbe4a363a475b0e65932973420ad0b1044a6))

-   **pat depends demo:** Demo colons in input names. ([e882f4f](https://github.com/Patternslib/patterns/commit/e882f4ffd37efa79f61f8cb741e5be69f223ad46))

-   **pat depends demo:** Demo multiselection. ([85a824a](https://github.com/Patternslib/patterns/commit/85a824ac241c4a5fe90bc45b6bcdad257b9815d2))

-   **pat depends demo:** Set to import styles in JavaScript so that auto-suggest is styled. ([e8b2ea2](https://github.com/Patternslib/patterns/commit/e8b2ea27ed99ccf8123277b7b2bc348325b52038))

-   Add .eslintignore and ignore generated depends_parse.js file. ([f9bc55f](https://github.com/Patternslib/patterns/commit/f9bc55f3b3e103e15f48bd2ed0f29bbf6066f2e3))

-   Do not define \_\_patternslib_import_styles, so that it can be defined by another script without being overwritten. ([7101d23](https://github.com/Patternslib/patterns/commit/7101d232b2d8e547338d36acef152b360327fcb1))

## [9.0.0-beta.0](https://github.com/Patternslib/patterns/compare/9.0.0-alpha.1...9.0.0-beta.0) (2022-06-29)

### Bug Fixes

-   Configure module alias for @patternslib/patternslib so that extended jest config from dev does not fail. ([ce89f24](https://github.com/Patternslib/patterns/commit/ce89f24d13323f6b95d17be3a24f6b2848585f22))

-   **pat scroll box:** Fix issue where elastic scrolling on Safari would remove the scroll-position-top class for a moment when overscrolling on top. ([596fd06](https://github.com/Patternslib/patterns/commit/596fd06f87090201e72a4086e4ea0d3313197fae))

### Maintenance

-   **Build:** Adapt to latest module federation changes in @patternslib/dev 2.2.0. ([c2f4d37](https://github.com/Patternslib/patterns/commit/c2f4d37ed8858b31d50ebc6102841923cc495bc3))

-   **Build:** Add a watch Makefile target and package.json script. ([c48ff3e](https://github.com/Patternslib/patterns/commit/c48ff3eeb37e5fcaf91a9a63662d43070a4032d3))

-   **Build:** Update @patternslib/dev to 2.2.0. ([a1550ca](https://github.com/Patternslib/patterns/commit/a1550ca81dcd5e93f5996eb576ccc090643290b1))

-   **Build:** Upgrade all pat-\* dependency packages to it's latest version. ([4628120](https://github.com/Patternslib/patterns/commit/46281203a81b969d16996250bb47b81f9e05568c))

-   **Build:** Upgrade dependencies. ([eaeed1a](https://github.com/Patternslib/patterns/commit/eaeed1acc4f5404c462140561b555b13457e68ad))

-   **pat scroll box:** Document that scroll-down and scroll-up classes are not cleared after scrolling has stopped. ([52f4343](https://github.com/Patternslib/patterns/commit/52f4343f583d09bd65bc6de89306515eb768d30d))

-   **pat scroll box:** Improve demo styles. ([61fa3d8](https://github.com/Patternslib/patterns/commit/61fa3d8469bbe0a7ec241f75c7a0fb500190e6f9))

## [9.0.0-alpha.1](https://github.com/Patternslib/patterns/compare/9.0.0-alpha.0...9.0.0-alpha.1) (2022-06-15)

### Features

-   **Build:** Allow Patternslib add-ons to be built within the Patternslib package as part of a Patternslib bundle distribution by defining an alias for @patternslib/patternslib. ([d4ae08b](https://github.com/Patternslib/patterns/commit/d4ae08b699af1d785efac6005867810869105df3))

-   **Bundle:** Create a universal bundle. ([9215532](https://github.com/Patternslib/patterns/commit/92155325fce0f09983f23a0e84c7913819dc2f98))Add more external patterns in order to create a universal drop-in bundle for Patternslib.
    Patterns added:

    -   pat-content-mirror
    -   pat-doclock
    -   pat-shopping-cart
    -   pat-sortable-table
    -   pat-tiptap
    -   pat-upload

### Breaking Changes

-   Depend on @patternslib/dev and extend config from there. ([aea3681](https://github.com/Patternslib/patterns/commit/aea3681182bed03121c97943113a6a0782b7d2e1))

-   Extend babel config from @patternslib/dev. ([83cef90](https://github.com/Patternslib/patterns/commit/83cef9073ba19f7364b8abd18a105655990eb80a))

-   Extend commitlint config from @patternslib/dev. ([9216ed7](https://github.com/Patternslib/patterns/commit/9216ed7c90e00ee9e5d7b03c3cfa45d1cc29a16b))

-   Extend eslint config from @patternslib/dev. ([2cfeadc](https://github.com/Patternslib/patterns/commit/2cfeadc722b3609102b28fe03beb45a6ad55a06a))

-   Extend jest config from @patternslib/dev. ([125a4f7](https://github.com/Patternslib/patterns/commit/125a4f757a0b98dd72ec7ccca4f707ccb6e45fa0))

-   Extend Makefile from @patternslib/dev. ([923efe3](https://github.com/Patternslib/patterns/commit/923efe3b9d86a0c757e9757a43c4592a87072a58))

-   Extend prettier config from @patternslib/dev. ([0bbbdca](https://github.com/Patternslib/patterns/commit/0bbbdca7b73a56907aeaa9dc062037fec740d924))

-   Extend release-it config from @patternslib/dev. ([b692ce0](https://github.com/Patternslib/patterns/commit/b692ce03c195e9dbe6b83e87bf75488dd5856495))

-   Extend webpack config from @patternslib/dev. ([208726f](https://github.com/Patternslib/patterns/commit/208726fb750cbd78ec6a599e261b849f94e592be))

### Maintenance

-   Do not eslint the generated depends_parse file. ([dbfd33f](https://github.com/Patternslib/patterns/commit/dbfd33fefc6d0b9458d386fcd49de395c829bdd6))

-   Move webpack.dist.js back to webpack.config.js. ([20f1d68](https://github.com/Patternslib/patterns/commit/20f1d684a0706730fef4b79ddcc9a629fd2e1911))

-   Remove unused variables from Makefile. ([141ade4](https://github.com/Patternslib/patterns/commit/141ade433b3a961531917154abf7f1537c34e045))

## [9.0.0-alpha.0](https://github.com/Patternslib/patterns/compare/8.1.0...9.0.0-alpha.0) (2022-06-14)

### Features

-   **Build:** Create Module Federation enabled bundles within Patternslib. ([ef28e21](https://github.com/Patternslib/patterns/commit/ef28e215fc3d6446ab8ca5d84ce29d363f4dbf48))

-   **Build:** Externalize Patternslib core webpack config to allow customizing Patternslib bundles without affecting add-on packages which depend on webpack.config.js. ([3e9dd6c](https://github.com/Patternslib/patterns/commit/3e9dd6cae7eceaa0ea8727c2df811daa5945bdc7))

### Bug Fixes

-   **Build:** Do not re-initialize already initialized bundles. ([8c0499f](https://github.com/Patternslib/patterns/commit/8c0499f340d78ac3e0d7d9c8b20657babefe66b1))

### Maintenance

-   **Build:** Extend jest.config.js in a way that it is extendable by add-on packages. ([f16b3a5](https://github.com/Patternslib/patterns/commit/f16b3a5cf724c4eb4b54f8fa2811f559d5c1d70c))

-   **Build:** Extend test setup code. ([00f1a34](https://github.com/Patternslib/patterns/commit/00f1a347e765266a67d4738160343548728c8a01))Add more setup code to mock Web API features for tests from other Patternslib add-on packages.

-   **Build:** Remove dependency @babel/plugin-proposal-optional-chaining which is included in Babel since 7.8. ([cfd5cd4](https://github.com/Patternslib/patterns/commit/cfd5cd49b62bba0328a3c8cd87236174383c3d60))

-   **Build:** Remove dependency regenerator-runtime except from test setup. The async/await runtime handling is already built-in in current Babel. ([f8a9889](https://github.com/Patternslib/patterns/commit/f8a988909bcd64b1e72996b9d931e03ae82cc446))

-   **Build:** Remove unused @testing-library/jest-dom. ([6aeefc5](https://github.com/Patternslib/patterns/commit/6aeefc5bd2d322b9b49050db65ae4adb76d1cffd))

-   **Build:** Remove unused inspectpack. ([a586a5d](https://github.com/Patternslib/patterns/commit/a586a5d72cb5a77a0d75cbb776c84911d1bd9641))

-   **Build:** Upgrade dependencies. ([d0739d6](https://github.com/Patternslib/patterns/commit/d0739d600ee8784c3651fd55067d7475ac0b67ec))

-   **docs:** Move upgrade 2 to 3 guide to history section. ([5449491](https://github.com/Patternslib/patterns/commit/5449491cbb851af9d1a2b3f5f017a6b599f8d9a7))

-   **docs:** Remove outdated roadmap and version files. ([8f9e0cb](https://github.com/Patternslib/patterns/commit/8f9e0cb5a992303d961c4a9790a41ceb3e77547c))
