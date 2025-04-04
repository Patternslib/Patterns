# Patterns

[![Build Status](https://github.com/Patternslib/Patterns/workflows/test/badge.svg?branch=master)](https://travis-ci.org/Patternslib/Patterns)

Patterns is a toolkit that enables designers to build rich interactive prototypes without the need for writing any JavaScript.
All functionality is triggered by classes and other attributes in the HTML, without abusing the HTML as a programming language.
Accessibility, SEO and well structured HTML are core values of Patterns.


## Changelog

See the [Changelog at GitHub](https://github.com/Patternslib/Patterns/blob/master/CHANGES.md).


## Browser support

Patterns aims to support at least the two latest major versions of all popular browsers:

- Apple Safari
- Google Chrome
- Firefox

Other browser version may work too, but are not actively tested against.


## Development installation requirements

Make sure, you have these requirements installed:

    - Node.js ( https://nodejs.org/en/ )
    - yarn ( https://yarnpkg.com/ )
    - make
    - git

On OSX you need `gnu-tar` instead of tar (GNU tar supports the `--transform` option).
Please install it with e.g. `brew install gnu-tar`.


## Development installation

The following commands will generate a `bundle.min.js` file in the `dist` directory
which contains Patterns and all its dependencies:

    git clone git://github.com/Patternslib/Patterns.git
    cd Patterns
    make

Alternatively, you can [download a bundle at patternslib.com](http://patternslib.com/download.html).

To start the development server, use `make serve` or `npx yarn start` and access the demo pages via [http://localhost:3001/](http://localhost:3001/).
The files are watched and the bundle re-built on changes.
You can access the bundle directly at [http://localhost:3001/bundle.min.js](http://localhost:3001/bundle.min.js).


## Layout

The individual patterns are located in their own folders in `./src/pat/`.

Each pattern folder contains some or all of the following files:

-   _index.html_ which contains HTML markup that shows a demonstration of the pattern.
-   _documentation.md_ which is a Markdown file that documents the pattern's purpose, how to use it and how to configure it.
-   A javascript file which implements the pattern's functionality.
-   A Sass (.scss) file which provides the CSS associated with the pattern.

To generate CSS files from the pattern's included Sass files, type `make all_css`
and the css files will be generated in the same location as the Sass files.

You'll need to have a Sass compiler installed.


## How to demo patterns

To demo the patterns, simply type `make serve` to install the necessary
dependencies and to start a simple Node.js HTTP server.

You can then visit http://localhost:3001 to see a site with demos.

Alternatively, patterns can also be demoed through the
[Patternslib.com](http://patternslib.com) website, which is open-source. The
code and setup instructions are [here](https://github.com/patternslib/Patterns-site).


## Contributing fixes

To develop on Patterns, clone the repository and set it's push-url to your fork:

    git remote set-url --push origin <url_to_your_fork>

Create a branch for the feature/bug you are working on:

    git checkout -b <feature>

For inclusion use either a GitHub pull request or create a ticket with
a url to your external repository.

Please read our [contribution notes](CONTRIBUTING.md) and read our [code style guide](docs/developer/styleguide.md).


### Running tests

The simplest way to run the tests are to use make:

    make check

This will install all required npm and bower packages and run the tests.


### Debugging tests

Eventually add to tests:

    import "core-js/stable";
    import "regenerator-runtime/runtime";

Then:

    node --inspect-brk node_modules/.bin/jest --runInBand ./src/pat/tooltip/tooltip.test.js

Connect in chrome via:

    chrome://inspect

You can pass Jest any parameter it accepts, like `-t TESTPATTERN`::

    node --inspect-brk node_modules/.bin/jest --runInBand ./src/pat/tooltip/tooltip.test.js -t will.be.closed.when


### Enabling log messages

To facilitate debugging you can change the default log level through the URL query string by adding `loglevel` options.

- `http://www.example.com/?loglevel=DEBUG` changes the default log level to `DEBUG`.
- `http://www.example.com/?loglevel-inject=DEBUG` changes the log level for just the inject pattern to `DEBUG`.
- `http://www.example.com/?loglevel=ERROR&loglevel-inject=INFO` changes the standard log level error, but enables messages at the `INFO` level for the inject pattern.

### Patternslib global variables

There are some global variables that are available and can be used to make
global settings or access otherwise hidden objects.

| Global variable | Purpose | Default |
| --------------- | ------- | ------ |
| window.__patternslib_import_styles | Whether to import pattern-specific styles | false |
| window.__patternslib_registry | Global access to the Patternslib registry object. | - |
| window.__patternslib_registry_initialized | True, if the registry has been initialized. | false |
| window.__patternslib_disable_modernizr (Deprecated) | Disable modernizr, but still write the js/no-js classes to the body. | undefined |


### Bundle build analyzation

https://survivejs.com/webpack/optimizing/build-analysis/
https://formidable.com/blog/2018/finding-webpack-duplicates-with-inspectpack-plugin/

Build the stats.json file:

    yarn build:stats

Check dependency tree and why which package was included:
https://www.npmjs.com/package/whybundled

    whybundled stats.json

Visualize dependency tree and analyze bundle size:
https://www.npmjs.com/package/webpack-bundle-analyzer

    webpack-bundle-analyzer stats.json


### Organisations and projects which use Patternslib

-   [Overstroom ik?](http://www.overstroomik.nl), a website which informs Dutch citizens of their risk of flooding. It was introduced and highly praised by the Dutch minister of infrastructure and environment, Melanie Schultz.
-   [OiRA](https://client.oiraproject.eu/), an online risk assessment tool, created for the Occupational Health and Safety Agency (OSHA) of the European Union.
-   [Staralliance](https://www.staralliance.com) uses Patternslib in their intranet.
-   [Plone](https://plone.com) CMS via [Mockup](https://github.com/plone/mockup/), which is built upon Patternslib.
-   [Quaive Intranet](https://quaivecloud.com/) uses Patternslib.


### Interactive HTML/CSS prototypes made with Patternslib

-   The [Patternslib.com](http://patternslib.com) website uses Patternslib and is based upon a prototype, which can be found [here](https://github.com/patternslib/Patterns-site).

