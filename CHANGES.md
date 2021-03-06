### [4.5.4](https://github.com/Patternslib/patterns/compare/4.5.3...4.5.4) (2021-07-15)


### Bug Fixes

* **pat bumper:** Fix IntersectionObserver issue with Safari where rootMargin wasn't correctly recognized due to formatting issues. ([c0c3351](https://github.com/Patternslib/patterns/commit/c0c3351888d2ead17ac472565f78a5680d647690))
* **pat tabs:** Prevent infinite loop when only child element is .extra-tabs. ([812fb50](https://github.com/Patternslib/patterns/commit/812fb504263eaaf7b8241e11ce22a8c5d00cd68c))


### Maintenance

* **dependencies:** Patch level upgrades (eslint minor level) of development dependencies. ([6f6f613](https://github.com/Patternslib/patterns/commit/6f6f6130ecd0301c883962b8b9e503427fdf76d8))
* Fix the pre-commit command ([8401791](https://github.com/Patternslib/patterns/commit/8401791d088193ceb6cc7a6c9a3776b63964f527))

### [4.5.3](https://github.com/Patternslib/patterns/compare/4.5.2...4.5.3) (2021-06-30)


### Features

* **core utils:** Add animation_frame which returns a Promise to be resolved with the next animation frame. Can be used to await for the next repaint cycle in async functions. ([808439a](https://github.com/Patternslib/patterns/commit/808439af22941b92a61d41ee1dacd366622f9c8b))
* **core utils:** Add get_bounds function to return the client bounding rectangle with rounded integer values instead of double/float values. ([2be2abe](https://github.com/Patternslib/patterns/commit/2be2abebc8a3aa68bc776e41896a36766fbf8758))
* **core utils:** Make getCSSValue return pixels as integer by default. Introduce a as_float option, if float/double values are needed. ([e0c027d](https://github.com/Patternslib/patterns/commit/e0c027dd2ac990d812cf6e92ae1a14016a1fb7e1))


### Bug Fixes

* **pat tabs:** Improve algorithm to calculate available width to ensure better stability (not shrinking while moving tabs) and correctness (taking .extra-tabs and style updates while moving tabs into account). ([b812aba](https://github.com/Patternslib/patterns/commit/b812abae6367fc6c1915e60c3cf02792de1c0f09))
* **pat tabs:** Only run the ResizeObserver callback when width of parent container has changed. This avoids a infinite ResizeObserver callback loop when the height changes due to tab manipulation. Also apply a small threshold of 3 pixels for which the callback isn't run to avoid unnecessary runs. ([7a4432e](https://github.com/Patternslib/patterns/commit/7a4432e49745f028728afa9f588b8de95d655954))


### Maintenance

* **core utils getCSSValue:** Test for returning 0 if a numerical value (as_pixels, as_float) was requested which doesn't exist. ([51f5bcb](https://github.com/Patternslib/patterns/commit/51f5bcb375a726e1ff7bd0820f8abb79d122d318))
* **pat tabs:** More debug messages. ([83fcfc5](https://github.com/Patternslib/patterns/commit/83fcfc5114a06b363bbb000c40c2f4f1686edf2c))

### [4.5.2](https://github.com/Patternslib/patterns/compare/4.5.1...4.5.2) (2021-06-28)


### Bug Fixes

* **pat tabs:** Only calculate available space twice: Once initially and then after the extra-tabs span including extra classes have been added. This should stabilize tabs calculation in some cases. ([923614a](https://github.com/Patternslib/patterns/commit/923614ab304b617bba64d62ac7b77a3f4cde41af))


### Maintenance

* **pat tabs:** Test for debounce timeout. ([3c184aa](https://github.com/Patternslib/patterns/commit/3c184aa161cef82b75afb1d85a00f91a839b9bfc))

### [4.5.1](https://github.com/Patternslib/patterns/compare/4.5.0...4.5.1) (2021-06-25)


### Bug Fixes

* **pat tabs:** Improve calculation of available width by querying the new available width after each recurision where a tab has been moved into the extra-tabs span. The width might change due to an applied padding when the extra-tabs span is added. ([92c284a](https://github.com/Patternslib/patterns/commit/92c284af00eb1f2a75363734efb4811b705f02b9))

## [4.5.0](https://github.com/Patternslib/patterns/compare/4.4.4...4.5.0) (2021-06-25)


### Bug Fixes

* **pat bumper:** Do not the intersection observer callback break when no root is found. ([008b307](https://github.com/Patternslib/patterns/commit/008b3079f33800628b56c422c6bb6096dd294e62))
* **pat bumper:** Wait for next repaint cycle before searching for the scroll container. Fixes a corner case where no scroll container was found after injecting content and initializing this pattern in the same repaint cycle where no CSS was yet applied. ([4da6918](https://github.com/Patternslib/patterns/commit/4da69182d421027b9d429c6a2ac9d12be3221e10))


### Breaking Changes

* **pat bumper:** Rework pat-bumper to only set bumping classes. Needs CSS position:sticky. Does not set positions via JavaScript anymore. Ensure performant operation by using an IntersectionObserver. Note: You need to set your pat-bumper elements via CSS to position: sticky. Ref: [#846](https://github.com/Patternslib/patterns/issues/846) Fixes: [#846](https://github.com/Patternslib/patterns/issues/846). Fixes: [#870](https://github.com/Patternslib/patterns/issues/870). ([82d3112](https://github.com/Patternslib/patterns/commit/82d3112edce9afd265c0f9c9b97a6036059b8b16))
* **pat sticky:** Remove obsolete polyfill for position: sticky. ([bb2bc9a](https://github.com/Patternslib/patterns/commit/bb2bc9ab346c703719229b856ecb0948922cc38c))


### Maintenance

* **dependencies:** Minor version upgrade of dependencies. ([92ac3d0](https://github.com/Patternslib/patterns/commit/92ac3d029b434178ca64872480449bbb58a15f5e))
* **pat bumper:** Remove unused/unnecessary side and margin options. Side is dropped as we always set the classes according to the bumped position. Margin is retrieved from the CSS. Register observers for x+y scroll containers if they are different. ([12d56e9](https://github.com/Patternslib/patterns/commit/12d56e9fc222d4fa80bcc8587620454de3a839a0))
* **pat bumper:** Warn and exit if no position:sticky support is available. E.g. IE11. ([3fe42a9](https://github.com/Patternslib/patterns/commit/3fe42a9e84b1819e0ed869c6587eebd638cea1af))

### [4.4.4](https://github.com/Patternslib/patterns/compare/4.4.3...4.4.4) (2021-06-24)


### Bug Fixes

* **pat tabs:** Improve available width calculation by excluding invisible and absolute positioned elements, making it more robust for different scenarios. ([bb0dd19](https://github.com/Patternslib/patterns/commit/bb0dd19a509d9d588b988b78730322b8a8971a64))

### [4.4.3](https://github.com/Patternslib/patterns/compare/4.4.2...4.4.3) (2021-06-24)


### Bug Fixes

* **pat forward:** Allow to define the delay with units, e.g. 100ms. ([add916b](https://github.com/Patternslib/patterns/commit/add916b9fec6df7fe89ebb6282e669bb4c86c0df))
* **pat scroll:** Allow to define the delay with units, e.g. 100ms. Fixes: [#869](https://github.com/Patternslib/patterns/issues/869) ([5a7f783](https://github.com/Patternslib/patterns/commit/5a7f783c24955107fcf1ead318eb808217025af0))
* **pat scroll:** Reverse the semantics of the scroll offset. Offsets are substracted from the target position to stop BEFORE it. Fixes: [#867](https://github.com/Patternslib/patterns/issues/867) ([318fc99](https://github.com/Patternslib/patterns/commit/318fc9927e426318d83a7de794aa96d8b31768f1))
* **pat tabs:** Do not count extra-tabs element against available width as this one is absolutely positioned. Fixes: [#868](https://github.com/Patternslib/patterns/issues/868). ([bb2e48c](https://github.com/Patternslib/patterns/commit/bb2e48cd57b145df32992cac32498dad973d00c8))


### Maintenance

* **pat autofocus:** Use utils.debounce instead custom logic. ([3c9a51c](https://github.com/Patternslib/patterns/commit/3c9a51cf6ce423ffed76e8b9407f0a37b6967b56))
* **pat calendar:** Use utils.debounce instead custom logic. ([abc4c21](https://github.com/Patternslib/patterns/commit/abc4c2123886b9a510d602b6e042228a38fb5cc0))
* **pat collapsible:** scroll semantics have changed for pat-scroll. Adapt tests and add doku. ([99a2d38](https://github.com/Patternslib/patterns/commit/99a2d387c23d17772ed869d9e413552d82c8539c))
* **pat navigation tests:** Use utils.timeout instead nested setTimeout in tests. ([a477076](https://github.com/Patternslib/patterns/commit/a477076aefe6c27c32d32b6f3323b29be8c32958))
* **pat selectbox:** Use utils.timeout instead setTimeout. ([0eea9b2](https://github.com/Patternslib/patterns/commit/0eea9b2cd87246ffe19bbca2d06945ee7672b29c))
* **pat tabs:** Clarify tabs calculation logic in code. ([98866ed](https://github.com/Patternslib/patterns/commit/98866eddfa67869efeaa40d5f94e54116d94b566))

### [4.4.2](https://github.com/Patternslib/patterns/compare/4.4.1...4.4.2) (2021-06-17)


### Bug Fixes

* **pat tabs:** Improve calculation of available space. It does now 1) check for line breaks of tab elements and 2) check if new position exceeds initial width of .pat-tabs container. ([6d323ac](https://github.com/Patternslib/patterns/commit/6d323ac664979b17453d077ae92e1dfcafa35201))

### [4.4.1](https://github.com/Patternslib/patterns/compare/4.4.0...4.4.1) (2021-06-16)


### Features

* **styles:** Introduce a _fonts.scss to do font imports. Fixes a problem where Webpack could not resolve the font assets path correctly. ([1439e0e](https://github.com/Patternslib/patterns/commit/1439e0e1610770e5447eb68f1ca32db44dfb6d92))
* **webpack:** Allow passing a config object which overrides keys from a base config. ([f8973ae](https://github.com/Patternslib/patterns/commit/f8973aedb0fdadd669aea4b4ee6d5e7164dda32e))


### Maintenance

* **dependencies:** Minor version updates. ([ccb00a0](https://github.com/Patternslib/patterns/commit/ccb00a0d1b98fec024a0b54802aa6ac3958939f2))
* **dependencies:** Upgrade fullcalendar to 5.8.0. ([3c8dcab](https://github.com/Patternslib/patterns/commit/3c8dcab120ca09cd517a64a088f49f1c12e426bb))

## [4.4.0](https://github.com/Patternslib/patterns/compare/4.3.1...4.4.0) (2021-06-15)


### Features

* **core utils debounce:** Improve cancelation of previous runs. ([a845264](https://github.com/Patternslib/patterns/commit/a845264379826a790291bfa71a392caa8f4479f2))
* **pat bumper:** Extra classes depending on bumped side ([#847](https://github.com/Patternslib/patterns/issues/847)). ([5b1acac](https://github.com/Patternslib/patterns/commit/5b1acac3cf67c0aa84208f31562e47e2c3724716))
* **pat collapsible:** async support for transition function. ([8c35a1a](https://github.com/Patternslib/patterns/commit/8c35a1afa86170dc966b84b67958548adeace1bd))
* **pat collapsible:** Scroll offset support. ([48a2cdd](https://github.com/Patternslib/patterns/commit/48a2cdddee49c7934fa6d49242cb90f899a135b6)), closes [#840](https://github.com/Patternslib/patterns/issues/840)
* **pat collapsible:** Scrolling support. ([18901c8](https://github.com/Patternslib/patterns/commit/18901c8b8fd9fd68dbbe771b11a7cdae14d5064a)), closes [#840](https://github.com/Patternslib/patterns/issues/840)
* **pat scroll:** Add support for selector self. ([be4d322](https://github.com/Patternslib/patterns/commit/be4d322929d6b1683163fd88636527be1e3eaeaf)), closes [#840](https://github.com/Patternslib/patterns/issues/840)
* **pat scroll:** Add trigger value "manual". ([f3a04a6](https://github.com/Patternslib/patterns/commit/f3a04a6ec2273cdbb2527e990303a0e11e4ca699)), closes [#840](https://github.com/Patternslib/patterns/issues/840)
* **pat scroll:** Allow a delay before scrolling ([#842](https://github.com/Patternslib/patterns/issues/842)). ([cd146eb](https://github.com/Patternslib/patterns/commit/cd146ebed9ea0da0a35a244a36144979222199e6))
* **pat scroll:** Support await for smoothScroll. ([0a353b3](https://github.com/Patternslib/patterns/commit/0a353b33309e7f308b20b1a91f4b5ef9026e768b))
* **pat tabs:** Extra classes to indicate tabs state ([#841](https://github.com/Patternslib/patterns/issues/841)). ([aa0efbe](https://github.com/Patternslib/patterns/commit/aa0efbeaa2adee456a5c16757fd662a6839978b1))


### Bug Fixes

* **pat tabs:** Improve calculation of available space of pat-tabs. Ref: [#848](https://github.com/Patternslib/patterns/issues/848). ([77787af](https://github.com/Patternslib/patterns/commit/77787af9907c502bf83cb7989312f2e8915364c6))


### Breaking Changes

* **pat scroll:** Apply offset to scrolling position. ([6d54876](https://github.com/Patternslib/patterns/commit/6d548761c6d5eb4a7c29dee877293ff53cd64bde)), closes [#840](https://github.com/Patternslib/patterns/issues/840)


### Maintenance

* **dependencies:** Upgrade dependencies on major level. ([c190e52](https://github.com/Patternslib/patterns/commit/c190e52bcf5e5b7e6a8901a137ec4574cb7624c2))
* **dependencies:** Upgrade dependencies on minor+patch level. ([53d1434](https://github.com/Patternslib/patterns/commit/53d1434bc87cad2c71aacf1dbeeb4b853c1c5c9c))
* **pat bumper:** Anounce breaking change for pat-bumper. The JavaScript based positioning will be dropped and needs to be done via CSS position:sticky only. This pattern will only set classes to indicate a bumped element. ([206b02f](https://github.com/Patternslib/patterns/commit/206b02f8bf7ac659d7a48ac6c9c8e3aafba7f0c6))
* **pat scroll:** Add debug message when scrolling. ([eeaf054](https://github.com/Patternslib/patterns/commit/eeaf05413fe5e0c7935eb5a64749def33b999d08))
* **pat scroll:** Un-skip selector:bottom test - it passes now. ([769e578](https://github.com/Patternslib/patterns/commit/769e5783403ca38bd1f6c8c76eb69f412bbf7357))
* **pat scroll:** Updated demo to properly show the use of `delay` ([#842](https://github.com/Patternslib/patterns/issues/842)). ([8984519](https://github.com/Patternslib/patterns/commit/8984519fab2dfe7f6377279f1f42e41963bf028c))
* **webpack:** Add config entry to minify all available bundles and chunks. No need to configure bundle minification in depending packages. ([b7b1587](https://github.com/Patternslib/patterns/commit/b7b1587e2206ea191e4795c4c03dc0b1d7759e13))
* **webpack:** Remove unnecessary moment resolve-alias. No need to overload in sub packages for that anymore. ([1127367](https://github.com/Patternslib/patterns/commit/112736716cda3e7872760e72ca9311a8d081db37))
* Minor code modernizations and cleanup. ([81fa5dc](https://github.com/Patternslib/patterns/commit/81fa5dca6a2bba9434977e17ea0ad7def4acced5))
* Replace last occurrences of underscore debounce with utils debounce. ([2ef57bf](https://github.com/Patternslib/patterns/commit/2ef57bfc13c97f4cb09542cf2f63d8d88c44ea4b))
* **webpack:** Update build system with necessary changed from recent version updates. We're still on Webpack 4. ([fbff9f9](https://github.com/Patternslib/patterns/commit/fbff9f9700a55ef33691afaac2375b83e115acd6))

### [4.3.1](https://github.com/Patternslib/patterns/compare/4.3.0...4.3.1) (2021-06-08)


### Bug Fixes

* **pat calendar:** Fix .cal-title only searched within calendar controls since 4.2.4. Fixes current date not being updated when browsing the calendar. ([7362b33](https://github.com/Patternslib/patterns/commit/7362b337b8a68ebd2d41bb1bb26bb4f3dd27130c))


### Maintenance

* **pat sticky:** Deprecate pat sticky. Use CSS position:sticky instead. ([8ac4603](https://github.com/Patternslib/patterns/commit/8ac4603c772a1fe3a3e2e1b38d1e0117124e2c7d))

## [4.3.0](https://github.com/Patternslib/patterns/compare/4.2.4...4.3.0) (2021-06-01)


### Features

* **core push kit:** Set connection parameters. ([427d0f1](https://github.com/Patternslib/patterns/commit/427d0f1e60653c95eef073f2a5279032702141e6))
* **core push kit:** Support for desktop notifications via patterns-notification-exchange and patterns-notification-filter meta tags. ([4c3a615](https://github.com/Patternslib/patterns/commit/4c3a6152ab1bf27dd19d350c11f9b742d961d113))
* **core push kit:** Use logging framework. ([515acc9](https://github.com/Patternslib/patterns/commit/515acc9d33265668f5162e0a8e94d4394259056b))
* **core push kit:** Use more generic patterns-push-filter instead patterns-push-user-id to show filtering is available for any topics. ([2aa51b7](https://github.com/Patternslib/patterns/commit/2aa51b78d44f5c459f9b99920962ea05014529db))


### Bug Fixes

* **pat push:** Fix push kit and push pattern for basic operation. ([34ecbf8](https://github.com/Patternslib/patterns/commit/34ecbf802b37e40855425e34453e2fac0b1857e7))


### Maintenance

* **core push kit:** Modernize code. ([8987d82](https://github.com/Patternslib/patterns/commit/8987d8201b984b0eed2ed89d014157ed79479c05))
* **core push kit:** Simplify push kit config, use url instead of server-url. ([6bed6be](https://github.com/Patternslib/patterns/commit/6bed6be0189d1f1dc86a9237f0518aaa03b7cb4d))
* **core push kit:** Upgrade stompjs ([4ad7532](https://github.com/Patternslib/patterns/commit/4ad7532d0b621a4c6192be05fe1db4f47b2ba076))
* **docs:** Add note about changing the loglevel through query parameters from https://github.com/Patternslib/logging#configuring-through-url ([695c56b](https://github.com/Patternslib/patterns/commit/695c56b474e81b43efb4bf4c3d23843ad1b1a03e))
* **pat push:** Modernize code. ([e3da26f](https://github.com/Patternslib/patterns/commit/e3da26f41554f944e4ea1924db3a0576aabcac57))
* **pat push demo:** Allow to pass the exchange name to the push send script. ([86435f0](https://github.com/Patternslib/patterns/commit/86435f00af14a95349b2773f0872f47566dd1aa6))
* **pat push demo:** Provide Makefile to manage rabbitmq and producer. ([743e210](https://github.com/Patternslib/patterns/commit/743e2109d5d20a53d8c0089ac093e5b51ab26488))
* **pat push demo:** Update documentation and examples. ([bdaaf84](https://github.com/Patternslib/patterns/commit/bdaaf84052007f13c6dfdd442c47a699b86f3fa4))

### [4.2.4](https://github.com/Patternslib/patterns/compare/4.2.3...4.2.4) (2021-04-28)


### Bug Fixes

* **core parser:** Allow line breaks and spaces before and after pattern arguments. ([ff9c248](https://github.com/Patternslib/patterns/commit/ff9c24865d37e8b0dfdebfe8c8e44963b5e3e2ef))
* **pat calendar:** Implement calendar-controls. ([bbbed29](https://github.com/Patternslib/patterns/commit/bbbed299404f08749eb6e8f65e62a6e88f8c7fc5))


### Maintenance

* **Tests:** Remove left-over log messages. ([058ba74](https://github.com/Patternslib/patterns/commit/058ba743cc454a8c1cd9be0260b26d8be47b5c28))

### [4.2.3](https://github.com/Patternslib/patterns/compare/4.2.2...4.2.3) (2021-04-26)


### Bug Fixes

* **pat scroll:** Fix scrolling on body as scroll container. ([a099517](https://github.com/Patternslib/patterns/commit/a099517f02bcd7a03e9cc6138ee9f18a79dcd1f0))

### [4.2.2](https://github.com/Patternslib/patterns/compare/4.2.1...4.2.2) (2021-04-23)


### Bug Fixes

* **pat date picker:** Add test to check for working clear button in styled behavior with formatted dates. Needs previous commit to work. ([cdb7ba4](https://github.com/Patternslib/patterns/commit/cdb7ba408b277663712da1cf8354119fee1c6dc4))
* **pat display time:** Restore old behavior and clear the pat-display-time contents on empty datetime attributes. ([58f992c](https://github.com/Patternslib/patterns/commit/58f992c25b0926c590fde30ce2ef2f7843822181))


### Maintenance

* Upgrade all version within the specified range. ([b0924a7](https://github.com/Patternslib/patterns/commit/b0924a7ccf8c5906f527ccb92296ffa0e534099b))

### [4.2.1](https://github.com/Patternslib/patterns/compare/4.2.0...4.2.1) (2021-04-22)


### Bug Fixes

* **pat date picker:** styled behavior: do not format the date when no output-format is given. Also, only import display-date when it's actually used. ([ca8ddae](https://github.com/Patternslib/patterns/commit/ca8ddaedfadb6b309154d195c0323f20df03c607))
* **pat display time:** Fix relative date / from-now option to work again. ([95e5dea](https://github.com/Patternslib/patterns/commit/95e5dea3f147b5bd5110f087049bbf36dbe3624a))


### Maintenance

* **pat display time:** Add tests with a fixed timezone. ([40bea37](https://github.com/Patternslib/patterns/commit/40bea37cdd27f3aec2d72a2fd5828ebe38bca6a4))
* **Release process:** Fix make release-patch target to really release a patch level version. release-it does default to minor level. ([35461c4](https://github.com/Patternslib/patterns/commit/35461c4186f316994f68d7fe40b464e55d51d9a8))

## [4.2.0](https://github.com/Patternslib/patterns/compare/4.1.0...4.2.0) (2021-04-21)


### Features

* **core utils:** Add localized_isodate utility method to return in ISO 8602 date. This is to work around timezone shifting issues with the UTC based toISOString method. ([2b395b7](https://github.com/Patternslib/patterns/commit/2b395b7017f73b63dc41c2886bb25654627315d0))


### Bug Fixes

* **pat date picker tests:** Fix failing test when running around midnight due to timezone shifting issues. ([3dd8527](https://github.com/Patternslib/patterns/commit/3dd852785f09f191498781afaba60e87ac18256a))


### Maintenance

* **Build:** Also babel-load mockup from node_modules. This simple addition makes unnecessarily complex overload code in mockup obsolete. ([76337b9](https://github.com/Patternslib/patterns/commit/76337b931d1f6cff5c3b177e2cc5773a1dfc6465))
* **Release workflow:** Do not include the release commit message in the changelog and bypass the commitlint pre-commit hook. ([3ef05dc](https://github.com/Patternslib/patterns/commit/3ef05dc5de83c0c0bee8fc75c0d6c1165245fb83))

## [4.1.0](https://github.com/Patternslib/patterns/compare/4.0.0...4.1.0) (2021-04-21)


### Features

* **core registry:** Do not scan patterns wrapped within ``<template>`` tags. ([d9889e3](https://github.com/Patternslib/patterns/commit/d9889e31d40216f59981b1d5a9297512dc2096d0))
* **core utils:** Add "ensureArray" which always returns an array. ([0981cb4](https://github.com/Patternslib/patterns/commit/0981cb45c2af4d93fdd58b81b834a0b4adfa6a04))
* **pat clone:** Allow ``<template>`` tags for clone templates. ([585d8ee](https://github.com/Patternslib/patterns/commit/585d8ee681a13837537d75f4d5c4545483e6923a))
* **pat date picker:** Add clear button for styled behavior. ([147df92](https://github.com/Patternslib/patterns/commit/147df9266c2ec97fe4397a38b0582ee4df37d709))
* **pat date picker:** Support disabled state and do not initialize the date picker. ([cbca469](https://github.com/Patternslib/patterns/commit/cbca4694be489a5d41233eeaa1fa1199f29a881f))
* **polyfill:** Add Node.remove polyfill. ([e6853be](https://github.com/Patternslib/patterns/commit/e6853bed5bfd6e584d2736cbd013f64bca075166))


### Bug Fixes

* **pat date picker:** Fix pat-validation compatiblity. ([61e7231](https://github.com/Patternslib/patterns/commit/61e7231799d53151ef7956b2a2210e5c87213b69))
* **pat date picker:** Improve pat-autosubmit compatibility. ([a8dc1c8](https://github.com/Patternslib/patterns/commit/a8dc1c80e76d30e691ea2248becf87ac9a9fd71a))


### Breaking Changes

* **pat date picker:** Allow for formatted dates in "styled" behavior. ([81fea60](https://github.com/Patternslib/patterns/commit/81fea60e161a6796c19ed5aa365f550db3268b67))
* **pat datetime picker:** Only support "native" behavior. ([b14503d](https://github.com/Patternslib/patterns/commit/b14503db9f1f25c2318c5fc1a9cff2c637bd9b92))


### Maintenance

* **Build:** Don't re-add the husky commitlint check, we have it already in the repository. ([9e3e899](https://github.com/Patternslib/patterns/commit/9e3e8994d75155f2e55a933a6e4e4182c86541a5))
* **Build:** Fix typo Maintainance->Maintenance. ([03ab244](https://github.com/Patternslib/patterns/commit/03ab244dad4b2029ef1a305f55c698b760bcc945))
* **Build:** Run yarn upgrade to get latest versions of dependencies within the specified range. ([1824a80](https://github.com/Patternslib/patterns/commit/1824a80010b15c9b3d8349cf3ec25115880cf160))
* **Cleanup:** cosmetics ([ad78c14](https://github.com/Patternslib/patterns/commit/ad78c142c28d7dbf14c49e8e91b6d8a4e68daf11))
* **Cleanup:** Increase JavaScript line length to 89 characters to make most ``// prettier-ignore`` statements obsolete. ([2e7e50f](https://github.com/Patternslib/patterns/commit/2e7e50f6747bfe1b3be928599232088758060682))
* **docs:** Update README and RELEASE for latest changes. ([385f02e](https://github.com/Patternslib/patterns/commit/385f02efbc2f4915c86e69dd3be1564634b44d3c))
* **Docs:** Note about use of the legend pattern. ([dd10577](https://github.com/Patternslib/patterns/commit/dd10577997c9141ce8da200ed0e570d237f57313))
* **pat date picker:** Add demo example including pat-clone. ([73f7c34](https://github.com/Patternslib/patterns/commit/73f7c344b9bbff6272b825dd54bf09ba1a7d5558))
* **pat date picker:** Document after/offset-days feature. ([8a209d2](https://github.com/Patternslib/patterns/commit/8a209d20f183593d130055b858539bfd2fb8ee56))
* **pat date picker:** Use async/await fetch for i18n and cleanup code. ([1546966](https://github.com/Patternslib/patterns/commit/1546966bf55ff16f4c9a10e849a5e2eb63bff4c7))
* **release:** call make step in release step ([223ba66](https://github.com/Patternslib/patterns/commit/223ba6629e1e66ad7e892aae3a71aa2e3c5e6507))
* **Release workflow:** Fixes to the release workflow. ([8f8314b](https://github.com/Patternslib/patterns/commit/8f8314baedb5711f2db804b1d8ea95990196e5d9))
* Install pre-commit hook for commit messge format. ([77d0a39](https://github.com/Patternslib/patterns/commit/77d0a39ddc5113b9103987521c1b2be3ed01ea52))
* **release:** Fix the release-web step ([f936f4d](https://github.com/Patternslib/patterns/commit/f936f4db7604c86a01c91abdfe0caba0c6bf7096))

## [4.0.0](https://github.com/Patternslib/patterns/compare/4.0.0-dev.0...4.0.0) (2021-04-15)


### Bug Fixes

* **core registry:** Re-add scanning of hidden patterns ([3cefe1b](https://github.com/Patternslib/patterns/commit/3cefe1b19570ff937c68bbf570c5a5e195832c67))
* **Webpack:** Need to set publicPath for dev server. ([bc4506a](https://github.com/Patternslib/patterns/commit/bc4506a613edf98dfea57f1cf2a439905659eb0b))


### Maintenance

* **Cleanup:** Configure editorconfig to use 4 spaces for .json files. ([7a54d4c](https://github.com/Patternslib/patterns/commit/7a54d4c81acb0b10a80a3f67bcae8aaab92ac4e5))
* **Cleanup:** Reformat package.json using 4 spaces instead of 2. ([c445219](https://github.com/Patternslib/patterns/commit/c445219b452f783c939e275b2867fd0a9b173225))
* **Docs:** Remove section about customizing ``__webpack_public_path__`` - this is now set automatically. ([4c7cedc](https://github.com/Patternslib/patterns/commit/4c7cedc847878dd4048b7b6472a1c711de73dd0e))
* **Docs:** Update developer documentation. ([ebb06d3](https://github.com/Patternslib/patterns/commit/ebb06d39b0bd84b247993c58e02c3a0736f5b065))
* **Docs:** Update release process documentation. ([c66a8b1](https://github.com/Patternslib/patterns/commit/c66a8b1c9ae9de8b17a018090bf3bc795a6c6f84))
* **pat clone:** Test for not initializing patterns wrapped within .cant-touch-this classes. ([698044f](https://github.com/Patternslib/patterns/commit/698044f07acffe0e37cc0c4d29060133f9d6cda2))
* **Release:** Add make targets for releasing Patternslib. ([7853726](https://github.com/Patternslib/patterns/commit/78537261471fcd7ceae4de6b06ac42a7f51e2ec4))
* **Release:** Do not auto-create github releases ([bebd0ce](https://github.com/Patternslib/patterns/commit/bebd0cedebfa2989204d5fc902b84b408c9b3d5f))
* **Release:** git tag is done by release-it, no need to do it manually ([d1a1a92](https://github.com/Patternslib/patterns/commit/d1a1a925fab78e7ce7b66cf89f88518c89f7eca6))
* **Release:** Load the version just changed by the release-it script anew and add major/minor/patch targets ([fbfbe64](https://github.com/Patternslib/patterns/commit/fbfbe64e81df9a0af3b1058721e512611fbe3345))
* **Release:** Tag the release in Github ([54952e8](https://github.com/Patternslib/patterns/commit/54952e8ecee05bab100aa94733595777cbdd1b83))
* **Release workflow:** Add 'release-web' target to Makefile for creating a bundle tarball to download. ([2d7bc5e](https://github.com/Patternslib/patterns/commit/2d7bc5e82c20e748ff65a3950ac7e02264fe01db))
* **Release workflow:** Add commitlint for consistent commits allowing for automatic changelog generation. ([6a14bb6](https://github.com/Patternslib/patterns/commit/6a14bb6d894e18e46da9c173eb492d0437448e1e))
* **Release workflow:** Configure release-it with changelog generation using conventional changelog. ([be3b1aa](https://github.com/Patternslib/patterns/commit/be3b1aa30517738c6c722e351c4baebc70f2cf5d))
* **Release workflow:** Install husky for commitlint pre-commit hook. ([ce41cbe](https://github.com/Patternslib/patterns/commit/ce41cbef2aea2d2c4d9c96e36d67bd799ffcdc44))
* **Webpack:** Add Modernizr to default bundle. ([23a691c](https://github.com/Patternslib/patterns/commit/23a691c08a5ce808751a7a13238bd11e8c71cd6d))
* **Webpack:** Change package scope to @patternslib/patternslib for the version 4 main release. ([991246d](https://github.com/Patternslib/patterns/commit/991246d31bb14000ad28518fc342187ad87732ed))
* yarn install. ([ac6d163](https://github.com/Patternslib/patterns/commit/ac6d163136f84579c6d43cbcbcb66c8f0f3c1cbb))
* **Webpack:** Do not hardcode-set the ``__webpack_public_path__`` in development mode. It's automatically set since recently. ([87c7878](https://github.com/Patternslib/patterns/commit/87c78781ac7b56be13b30f15e350774de870431e))
* **Webpack:** Move production and development configurations into main config. ([d94655f](https://github.com/Patternslib/patterns/commit/d94655fdae91538f08ce0916860f39aebd4391ee))
* **Webpack:** Remove the optimization.minimize config option and let it be set by dev/prod modes. ([3812d19](https://github.com/Patternslib/patterns/commit/3812d194e033c80405998ea586aa05a8c1c2ab78))
* **Webpack:** Use argv.mode insted of env.NODE_ENV following recommendations. ([632c294](https://github.com/Patternslib/patterns/commit/632c29490906d5563738260d63a9d9574df01d96))

# Changelog

## 4.0.0-dev - unreleased

### Breaking

-   Upgrade to ES6 style imports and remove RequireJS.
-   Removed unused or obsolete patterns:
    -   pat-carousel-legacy - use pat-carousel instead.
    -   pat-checked-flag - use pat-checklist instead.
    -   pat-chosen - use pat-autosuggest instead.
    -   pat-edit-tinymce
    -   pat-placeholder - placeholder fully supported since IE10.
    -   pat-slideshow-builder
    -   simplePlaceholder from jquery-ext.
-   IE11 is not supported by default anymore.
    There is a `polyfills` bundle, which adds IE11 support for the time being.
    The `polyfills` bundle can be injected on demand with the `polyfills-loader` script.
-   pat tooltip: Remove undocumented "souce: content-html" parameter.
-   pat tooltip: Remove undocumented "souce: auto" parameter. This parameter should not be used as it is not explicit enough and would lead to unintuitive behavior.
-   pat tooltip: Change show/hide classes to ``tooltip-active-click`` resp. ``tooltip-active-hover`` and ``tooltip-inactive``.
    Fixes: https://github.com/quaive/ploneintranet/issues/3723
-   Remove outdated pre IE9 browser compatibility polyfill `core/compat`.
-   Remove unused `lib/htmlparser`.
-   Remove obsolete library `prefixfree`.
-   pat date picker: Remove ``format`` argument and just use the ISO 8601 standard "YYYY-MM-DD", like the specification of date inputs defines it.
    Format would have submitted a formatted value where the ISO standard is expected.
    This also allows for removing the dependency of ``pat-date-picker`` on MomentJS.
-   pat datetime picker:
        - Change CSS selectors for better namespacing and remove implicit dependency on glyphicons.
        - Remove dependency on MomentJS.
        - After updating the original input, let the ``change`` event bubble up.
        - Support ``native`` behavior.


### Features

-   pat gallery: Import styles for photoswipe.
-   pat carousel: Import styles for slick carousel.
-   pat auto suggest: Import styles for select2.
-   pat-tooltip: Import styles for tippy.
-   pat-modal: Import styles.
-   pat datetime picker: Import styles.
-   pat date picker: Import styles for pikaday.
-   Styles: Import styles by setting ``__patternslib_import_styles``
    Allow importing styles from external libraries in Patternslib JavaScript via the global variable ``window.__patternslib_import_styles`` set to ``true``.
    This allows loading these styles automatically via Webpack.
    Disable setting style import per default.
-   pat carousel: Use ``imagesloaded`` instead of timeout to wait for images to have been loaded.
-   core registry: Do not scan patterns within trees with attribute ``hidden`` or class ``cant-touch-this``.
-   Implenent lazy loading for external libraries via dynamic imports. Leads to significantly reduced bundle sizes.
-   Upgrade pat-calendar to use latest fullcalendar version (5.3.0).
-   pat calendar: Add fullcalendar list views.
-   pat calendar: Store the current date and view in query parameters.
-   pat calendar: Fetch events from the backend.
-   pat calendar: Allow filtering/hiding events based in comparing the checkbox id with the classes of the displayed events.
-   pat calendar: Support `pat-inject` on events with a URL via `pat-inject-source` and `pat-inject-target` configuration options.
-   pat calendar: Support `pat-switch` for rendered events via some configuration options.
-   pat calendar: Support `pat-tooltip` on events with a URL via `pat-tooltip-source` set to `ajax`.
-   pat calendar: Support `pat-modal` on events with a URL via `pat-modal-class` set to some CSS class names.
-   pat calendar: Store view, date and active categories per URL, allowing to individually customize the calendar per page.
-   pat calendar: Support `url` in the event JSON model additionally to `@id`.
    The unique identifier is often not semantically correct for a URL to the item, especially when we want to call a specific view.
-   pat tooltip: Use tippy v6 based implementation.
-   pat tooltip: Introduce new option ``arrowPadding`` to define the padding of the box arrow from the corners of the tooltip.
-   pat tooltip: set content when mounting to avoid positioning problems.
-   Allow overriding the public path from outside via the definition of a ``window.__patternslib_public_path__`` global variable.
-   Introduce new ``core/dom`` module for DOM manipulation and traversing.
    ``core/dom`` includes methods which help transition from jQuery to the JavaScript DOM API.
-   core dom: Add ``get_parents`` to return all parent elements from a given DOM node.
-   core dom: Add ``toNodeArray`` to return an array of DOM nodes if a NodeList, single DOM node or a jQuery object was passed.
-   core dom: Add ``querySelectorAllAndMe`` to do a querySelectorAll including the starter element.
-   core dom: Add ``wrap`` wrap an element with a wrapper element.
-   core dom: Add ``hide`` and ``show`` for DOM elements which retain the original display value.
-   core dom: Add ``find_parents`` to find all parents of an element matching a CSS selector.
-   core dom: Add ``find_scoped`` to search for elements matching the given selector within the current scope of the given element
-   core dom: Add ``is_visible`` to check if an element is visible or not.
-   core dom: Add ``create_from_string`` to create a DOM Element from a string.
    unless an ``id`` selector is given - in that case the search is done globally.
-   pat date picker: Support updating a date if it is before another dependent date.
-   pat tabs: Refactor based on ``ResizeObserver`` and fix problems calculating the with with transitions.
-   pat tabs: When clicking on the ``extra-tabs`` element, toggle between ``open`` and ``closed`` classes to allow opening/closing an extra-tabs menu via CSS.
-   pat autofocus: Do not autofocus in iframes. Fixes: #761.
-   pat inject: Allow configurable error pages by defining the error page URLs via meta tags with the name ``pat-inject-status-``.
    Can be disabled by adding ``pat-inject-errorhandler.off`` to the URL's query string.
-   core utils: Add ``jqToNode`` to return a DOM node if a jQuery node was passed.
-   pat inject: Rebase URLs in pattern configuration attributes. This avoids URLs in pattern configuration to point to unreachable paths in the context where the result is injected into.
-   pat forward: Add `delay` option for delaying the click action forwarding for a given number of milliseconds.
-   pat forward: Add `self` as possible value for the `selector` option to trigger the event on itself.
-   pat-scroll: Implement `selector:bottom` attribute value to scroll to the bottom of the scroll container.
-   pat-scroll: Do handle click events also when trigger is set to `auto`.


### Technical

-   Infrastructure: Upgrade jQuery to 3.6.0.
-   Webpack: Backport changes from Mockup - add loaders for images, svg, sass and xml.
-   Webpack: Automatically detect the chunk path or "__webpack_public_path__" while still allowing for overriding via "__patternslib_public_path__".
-   Export all parsers in all patterns to be able to modify default values or add aliases.
-   core polyfills: Add polyfill for Node.closest method.
-   Core Base: ``await`` for initalization in the base class constructor, so that the ``init`` event is really thrown after initialization is done.
-   pat calendar: Explicitly import JavaScript language files to avoid missing Webpack TypeScript loader errors.
-   Use Babel for all files, allowing latest JavaScript features everywhere.
-   Add example `minimalpattern`.
-   Replace `slave` terminology with `dependent`.
-   Update build infrastructure and packages.
-   Use yarn instead of npm.
-   Use node-sass instead of Ruby sass.
-   Use eslint instead jshint.
-   Use Jest with jsdom as testing framework instead of Karma/Jasmine.
-   Do not automatically start a browser when starting the development server.
-   Allow for the JavaScript feature "optional chaining" via Babel.
-   Do not depend on `modernizr`.
-   Core store: Ignore invalid JSON values.
-   Core utils: Add method to check input type support.
-   Core utils: Add new async timeout function. Used for waiting in tests.
-   Core utils: Add `checkCSSFeature` method to be used instead of `modernizr` feature detection.
-   Core: Allow plain DOM nodes for initalization in base and parser.
-   Build infrastructure: Build into /dist and cleanup before building.
-   utils: Add `isIE` method to detect Internet Explorer browsers.
-   Build infrastructure: Configure babel for less transformations when in ``development`` environment for better code readability.
-   Core Base: Register a plain DOM nodes as ``this.el`` alongside the jQuery node.
-   Webpack: Add CSS from JS at first in HEAD.
    Configure ``style_loader`` to insert CSS at the TOP of the html ``<head>``
    Provide a webpack-helpers module with a ``top_head_insert`` function which can be reused in depending projects.
-   Build infra: Switch the CI system to GitHub Actions and drop Travis CI.
-   core base: Add the parser instance to pattern attributes if available.
    We can then reuse the parser from registered patterns. This is used in the ``_rebaseHTML`` method of pat-inject to URL-rebase the pattern configuration.


### Fixes

-   core dom is_visible: Mock in tests to check only for hidden to avoid unavailable offsetWidth/offsetHeight in Jest.
-   pat calendar, pat checklist, pat datetime-picker: Dispatch DOM events with bubbling and canceling features enabled, as real DOM events do.
    Fixes a problem where calendar categories did not show their initial state correctly.
-   pat inject: Make sure that nested pat-inject element have the correct context for target ``self``. Fixes: https://github.com/quaive/ploneintranet.prototype/issues/1164
-   pat calendar: Fix language loading error "Error: Cannot find module './en.js'"
-   pat depends, pat auto suggest: Fix a problem with initialization of ``pat-auto-suggest`` which occurred after the lazy loading changes.
-   pat checklist: Also dispatch standard ``change`` event when de/selecting all items.
-   pat select: Add missing ``<span>`` element around the select element itself. Fixes: https://github.com/quaive/ploneintranet.prototype/issues/1087
-   pat depends/core utils: Do not set inline styles when showing elements in transition mode ``none``. Fixes #719.
-   pat scroll: Fix scrolling offset incorrectly applied. Fixes: #763.
-   Core registry: Fix ``transformPattern`` to also work with patterns which extend from Base.
    Fixes a problem with pat-auto-suggest not auto submitting.
-   pat autofocus: Implement documented behavior to not focus on prefilled element, if there is another autofocus element which is empty.
-   pat autofocus: Instead of calling autofocus for each element call it only once.
-   pat autofocus: Register event handler only once.
-   pat-checklist: For global de/select buttons, do not change any other checkboxes than the ones the de/select button belongs to.
-   Documentation fixes:
    -   pat-inject: Fix documentation about special target ``self`` and demo that behavior.
    -   pat-autosubmit: Fix demo to show configuration on individual inputs.
    -   pat-clone demo: Remove unstyled tooltip/clone demo
    -   pat date picker demo: Use current date for min/max example.
    -   pat depends demo: Remove unused sections.
    -   pat expandable tree demo: Extend the demo with more levels and folders.
    -   pat scroll demo: Remove debug page.


## 3.0.0-dev - unreleased

### Features

-   pat-inject:  Don't rebase for some additional known prefixes to avoid that the links break when contained in an injected page snippet.
-   pat-gallery: Allow adding images directly to the gallery.
-   pat-validation: Allow for HTML5 style `required` attributes without a value.
-   pat-validation: Added the possibility to check for fields equality
-   pat-validation: Dont use :input jquery extension for better performance
-   pat-validation: Update validate.js to 0.13.1
-   Prevent "Modernizr.inputtypes is undefined" error
-   pat-validation: Do not trigger on empty dates. Fixes: #711
-   Remove PhantomJS - we're using ChromeHeadless already.
-   Simplify package.json and remove unused.
-   Upgrade moment and moment-timezone.
-   core/utils rebaseURL: Change a relative base url to an absolute URL using window.location.
-   pat-push: New pattern for replacing html content on push events.
-   pat-scroll-box: New pattern for scrolling detection. Replaces the previous "scroll detection" module.
-   pat-inject: Rename undocumented `selector` property to `defaultSelector`.
-   pat-inject: Fix typo in docs for the `source` property.
-   pat-scroll: Implement new special `selector:top` attribute value to scroll the scroll container just to the top of the page. Ref: #721.
-   scroll detection: Rework and optimize, set scroll classes on any scrolling event, fix problem with IE and set initial state. Fixes #701
-   pat-scroll: Implement new special `selector:top` attribute value to scroll the scroll container just to the top of the page. Ref: #721.
-   pat-scroll: To define the scrollable target search also for `overflow-x` and `overflow-y` declarations.
-   Rework push message support for the STOMP message protocoll instead of backends instead of WAMP.
    We are using the RabbitMQ message broker for push support instead of crossbar.io.
-   Navigation:
    -   Do not set the `.navigation-in-path` class for elenents already marked with `.current`.
    -   Allow configuration of "in path" and "current" classes via `in-path-class` and `current-class` configuration options.
    -   Allow empty `in-path-class` which then does not set the in-path class.
    -   Allow configuration of `item-wrapper` element on which `in-path-class` or `current-class` are set. Defaults to `li`.
    -   Set current class also on parent item-wrapper if not set.
    -   Fix case where current class was not set when not present on load.
    -   Set current class also when DOM elements are inserted or removed.
-   Add `utils.getCSSValue` for retrieving CSS property values for DOM nodes.
-   Add configurable scrolling behavior to pat-inject.
-   Add `webpack-visualizer-plugin` for analyzation of generated bundles.
-   Fix `pat-auto-scale` not correctly rescaling after fullscreen changes. Fixes #673
-   Use node-sass as suggested by https://sass-lang.com/install - the ruby version is deprecated.
-   Use `yarn` instead of `npm`.
-   Use babel for all files, allowing latest JavaScript features everywhere.
-   Add `pat-fullscreen` pattern to allow any element to be displayed in fullscreen-mode.
    A second pattern `pat-fullscreen-close` which is triggered on `close-fullscreen` CSS class allows for closing the fullscreen with custom buttons.
-   Runs now on jQuery 3.
-   Integrated pat-display-time from https://github.com/ploneintranet/pat-display-time
-   Fixed an issue with pat-scroll when placed on an item without a href
-   Fixed an issue with pat-autofocus that would set focus on hidden items
-   Fixed an issue with pat-inject scroll that would scroll too much (#694)
-   Modal: Add example on how to open a modal on a button via a proxy anchor element.

### Fixes

-   Fix `pat-auto-suggest` to not show a placeholder if none is defined. Fixes #675
-   Fix `pat-auto-scale` not correctly rescaling after fullscreen changes. Fixes #673
-   Fix heisenbug with pat-scroll on testruns.
-   Fix minimum input length default so that you can display select results already on click.
-   Fix `pat-validation` to not skip `pat-autosuggest` inputs even though they're
    hidden. Fixes #683

## 3.0.0a5 - unreleased

### Features

-   Added support for a push subsystem using reethinkdb and horizon.
    That allows us to trigger an injection by sending a push_marker to all connected browsers.
    (This is still in an evaluation state)
-   pat-forward: understand the trigger auto option

### Fixes

-   pat-date-picker, pat-datetime-picker: Support the `first-day` parameter (#647)
-   pat-notification: fix how the close button is rendered (#639)
-   pat-modal: remove an handler after the modal is closed (allows for injection inside modals, see #550)
-   Enable babel transpiler
-   Interim condition to trigger: autoload-visible to abort injection in case the tartget element is no longer present.
-   pat-inject: autoload-visible now uses the intersection observer
-   Allow clearing a selection if the field is not required

## 3.0.0a1 - unreleased

### Breaking Changes

+++Big breaking upgrade changing the build system. Read the [version 2 to 3 upgrade guide](./UPGRADE-2-TO-3.md) for details.+++

-   Switched fully to npm for package retrieval, deprecating bower (pilz)
-   Introduce webpack to create the bundle and deprecate require.js (pilz)
    Read [version 2 to 3 upgrade guide](./UPGRADE-2-TO-3.md) for details.
-   Tests are upgraded to Jasmine 2.8.0 syntax
-   Testrunner is now karma 1.7
-   Coverage reports are generated
-   Removed deprecated packages

    -   jquery.tinymce
        Very big and unmaintained. We have never advertised it so we don't include it anymore to clean up.
    -   requirejs
        No longer required
    -   requirejs-text
        No longer required
    -   jquery.textchange
        needed for tinymce, not npm compatible, assumed unnecessary as we removed jquery.tinymce
    -   Showdown Table
        As of showdown v 1.2.0, table support was moved into core as an opt-in feature making this extension obsolete. See https://github.com/showdownjs/table-extension
    -   Showdown Github
        As of showdown v 1.2.0, github support was moved into core as an opt-in feature making this extension obsolete. See https://github.com/showdownjs/github-extension
    -   pat-validate
        Has been superceeded by pat-validation and is no longer maintained.
    -   pat-checkedflag will go away. Its functionality is duplicated by pat-select and pat-checklist

-   pat-inject: Fix autoload visible link inside collapsed elements
-   pat-inject: Fix double click on a pat-inject link
-   pat-checklist: understand injection
-   pat-auto-scale: support more sizing options.
-   pat-validation: fix date validation
-   pat-switch: after a switch occurs, trigger a resize event (some elements may have been appeared and we might need a redraw)
-   fixed path to spectrum-colorpicker
-   fixed #512 by also setting the data-option-value attribute
-   pat-tooltip: before hiding the tooltip wait for the injection to be triggered. (ale-rt)
-   Downgrading jquery to 1.11.0 to preserve a feature check for IE11 which otherwise breaks masonry on SVG files. See https://github.com/quaive/ploneintranet.prototype/issues/547
-   Include own modernizr config file and reduce amount of checks included to mainly css ones
-   New carousel pattern based on slick carousel (http://kenwheeler.github.io/slick/)
    The old carousel based on anythingslider is still available as pat-carousel-legacy
-   upgrade moment.js to 2.19.3 to address security vulnerability
-   pat-calendar: Fixed check for categories
-   Improve pat-checklist to allow select/deselect on subset of elements
-   Extend pat-focus to add `has-value` class, `data-placeholder` and `data-value` attributes.
-   Add idle trigger to injection.
-   Fixed injection so that urls with data: in them don't get prefixed with a / anymore.
-   pat-checklist now uses Sets to collect its siblings, that should make it much faster with large lists of icons.
-   pat-carousel gets infinite option
-   pat-subform that also have the pat-autosubmit can be submitted pressing enter
-   fixed the way how the tab with is calculated in pat-tabs.
-   improve pat-autosuggest to display max one selects as select instead of input
-   New comparator for depends parser.

## 2.2 - unreleased

-   pat-masonry:
    -   Re-Layout on `load` events emitted on `img` nodes within the masonry scope.
    -   Do not depend on `imagesloaded`.
    -   Update masonry to version 4.2.0.
    -   Align options with new version:
        -   Add options `is-horizontal-order`, `is-percent-position` and `is-resize`.
        -   Remove options `visible-style` and `hidden-style`.
        -   Add Aliases from v4 (no `is-*`) to v3 names (with `is-` for booleans), while keeping the v3 names. The patternslib parser does boolean casting for `is-*` options.
-   pat-datetime-picker: Add new pattern for setting the date and time.
-   pat-date-picker: Remove the dependency on `moment-timezone-data` - it's not used and there is no use in a date picker anyways.

## 2.1.2 - Aug. 29, 2017

-   pat-modal: Followup fix for the issue where chrome is so quick that a modal is closed before the actual injection call can be sent. Now modals can be closed again. (pilz)

## 2.1.1 - Aug. 28, 2017

### Fixes

-   pat-modal: Only add a panel-header to the first panel-content element within pat-modal, not everyone. Otherwise this may collide with pat-collapsible which also creates a panel-content class further down the DOM (pilz)
-   pat-modal: Fix an issue where chrome is so quick that a modal is closed before the actual injection call can be sent.

## 2.1.1 - Aug. 28, 2017

-   pat-modal: Only add a panel-header to the first panel-content element within pat-modal, not everyone. Otherwise this may collide with pat-collapsible which also creates a panel-content class further down the DOM (pilz)
-   pat-modal: Fix an issue where chrome is so quick that a modal is closed before the actual injection call can be sent.

## 2.1.0 - Jun. 26, 2017

-   pat-gallery: Also include the node with the `pat-gallery` class trigger for initializing the gallery.
    Now `pat-gallery` can be used on anchor tags wrapping images directly, making it possible to let images be opened individually in in the overlay without adding them to a gallery with navigation controls to the next image.
-   fix input-change-events for <input type="number" />
-   pat-autosubmit: allow nested autosubmitting subforms with different delays.
-   pat-masonry: Initialize masonry just before layouting gets startet, which is after first image has been loaded or at loading has finished. This avoids overlapping images while they are still being loaded.
-   pat-masonry: fix layout of nested .pat-masonry elements
-   pat-gallery: UX improvements - do not close on scroll or pinch.
-   pat-gallery: UX improvements - remove scrollbars when gallery is opened.
-   pat-gallery: add option `item-selector` for gallery items, which are added to the gallery.
    Defaults to `a`.
    Fixes situations, when gallery items and normal links are mixed within the same container and normal links would open within the gallery lightbox.
-   Update to jQuery 1.11.3.
-   While images are loading, already do masonry layouting.
-   Remove the `clear-imagesloaded-cache` trigger, as cache functionality was removed from imagesloaded from version 3.2.0.
    See: https://github.com/desandro/imagesloaded/issues/103#issuecomment-152152568
-   Change `imagesloaded` from usage of jQuery plugin to vanilla JavaScript to avoid timing errors, where the `imagesloaded` plugin wasn't available.
-   Update `masonry` and `imagesloaded` plugins.
-   Fix `pat-gallery` to work with `requirejs-text` instead `requirejs-tpl-jcbrand`.
    Fixes an obscure "window undefined" error.
    Backwards incompatible change: The `photoswipe-template` RequireJS configuration variable is removed and a the `pat-gallery-url` variable is defined instead.
-   always recalculate masonry also at the very end, even if there are no images to be loaded
-   Fix a bug in pat-scroll that would only properly leave nav items alone if their urls end in a slash
-   An href can also contain a url left of the hashmark. pat-scroll should only care for the part right of the hashmark
-   Issue a delayed redraw of the calendar to prevent rendering race conditions
-   make list of calendar categories unique to speed up js processing on sites with many calendars.

## 2.0.14 - Aug. 15, 2016

-   A fix for pat-scroll to scroll up to current scroll container instead of body.
-   A fix for pat-scroll to await loading of all images before determining the amount to scroll up.
-   A fix for IE10/11 where the modal wouldn`t close anymore due to activeElement being undefined
-   Allow to configure different data-pat-inject per formaction, so that different targets can be configured per formaction

## 2.0.13 - Apr. 27, 2016

-   New property for sortable pattern, `drag-class`, the CSS class to apply to item being dragged. Is `"dragged"` by default.
-   New property for sortable pattern, `drop`, a Javascript callback function to be called when an item is dropped.
-   Form with pat-autosubmit doesn't get notified when injected inputs change.
-   Inject pattern with `autoload-visible` injected erroneously based upon old autoload element no longer in DOM.
-   Add the class `modal-active` to the `body` element whenever a modal is in the DOM.
-   New pattern: `pat-tabs`. See the relevant documentation.
-   Bugfix: `pat-validation` still validates removed clones from `pat-clone`.
-   Let the next-href option of pat-inject work as advertised.
-   Parser fix: don't treat `&amp;` as a separator
-   #436 Remove `pat-bumper` restriction that scroll container must be the direct parent.
-   pat-masonry fix: the `containerStyle` value must be an object.

## 2.0.12 - Oct. 9, 2015

-   New property for the inject pattern: `loading-class`.
    Specifies a class to appear on the injection target while the injected content is still loading.
    Previously this was hardcoded to `injecting`, this is still set to the default value.
-   New propertys for the inject pattern: `confirm` and `confirm-message`.
    Allows you to specify whether a confirmation message should be shown before
    injecting, as well as the text of that message.
-   New property for tooltip pattern: `mark-inactive`.
    A boolean value, used to specify whether the class 'inactive' should be added
    to the tooltip trigger. Previously this behavior was hardcoded, now it's
    optional with a default of `true`.
-   Fix: tooltips with `closing` set to `sticky` or `auto` couldn't be closed on mobile.
-   Parser fix. Remove duplicate configurations.
-   Bugfix: TypeError: Cannot read property 'msie' of undefined.

## 2.0.11 - Sept. 30, 2015

-   Bugfix. Specifying combined pattern properties (with &&) not working on IE10.
-   Add an alternative parser, from the Mockup project.
-   Updated documentation.
-   Clone pattern has a new argument: remove-behaviour.

## 2.0.10 - Sept. 18, 2015

-   Add new argument "hooks" to pat-inject.
-   Add new parser method addAlias for adding aliases of parser arguments.
-   Add the addJSONArgument method to the argument parser, which provides support for JSON as argument values.
-   Added Sass files for all patterns.
-   Bugfix in pat-masonry. Wait until images are loaded.
-   Bugfixes and improvements to pat-clone.
-   Fixed a bug where the page reloads when the image viewer from pat-gallery is closed.
-   In pat-autosuggest, new option allow-new-words, for explicitly allowing or denying custom tags.
-   Make pat-bumper also bump against the bottom edge.
-   New layout. All files relevant to individual patterns (except for tests) are now in ./src/pat
-   pat-gallery now uses Photoswipe 4.1.0 and is based on pat-base.
-   New pattern pat-validation which replaces pat-validate.

## 2.0.9 - Mar 30, 2015

-   Fixed IE bug in pat-equalizer
-   #389 Add support in pat-inject for the HTML5 formaction attribute
-   New pattern: pat-clone.
-   Upgrade to jQuery 1.11.1

## 2.0.8 - Feb. 5, 2015

-   #395 add body class after patterns loaded from registry

## 2.0.7 - Feb. 4, 2015

-   #381 Checked class not set on checklist
-   Add stub module i18n.js. Provides compatibility with Mockup patterns.
-   Add support for Mockup patterns.
-   Add support for parsing JSON as pattern configuration
-   Add support for using pat-subform together with pat-modal.
-   Give pattern plugins the change to modify arguments before returning them.
-   New arg for pat-autosuggest: words-json
-   New pattern: pat-masonry

## 2.0.6 - Dec. 10, 2014

-   New core module pluggable.js which allows the creation of Pluggable patterns.

## 2.0.5 - Dec. 4, 2014

-   #383 pat-equaliser sets the height to early

## 2.0.4 - Oct. 7, 2014

-   spectrum lib for colour picker now defaults to hsv values. Keep hex as default for backward compatibility (SLC ref 9849)
-   pat-inject autoload did not properly remove event handlers, so that they were called over and over. (SLC ref 10695)

## 2.0.3 - Sept. 22, 2014

-   when another tooltip trigger is clicked, only close the previous tooltip if
    it does not contain the trigger. slc ref #9801
-   moved utils.debounce() call to fix removal of event handler
    slc ref #10695

## 2.0.2 - Sept. 8, 2014

-   #377 Local inject doesn't work for IE10 and 11
-   #378 pat-switch detecting click on container of link prevent default on anchor
-   #379 pat-checklist selectAll/deselectAll only works inside .pat-checklist element

## 2.0.1 - Sept. 2, 2014

-   Bugfix in pat-toggle. Check that the previous state is not null before
    attempting to restore it.

## 2.0.0 - August 11, 2014

-   New patterns:

    -   Colour picker pattern. This can be used as a polyfill for browsers which do
        not support colour inputs.
    -   Notifications pattern for self-healing messages.

-   Autofocus pattern: never give an input element the focus if it was hidden
    by the depends pattern.

-   Autosuggest pattern:

    -   Add AJAX-support to load available options from a backend server.

    -   Clear the selected value from a reset button for the form is pressed.

    -   Do not open the auto-suggest dropdown on enter.

    -   Fix width-related layout problems.

    -   Add option to restrict the max amount of selected items.

-   Bumper pattern: support bumping inside scrolling containers.

-   Checked flag pattern: fix initialisation of radio buttons. Pre-checked
    radio buttons would not marked as such if there were unchecked radio
    buttons later in the DOM.

-   Checklist pattern: correctly initialise the state on initial page view.

-   Inject pattern: do not try to rebase `mailto:` URLs.

-   Modal pattern:

    -   Add a new `closing` option. This allows configuring how a modal can be
        closed.
    -   Various positioning improvements.

-   Sortable pattern: add a new `selector` option to specify which elements
    to sort. This makes it possible to use the pattern outside lists.

-   Switch pattern: prevent default action when a link is clicked.

-   Tooltip pattern:

    -   Correctly handle a button with `close-panel` class in AJAX-loaded tooltip
        content. This fixes fixes [ticket
        356](https://github.com/Patternslib/Patterns/issues/356).

    -   Add new `target` option to specify where to insert a tooltip in the DOM.

    -   Update the tooltip position of a parent is scrolled.

## 1.5.0 - January 22, 2014

-   Add a new [stacks pattern](demo/stacks/index.html).

-   [Tooltip pattern:](demo/tooltip/index.html): Add a new `ajax-data-type`
    option that makes it possible to use markdown content as AJAX source.

-   Update Makefile to install npm modules as needed. This makes it
    possible to completely bootstrap and build Patterns using make
    from a clean git clone.

-   [Checked flag pattern](demo/checkedflag/index.html): make sure the fieldset
    classes are updated correctly when changing the radio button selection. This
    fixes [ticket 348](https://github.com/Patternslib/Patterns/issues/348).

-   [Bumper pattern](demo/bumper/index.html):

    -   add new `selector` option to allow overriding which elements must be
        updated.
    -   Add new options to specify which classes much be added/removed when
        an item is (un)bumped.

-   Depends pattern: also update dependencies on keyup. This makes sure
    actions happen without forcing a user to move focus away after modifying
    a text field.

-   Rewrite the [slides pattern](demo/slides/index.html) to use the new
    Patternslib slides library, replacing shower.

-   Fix event handling in the sortable pattern. This could result in unexpected
    behaviour in Firefox.

-   Add a new [forward pattern](demo/forward/index.html).

-   Add a missing dependency on jquery-ext to the registry module. This fixes
    errors invoking the scan function when using a Patterns bundle.

-   Validate pattern: perform validation when submitting forms via AJAX.

-   The argument parser can now disable configuration inheritance if needed
    by a pattern.

-   The select-option pattern has been merged into the [checked
    flag](demo/checked-flag/index.html) pattern.

-   Checked flag pattern: add new API to control select and checkbox elements.

-   Do not handle exceptions during Patterns initialisation and transforms if a
    `patterns-dont-catch` query string parameter is present.

## 1.4.1 - July 13, 2013

-   Validate pattern: always validate form elements when they are changed instead
    of waiting for a first form submit. This fixes
    [ticket 324](https://github.com/Patternslib/Patterns/issues/324).

-   Update to a new version of [shower](http://shwr.me/) which does not hijack
    key events when not in presentation mode. This fixes
    [ticket 315](https://github.com/Patternslib/Patterns/issues/315).

-   Handle security errors when checking if a browser supports sessions storage.
    This fixes [ticket 326](https://github.com/Patternslib/Patterns/issues/326).

-   Add new [equaliser pattern](demo/validate/index.html). This fixes
    [ticket 307](https://github.com/Patternslib/Patterns/issues/307).

-   Depends pattern: allow dashes in input names and values again. This fixes
    [ticket 313](https://github.com/Patternslib/Patterns/issues/313).

## 1.4.0 - Released May 24, 2013

-   Include value of used submit button when using forms for injection. This
    fixes [ticket 305](https://github.com/Patternslib/Patterns/issues/305).

-   The argument parser has been updated to support quoted arguments in shorthand
    notation.

-   Add new [validate pattern](demo/validate/index.html). This fixes
    [ticket 68](https://github.com/Patternslib/Patterns/issues/68).

-   Add a new internal `pat-update` event which is triggered for elements that
    are changed.

-   Markdown pattern: correct internal escaping behaviour which could cause
    characters to show up in unexpected escaped form in literal blocks. This
    fixes [ticket 306](https://github.com/Patternslib/Patterns/issues/306).

-   Depends pattern:

    -   Include element with invalid dependency in error log messages. This makes
        it a lot simpler to find the source of errors.

    -   Support non-ASCII variable names and values. This fixes [ticket
        304](https://github.com/Patternslib/Patterns/issues/304).

    -   Do not include generated parser in source tree. Instead the make rules
        have been improved to generate/update the parser as needed.

    -   Support quoting of values. This makes it possible to test for values
        containing whitespace.

## 1.3.1 - Released May 6, 2013

-   Collapsible pattern: add a new `slide-horizontal` transition.

-   Slideshow builder pattern: make it possible to insert the slideshow fieldset
    in a different location than at the start of the form.

-   Packaging: Remove unneeded dependency on jquery.autosuggest.

-   Injection pattern:

    -   Fix injection of HTML5 elements in IE 8 and older.
    -   Fix the rebasing of URLs when injecting in IE 8 and older.
    -   Send a new `pat-inject-content-laoded` event when all images in injected
        markup have finished loading.

-   Modal pattern:

    -   Reposition the modal after its images have finished loading.
    -   Improve browser compatibility.

## 1.3.0 - Released April 5, 2013

-   Fix use of an undeclared variable in the parser which could result in
    problems in IE8. This fixes
    [ticket 298](https://github.com/Patternslib/Patterns/issues/298).

-   Markdown pattern:

    -   Generate HTML5 `<section>` elements with a `<h1>` header when converting
        headers. This fixes [ticket
        216](https://github.com/Patternslib/Patterns/issues/216).

    -   Support filtering if injected markdown documents with headers using
        underlined (equal signs or dashes) style notation.

    -   Update the version of
        [pagedown-extra](https://github.com/jmcmanus/pagedown-extra) which could
        case markdown constructs to be replaces with the word `undefined`. This
        fixes [ticket 297](https://github.com/Patternslib/Patterns/issues/297).

-   Injection pattern: extend _autoload-in-visible_ to also apply for situations
    where we are not dealing with a heigh-constrained scrollable parent but need
    to look at the entire page.
    This fixes [ticket 296](https://github.com/Patternslib/Patterns/issues/296).

-   The [switch pattern](demo/switch/index.html) can now remember the its state.
    This fixes [ticket 293](https://github.com/Patternslib/Patterns/issues/293).

-   Add a new [gallery](demo/gallery/index.html) pattern.

## 1.2.1 - Released April 5, 2013

-   Fix use of an undeclared variable in the parser could result in problems
    in IE8. This fixes
    [ticket 298](https://github.com/Patternslib/Patterns/issues/298).

-   Fix handling of trailing semicolons in the the argument parser. This fixes
    [ticket 295](https://github.com/Patternslib/Patterns/issues/295).

-   Internal build-related changes:

    -   Stop automatically using the latest CSS and images from jquery.fullcalendar
        and jquery.select2 in our demos to prevent unexpected changes. Instead we
        now use a copy we can update as needed.

    -   Rewrite top level makefile:

        -   Update the bungles if `packages.json` has changed.
        -   Move jshint out to a new `jshint` target. This is automatically invoked
            when running `make check`, but is skipped when you only want to run
            the unittests.

-   Modify included HTML pages to use modules instead of bundles. This makes
    development easier by removing the need to always rebuild bundles.

-   Add new [slide pattern](demo/slides/index.html).
    (Wichert Akkerman)

-   Add new [slideshow builder pattern](demo/slideshow-builder/index.html).
    (Wichert Akkerman)

## 1.2.0 - Released March 28, 2013

-   Update the website design. (Cornelis Kolbach)

-   Packaging changes:

    -   New bootstrap to handle installation of all dependencies and build
        bundles (Marko Đurković, Florian Friesdorf)

    -   Switch dependency management from jamjs to bungle. Remove all third party
        packages from the source tree. (Marko Đurković)

-   The _setclass_ pattern was removed in favour of the newer _switch_ pattern.
    [Ticket 270](https://github.com/Patternslib/Patterns/issues/270)
    (Wichert Akkerman)

-   Add a new _select-option_ pattern to faciliate styling of select elements.
    [Ticket 276](https://github.com/Patternslib/Patterns/issues/276)

-   Zoom pattern: make zoom fallback control (text input field) react properly to
    change events. (Marko Đurković)

-   Improve documentation for the image-crop pattern.

-   Fix handling of position hints for tooltips. (Marko Đurković)

-   Autoscale pattern:

    -   Avoid creating infinite loops with the resize handler in IE8. This could
        load to browser crashes.
        (Marko Đurković)

    -   Use the _scale_ method on IE 9 as well.
        [Ticket 281](https://github.com/Patternslib/Patterns/issues/281)
        (Wichert Akkerman)

-   Injection pattern:

    -   Add missing dependency on jquery.form.
        [Ticket 267](https://github.com/Patternslib/Patterns/issues/267)
        (Wichert Akkerman)

    -   Also rebase URLs for `video` and `source` elements.
        (Florian Friesdorf)

    -   Modify attribute value escaping in HTML parser to always use `&quot;` for
        double quotes. This fixes problems attribute values containing double
        quotes.
        (Wichert Akkerman)

    -   Rewrite URL rebasing logic to use the browser''s HTML parser again. This
        should improve robustness when dealing with non-standard markup.
        (Marko Đurković)

-   Depends pattern:

    -   Really hide/show elements if no transition type was specified (or
        `none` was specified explicitly).

    -   Add support for a `~=` operator to test for substrings.
        (Wichert Akkerman)

    -   Make the easing used for animations configurable.
        (Wichert Akkerman)

-   Form-State pattern: add `form-state-saved` signal.
    (Marko Đurković)

-   Modal pattern:

    -   Automatically position modals using javascript to fix problems with IE9 and
        make sure they always fit in the viewport.
        (Cornelis Kolbach and Marko Đurković)

    -   Make sure elements inside a modal do not accidentily loose their focus.
        This broke the handling of autofocus in modals. [Ticket
        266](https://github.com/Patternslib/Patterns/issues/266) (Wichert Akkerman)

-   Check-list pattern: send _change_ event when a checkbox is toggled. This fixes
    interaction with other patterns such as the checked-flag pattern.

-   Collapsible pattern:

    -   Add new option to specify an (external) triggering element.
        [Ticket 274](https://github.com/Patternslib/Patterns/issues/274)
        (Wichert Akkerman)

    -   Make it possible to specify the transition effect to use when opening or
        closing a panel.
        (Wichert Akkerman)

-   Markdown pattern:

    -   Include section selector in `data-src` attribute.
        [Ticket 259](https://github.com/Patternslib/Patterns/issues/259)
        (Wichert Akkerman)

    -   Correct detection of the end of a extracted sections.
        [Ticket 268](https://github.com/Patternslib/Patterns/issues/268)
        (Wichert Akkerman)

    -   Make sure we correctly identify autoloaded markdown content referenced from
        a just-injected HTML fragment.
        [Ticket 188](https://github.com/Patternslib/Patterns/issues/188)
        (Wichert Akkerman)

    -   Use a new markdown converter for every pattern. This fixes problems with
        shared converter state if the pattern tried to convert two pieces of
        markdown at the exact same time.
        (Wichert Akkerman)

-   Placeholder pattern: remove Modernizr dependency.
    (Wichert Akkerman)

-   Sortable pattern: fix weird behaviour when element is dropped on self.
    (Markoi Đurković)

-   Core logic changes:

    -   Patterns main.js returns registry, you have to call patterns.init()
        manually. For the bundles this happens automatically. Depend on
        `patterns/autoinit`, if you really want an auto-initializing modular
        patterns library. (Florian Friesdorf)

    -   Registry: Add option to registry.scan to let init exceptions
        through. (Rok Garbas)

    -   Registry: rescans the DOM for patterns registered after the initial
        DOM scan. (Florian Friesdorf)

    -   Include pattern name in the parser log output. This makes it much easier to
        debug problems. (Wichert Akkerman)

    -   HTML parser:

        -   Correctly handle tag and attribute names containing a colon.
            (Wichert Akkerman)

        -   Correct escaping of double quotes in attribute values.
            (Wichert Akkerman)

## 1.1.0 - Released February 7, 2013

-   bumper pattern fetches DOM info in event handler, not only during init.
    [Ticket 232](https://github.com/Patternslib/Patterns/issues/232). (Marko Đurković)

-   pat/ajax to handle anchors and forms, supersedes lib/ajax (Florian Friesdorf, Marko Đurković)
    including:
    [Ticket 148](https://github.com/Patternslib/Patterns/issues/148).

-   pagedown 1.1.0 and pagedown-extra with code in table support (Marko Đurković,
    Florian Friesdorf)
    [Ticket 252](https://github.com/Patternslib/Patterns/issues/252).

-   edit-tinymce independent of ajax (Marko Đurković)

-   input-change events used by autosubmit and form-state (Marko Đurković)

-   Bring back API documentation (Wichert Akkerman)

-   Website improvements content/design (cornae)

-   Improved support for custom bundles (still experimental)
    [Ticket 227](https://github.com/Patternslib/Patterns/issues/227). (Marko Đurković)
    [Ticket 235](https://github.com/Patternslib/Patterns/issues/235). (Marko Đurković)

-   testrunner support on nixos (Florian Friesdorf)

-   experimental support for yet undocumented `data-pat-inject="history: record"`. (Marko Đurković)

-   Generate test runners for modules and bundles ourselves, removing
    dependency on grunt. (Marko Đurković)

-   Registry informs about loaded patterns. (Florian Friesdorf)

-   Renamed `patterns` folder to `pat`. Having `Patterns` mapped to
    `Patterns/src/main` this enables `requires['Patterns/pat/inject']. (Florian Friesdorf)

-   Do not run javascript loaded in the document twice. This was causing
    problems with third party modules such as [shower](http://shwr.me/)
    and was not expected behaviour. [Ticket
    231](https://github.com/Patternslib/Patterns/issues/231).. (Wichert Akkerman)

-   Auto-scale pattern: add new `min-width` and `max-width` options.
    [Ticket 242](https://github.com/Patternslib/Patterns/issues/242).
    (Wichert Akkerman)

-   Tooltip pattern (Wichert Akkerman):

    -   Change the options used to configure the tooltip. Part of
        [ticket 220](https://github.com/Patternslib/Patterns/issues/220).

    -   Add new delay feature to postpone opening of tooltips on hover. Part of
        [ticket 220](https://github.com/Patternslib/Patterns/issues/220).

    -   Add new option to set a class on the tooltip container. This allows for
        styling of individual tooltips. Part of
        [ticket 220](https://github.com/Patternslib/Patterns/issues/220).

## 1.0.1 - Released January 28, 2013

-   Fix test failures in transform tests.

## 1.0.0 - Released January 28, 2013

-   First official release.
