# Changelog

See the [history](./docs/history/index.md) for older changelog entries.



## [8.1.0](https://github.com/Patternslib/patterns/compare/8.1.0-alpha.4...8.1.0) (2022-06-11)


### Maintenance


* **docs:** Add history section to docs and move old history from the changelog to this new section. ([7c0e2ff](https://github.com/Patternslib/patterns/commit/7c0e2ffbc2f4c0a1276913b65f0fb5b0ef1119ec))

## [8.1.0-alpha.4](https://github.com/Patternslib/patterns/compare/8.1.0-alpha.3...8.1.0-alpha.4) (2022-06-08)


### Features


* **pat push:** Desktop notifications: Ask for permission. ([ccbf731](https://github.com/Patternslib/patterns/commit/ccbf731c3ea19676bdf4f0b722692894c0f89d69))
Ask for permission to send desktop notifications after any click on the document.
This bypasses the browser restrictions on request for permission dialoges that are not shown if there hasn't been a user interaction.


### Maintenance


* **pat push:** Restructure code. ([2dbe44f](https://github.com/Patternslib/patterns/commit/2dbe44f8eeb2e32becf4efd5394bd3a4522dc442))
Restructure code and narrow down the error handling for fetching to only the fetch block.


## [8.1.0-alpha.3](https://github.com/Patternslib/patterns/compare/8.1.0-alpha.2...8.1.0-alpha.3) (2022-06-03)


### Maintenance


* **pat inject:** Add developer documentation with inital version method call flow diagram. ([de13186](https://github.com/Patternslib/patterns/commit/de1318621f82b1c9a2f8928127cb52860b8878cf))


* **pat switch:** When logging errors, add the failing element for better debugging. Also, do not log an error twice. ([83f3df3](https://github.com/Patternslib/patterns/commit/83f3df3eb1091a2e7077e3cc94dc6770a2fd9e91))


## [8.1.0-alpha.2](https://github.com/Patternslib/patterns/compare/8.1.0-alpha.1...8.1.0-alpha.2) (2022-06-02)


### Bug Fixes


* **pat close panel:** Do not break if no parent .has-close-panel element was found. ([894c05c](https://github.com/Patternslib/patterns/commit/894c05c9995a120cc53305d76d2ac1c69ac30b9e))


### Maintenance


* **Build:** Module Federation - Remove the underscore version fixture. ([87347b7](https://github.com/Patternslib/patterns/commit/87347b73cb3441ef5bd3a26b3156ae9957ba6710))
Remove the underscore version fixture in webpack.mf.js.
Since unterscore 1.13.4 this fixture isn't necessary anymore.

* **docs:** Document that you only have to iport module_federation if you are creating a host bundle. ([bccd803](https://github.com/Patternslib/patterns/commit/bccd80391f5c7695bcc439f3c95414d799c72334))


## [8.1.0-alpha.1](https://github.com/Patternslib/patterns/compare/8.1.0-alpha.0...8.1.0-alpha.1) (2022-05-31)


### Features


* **pat push:** If a notification url is given, open it when clicking on the desktop notification. ([c36e51f](https://github.com/Patternslib/patterns/commit/c36e51f3cc0989e2933d98e7586ba55c147f61cb))


### Maintenance


* **pat push:** Fetch desktop notification data only when desktop notifications are allowed. ([05d443b](https://github.com/Patternslib/patterns/commit/05d443b76b121a59a20266d4c51bf7a8f9ff346f))


* **push kit:** Remove unused desktop notification code. Use pat-push instead. ([c702833](https://github.com/Patternslib/patterns/commit/c702833c45eedfe774ff85886e5663a1c7c3f36e))


## [8.1.0-alpha.0](https://github.com/Patternslib/patterns/compare/8.0.3...8.1.0-alpha.0) (2022-05-30)


### Features


* **pat modal:** Allow to configure a injection source and target to support modals in modals. ([1d27c08](https://github.com/Patternslib/patterns/commit/1d27c08e4379503e052c834239b8b71d61c122c1))
Add configuration parameter for ``source`` and ``target``.
This allows to reuse an existing #pat-modal instance and to open modals in modals.


### Maintenance


* **Build:** Add prerelease-alpha and prerelease-beta as Makefile targets. ([10b9e24](https://github.com/Patternslib/patterns/commit/10b9e243997bc1efeb67422fd9b7158c88fee21c))


* Upgrade dependencies. ([71e31cf](https://github.com/Patternslib/patterns/commit/71e31cf3bbf44db42e82e458e2136f67f0d096bc))


* **pat modal:** Document panel-header-content. ([ac7000e](https://github.com/Patternslib/patterns/commit/ac7000e9d4f421ba73a5fe049e2f4e1fdda9369e))


## [8.0.3](https://github.com/Patternslib/patterns/compare/8.0.2...8.0.3) (2022-05-23)


### Bug Fixes


* **Build:** Don't use index.js entry which should be used for module federation and would break chunk loading if used in a non-mf environment. ([ad5381c](https://github.com/Patternslib/patterns/commit/ad5381ce21ab827db133fde3fb56d6497b442c23))


### Maintenance


* **Build:** Support 2FA when releasing. ([e8f02b4](https://github.com/Patternslib/patterns/commit/e8f02b4b6afc1a17afb30c24ba046fab6716e52b))
Remove non interactive ci-mode from Makefile to allow for OTP prompt and two-factor auth on npm.
Also remove dry-run as we now have to confirm each step anyways.

* **Build:** Upgrade dependencies. ([f2ac7ad](https://github.com/Patternslib/patterns/commit/f2ac7ad823bdcf675b83b1033e916e1bec584ccd))


* **Build:** Use Underscore version 1.13.3 for module federation config. ([403b9c8](https://github.com/Patternslib/patterns/commit/403b9c8615410b4d04f0805634d4420ffa7207bc))


* Be less verbose and use more debug log messages. ([b05c03f](https://github.com/Patternslib/patterns/commit/b05c03f2fb2fa29b8bf0a818b106dfb5624bc8e9))


* **pat modal:** Update demo, re-activate autoload modal. ([09d0e2b](https://github.com/Patternslib/patterns/commit/09d0e2b09f292d06d19af057710802b14bf05ab2))


## [8.0.2](https://github.com/Patternslib/patterns/compare/8.0.1...8.0.2) (2022-05-19)


### Bug Fixes


* **core base:** Don't initialize a already initialized pattern. ([d943de6](https://github.com/Patternslib/patterns/commit/d943de6fe5cf1d64d1f5042b6281347f71963f55))
Improve the previous check by setting the var earlier.

* **core registry:** Do not reinitialize and already initialized patterns registry. ([809c119](https://github.com/Patternslib/patterns/commit/809c1192b533f2160f98e16ef0b852267b0c5ea5))


## [8.0.1](https://github.com/Patternslib/patterns/compare/8.0.0...8.0.1) (2022-05-18)


### Maintenance


* **Bundle:** Add the keyword "patternslib" to the npm package registry. ([54fe5ba](https://github.com/Patternslib/patterns/commit/54fe5ba83b0e4ba2a958dac2f0740fb207499682))


* **Bundle:** Module Federation: Allow to pass the shared dependencies explicitly. When passed package.json dependencies are not automatically added. ([7eba043](https://github.com/Patternslib/patterns/commit/7eba043bf5f9d021c81d0ef65831226f16d025c5))


* **Bundle:** Upgrade dependencies. ([d0a546b](https://github.com/Patternslib/patterns/commit/d0a546b6e665d5c6acc90b890e4c57189ab1b217))

## [8.0.0](https://github.com/Patternslib/patterns/compare/7.12.0...8.0.0) (2022-05-17)


### Features


* **Build:** Dynamic Module Federation. Add config files and helpers. ([7e7a2af](https://github.com/Patternslib/patterns/commit/7e7a2afea57caa6d97dc045e77e001e64c676ab2))
With module federation you can share dependencies over multiple bundles without
loading them multiple times.

The dynamic part here allows the host to not know anything about it's remotes.
This concept can be used for add-ons to a base bundle.
Thanks @manfredsteyer for the help getting this to work!

Use the webpack/webpack.mf.js to extend your own webpack configuration with
dynamic module federation support.
In your main bundle (the "host") use webpack/dynamic_mf.js to configure the
entry point.

For more information see: docs/developer/module-federation.md.
For the general concept see: https://webpack.js.org/concepts/module-federation/

Co-authored-by: Johannes Raggam <thetetet@gmail.com>
Co-authored-by: Manfred Steyer <manfred.steyer@gmx.net>

* **Build:** Register jQuery globally without expose-loader. ([dca0842](https://github.com/Patternslib/patterns/commit/dca08426108a0180500210e9625c8abfc5294fd2))
Remove the dependency on expose-loader and register jQuery globally in the
globals.js module.

Import this module early to have jQuery registered for scripts which depend on
a global jQuery object.

This also fixes an additional request made by the expose-loader for
asynchronously loading jQuery.

* **core dom:** dom.template engine. ([61ca46f](https://github.com/Patternslib/patterns/commit/61ca46fac5b34a69814617dffe89665fd3506095))
Add a simple template engine in ``core.dom.template``
based on JavaScript template literals.


### Maintenance


* **Build:** Compatibility with Jest 28. ([1795087](https://github.com/Patternslib/patterns/commit/17950874de41ac053b26a5d629434e829a0d74e8))
Don't transform preact.

* **Build:** Compatibility with Jest 28. ([69b7934](https://github.com/Patternslib/patterns/commit/69b793416f99a7097c91f5f58aeba49495c3c1ea))
Remove jest-raw-loader dependency and add own loader based on https://github.com/keplersj/jest-raw-loader/pull/239/ for compatibility with Jest 28.

* **Build:** Compatibility with Jest 28. ([5679db0](https://github.com/Patternslib/patterns/commit/5679db0d84eda485737647cac480cc808badd194))
Add jest-environment-jsdom as of jest 28 that isn't shipped anymore by default.

* **Build:** Upgrade dependencies. ([3260038](https://github.com/Patternslib/patterns/commit/3260038cf2772de50065df20eceec7473625b050))


* **Build:** Upgrade fullcalender. ([0b08573](https://github.com/Patternslib/patterns/commit/0b08573b67e65bb6d300c2810d8abe8173954e73))


* **Build:** Upgrade luxon to version 2. ([5d12b9e](https://github.com/Patternslib/patterns/commit/5d12b9ec47344efc0dcc8e8126d1d4db3a6e3c6d))


* **Bundle:** Upgrade jest to version 28. ([4ac079f](https://github.com/Patternslib/patterns/commit/4ac079f184043225ff78aded9390ae9f995036d0))


### Breaking Changes


* **core registry:** Use a global pattern registry. ([737f3ed](https://github.com/Patternslib/patterns/commit/737f3ed0577550483fa552cf995e39076429bc3b))
Previously it was possible to use multiple pattern registries when multiple
instances of the registry were used, e.g. in different bundles.

With this change we do use only one pattern registry storage which is
shared across instances of ``core.registry`` in multiple bundles.

This is a transparent change - the Patternslib registry API has not
changed at all. Just keep using ``registry.scan``,
``registry.register``, etc.

But if necessary, there is a ``PATTERN_REGISTRY`` export in ``core.registry``
which points to ``window.__patternslib_registry``, a singleton in the global
namespace which is shared across instances of the registry.