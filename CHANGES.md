# Changelog

See the [history](./docs/history/index.md) for older changelog entries.



## [9.0.0](https://github.com/Patternslib/patterns/compare/9.0.0-beta.1...9.0.0) (2022-07-17)


### Features


* **Webpack Module Federation:** Dispatch the event patternslib_mf--loaded when all remotes have been initialized. ([9c86483](https://github.com/Patternslib/patterns/commit/9c86483b5f5c117fb20c453eb5dd32558115f8b7))


### Bug Fixes


* **pat modal:** Trigger ``pat-modal-ready`` event only once. ([ddb7c5d](https://github.com/Patternslib/patterns/commit/ddb7c5d5adbee5d4436025b332045a11cf6746cc))For pat-modal instances on anchor elements where pat-inject is involved the
event ``pat-modal-ready`` was triggered twice. This is now fixed and the event
is only triggered after the modal was inserted.

* **pat tooltip:** Fix problem with misaligned tooltip arrow with remote content. ([4656100](https://github.com/Patternslib/patterns/commit/46561005cb82c4a7b3f459e8099f37d604d8c95f))

* **pat tooltip:** Initialize Patterns directly after getting content. ([e601fd8](https://github.com/Patternslib/patterns/commit/e601fd8e16690d2819df5f9a77db30963cdcc2df))This fixes a problem where onMount was initializing Patterns before get_content returned and inserted the content.


### Maintenance


* **Bundle:** Upgrade pat-tiptap to 4.3.0. ([24bfa4b](https://github.com/Patternslib/patterns/commit/24bfa4bedab30b54f4b4231a981e3393742bbfb3))

* **core base:** Document prevention of pattern double initialization in asynchronous cases. ([1d9bb38](https://github.com/Patternslib/patterns/commit/1d9bb381e6151fbe0e3f7d642f45b0bd4af8854d))

* **pat modal:** Document how pat-modal works. ([2015e89](https://github.com/Patternslib/patterns/commit/2015e897de7c50fcfa894f2f86f53fb5a1d26056))

## [9.0.0-beta.1](https://github.com/Patternslib/patterns/compare/9.0.0-beta.0...9.0.0-beta.1) (2022-07-08)


### Bug Fixes


* **pat depends:** Allow input names with colons in the parser, as used in Plone. ([48298c2](https://github.com/Patternslib/patterns/commit/48298c2e1ebe5e009b32b041d6ded50476fc3ed5))


### Maintenance


* **Build:** Upgrade Moment to 2.29.4. ([a0bf6fd](https://github.com/Patternslib/patterns/commit/a0bf6fd9cbe29110fb1d40c98fff115dd9097172))

* **Build:** Upgrade to @patternslib/dev 2.3.0. ([a02619e](https://github.com/Patternslib/patterns/commit/a02619eb8a07d14ccc74404ad9d0d188fe3a8f7a))

* **pat checkbox:** Do not include styles and make the demo better usable. ([7cd1dc3](https://github.com/Patternslib/patterns/commit/7cd1dc32ac5ed10edc096b5d0ccfa0f39b81912d))

* **pat depends:** Change Makefile to generate the parser optimized for size and output it as ES module. ([3bfd39f](https://github.com/Patternslib/patterns/commit/3bfd39ff51fbe29003f6c05c4b76ce6bbfe2737a))

* **pat depends:** Depend on latest pegjs for generating the depends parser. ([5339822](https://github.com/Patternslib/patterns/commit/5339822c7b8ab1343912637bda69e0b1c71daf05))

* **pat depends demo:** Add demo with optional date fields. ([bfd5dbe](https://github.com/Patternslib/patterns/commit/bfd5dbe4a363a475b0e65932973420ad0b1044a6))

* **pat depends demo:** Demo colons in input names. ([e882f4f](https://github.com/Patternslib/patterns/commit/e882f4ffd37efa79f61f8cb741e5be69f223ad46))

* **pat depends demo:** Demo multiselection. ([85a824a](https://github.com/Patternslib/patterns/commit/85a824ac241c4a5fe90bc45b6bcdad257b9815d2))

* **pat depends demo:** Set to import styles in JavaScript so that auto-suggest is styled. ([e8b2ea2](https://github.com/Patternslib/patterns/commit/e8b2ea27ed99ccf8123277b7b2bc348325b52038))

* Add .eslintignore and ignore generated depends_parse.js file. ([f9bc55f](https://github.com/Patternslib/patterns/commit/f9bc55f3b3e103e15f48bd2ed0f29bbf6066f2e3))

* Do not define __patternslib_import_styles, so that it can be defined by another script without being overwritten. ([7101d23](https://github.com/Patternslib/patterns/commit/7101d232b2d8e547338d36acef152b360327fcb1))

## [9.0.0-beta.0](https://github.com/Patternslib/patterns/compare/9.0.0-alpha.1...9.0.0-beta.0) (2022-06-29)


### Bug Fixes


* Configure module alias for @patternslib/patternslib so that extended jest config from dev does not fail. ([ce89f24](https://github.com/Patternslib/patterns/commit/ce89f24d13323f6b95d17be3a24f6b2848585f22))

* **pat scroll box:** Fix issue where elastic scrolling on Safari would remove the scroll-position-top class for a moment when overscrolling on top. ([596fd06](https://github.com/Patternslib/patterns/commit/596fd06f87090201e72a4086e4ea0d3313197fae))


### Maintenance


* **Build:** Adapt to latest module federation changes in @patternslib/dev 2.2.0. ([c2f4d37](https://github.com/Patternslib/patterns/commit/c2f4d37ed8858b31d50ebc6102841923cc495bc3))

* **Build:** Add a watch Makefile target and package.json script. ([c48ff3e](https://github.com/Patternslib/patterns/commit/c48ff3eeb37e5fcaf91a9a63662d43070a4032d3))

* **Build:** Update @patternslib/dev to 2.2.0. ([a1550ca](https://github.com/Patternslib/patterns/commit/a1550ca81dcd5e93f5996eb576ccc090643290b1))

* **Build:** Upgrade all pat-* dependency packages to it's latest version. ([4628120](https://github.com/Patternslib/patterns/commit/46281203a81b969d16996250bb47b81f9e05568c))

* **Build:** Upgrade dependencies. ([eaeed1a](https://github.com/Patternslib/patterns/commit/eaeed1acc4f5404c462140561b555b13457e68ad))

* **pat scroll box:** Document that scroll-down and scroll-up classes are not cleared after scrolling has stopped. ([52f4343](https://github.com/Patternslib/patterns/commit/52f4343f583d09bd65bc6de89306515eb768d30d))

* **pat scroll box:** Improve demo styles. ([61fa3d8](https://github.com/Patternslib/patterns/commit/61fa3d8469bbe0a7ec241f75c7a0fb500190e6f9))

## [9.0.0-alpha.1](https://github.com/Patternslib/patterns/compare/9.0.0-alpha.0...9.0.0-alpha.1) (2022-06-15)


### Features


* **Build:** Allow Patternslib add-ons to be built within the Patternslib package as part of a Patternslib bundle distribution by defining an alias for @patternslib/patternslib. ([d4ae08b](https://github.com/Patternslib/patterns/commit/d4ae08b699af1d785efac6005867810869105df3))

* **Bundle:** Create a universal bundle. ([9215532](https://github.com/Patternslib/patterns/commit/92155325fce0f09983f23a0e84c7913819dc2f98))Add more external patterns in order to create a universal drop-in bundle for Patternslib.
Patterns added:

  - pat-content-mirror
  - pat-doclock
  - pat-shopping-cart
  - pat-sortable-table
  - pat-tiptap
  - pat-upload


### Breaking Changes


* Depend on @patternslib/dev and extend config from there. ([aea3681](https://github.com/Patternslib/patterns/commit/aea3681182bed03121c97943113a6a0782b7d2e1))

* Extend babel config from @patternslib/dev. ([83cef90](https://github.com/Patternslib/patterns/commit/83cef9073ba19f7364b8abd18a105655990eb80a))

* Extend commitlint config from @patternslib/dev. ([9216ed7](https://github.com/Patternslib/patterns/commit/9216ed7c90e00ee9e5d7b03c3cfa45d1cc29a16b))

* Extend eslint config from @patternslib/dev. ([2cfeadc](https://github.com/Patternslib/patterns/commit/2cfeadc722b3609102b28fe03beb45a6ad55a06a))

* Extend jest config from @patternslib/dev. ([125a4f7](https://github.com/Patternslib/patterns/commit/125a4f757a0b98dd72ec7ccca4f707ccb6e45fa0))

* Extend Makefile from @patternslib/dev. ([923efe3](https://github.com/Patternslib/patterns/commit/923efe3b9d86a0c757e9757a43c4592a87072a58))

* Extend prettier config from @patternslib/dev. ([0bbbdca](https://github.com/Patternslib/patterns/commit/0bbbdca7b73a56907aeaa9dc062037fec740d924))

* Extend release-it config from @patternslib/dev. ([b692ce0](https://github.com/Patternslib/patterns/commit/b692ce03c195e9dbe6b83e87bf75488dd5856495))

* Extend webpack config from @patternslib/dev. ([208726f](https://github.com/Patternslib/patterns/commit/208726fb750cbd78ec6a599e261b849f94e592be))


### Maintenance


* Do not eslint the generated depends_parse file. ([dbfd33f](https://github.com/Patternslib/patterns/commit/dbfd33fefc6d0b9458d386fcd49de395c829bdd6))

* Move webpack.dist.js back to webpack.config.js. ([20f1d68](https://github.com/Patternslib/patterns/commit/20f1d684a0706730fef4b79ddcc9a629fd2e1911))

* Remove unused variables from Makefile. ([141ade4](https://github.com/Patternslib/patterns/commit/141ade433b3a961531917154abf7f1537c34e045))

## [9.0.0-alpha.0](https://github.com/Patternslib/patterns/compare/8.1.0...9.0.0-alpha.0) (2022-06-14)


### Features


* **Build:** Create Module Federation enabled bundles within Patternslib. ([ef28e21](https://github.com/Patternslib/patterns/commit/ef28e215fc3d6446ab8ca5d84ce29d363f4dbf48))

* **Build:** Externalize Patternslib core webpack config to allow customizing Patternslib bundles without affecting add-on packages which depend on webpack.config.js. ([3e9dd6c](https://github.com/Patternslib/patterns/commit/3e9dd6cae7eceaa0ea8727c2df811daa5945bdc7))


### Bug Fixes


* **Build:** Do not re-initialize already initialized bundles. ([8c0499f](https://github.com/Patternslib/patterns/commit/8c0499f340d78ac3e0d7d9c8b20657babefe66b1))


### Maintenance


* **Build:** Extend jest.config.js in a way that it is extendable by add-on packages. ([f16b3a5](https://github.com/Patternslib/patterns/commit/f16b3a5cf724c4eb4b54f8fa2811f559d5c1d70c))

* **Build:** Extend test setup code. ([00f1a34](https://github.com/Patternslib/patterns/commit/00f1a347e765266a67d4738160343548728c8a01))Add more setup code to mock Web API features for tests from other Patternslib add-on packages.

* **Build:** Remove dependency @babel/plugin-proposal-optional-chaining which is included in Babel since 7.8. ([cfd5cd4](https://github.com/Patternslib/patterns/commit/cfd5cd49b62bba0328a3c8cd87236174383c3d60))

* **Build:** Remove dependency regenerator-runtime except from test setup. The async/await runtime handling is already built-in in current Babel. ([f8a9889](https://github.com/Patternslib/patterns/commit/f8a988909bcd64b1e72996b9d931e03ae82cc446))

* **Build:** Remove unused @testing-library/jest-dom. ([6aeefc5](https://github.com/Patternslib/patterns/commit/6aeefc5bd2d322b9b49050db65ae4adb76d1cffd))

* **Build:** Remove unused inspectpack. ([a586a5d](https://github.com/Patternslib/patterns/commit/a586a5d72cb5a77a0d75cbb776c84911d1bd9641))

* **Build:** Upgrade dependencies. ([d0739d6](https://github.com/Patternslib/patterns/commit/d0739d600ee8784c3651fd55067d7475ac0b67ec))

* **docs:** Move upgrade 2 to 3 guide to history section. ([5449491](https://github.com/Patternslib/patterns/commit/5449491cbb851af9d1a2b3f5f017a6b599f8d9a7))

* **docs:** Remove outdated roadmap and version files. ([8f9e0cb](https://github.com/Patternslib/patterns/commit/8f9e0cb5a992303d961c4a9790a41ceb3e77547c))