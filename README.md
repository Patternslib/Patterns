# Patterns

[![Build Status](https://github.com/Patternslib/Patterns/workflows/test/badge.svg?branch=master)](https://travis-ci.org/Patternslib/Patterns)

Patterns is a toolkit that enables designers to build rich
interactive prototypes without the need for writing any JavaScript. All events
are triggered by classes and other attributes in the HTML, without abusing the
HTML as a programming language. Accessibility, SEO and well structured HTML are
core values of Patterns.

## Browser support

Patterns aims to support at least the two latest major versions of all popular browsers.

Currently that means:

-   Apple Safari 5+
-   Google Chrome 30+
-   Microsoft Internet Explorer 9+

Other browser version may work too, but are not actively tested against.

## Installation requirements

Make sure, you have these requirements installed:

    - Node.js ( https://nodejs.org/en/ )
    - yarn ( https://yarnpkg.com/ )


## Installation

The following commands will generate a `bundle.js` file in the `dist` directory
which contains Patterns and all its dependencies:

    git clone git://github.com/Patternslib/Patterns.git
    cd Patterns
    make

Alternatively, you can [download a bundle at patternslib.com](http://patternslib.com/download.html).


## Overriding the path where JavaScript and other assets are loaded

The bundle itself is included via a ``<script>`` tag.
But the bundle loads also other assets dynamically - most importantly other JavaScript files from a webpack-built directory called ``chunks``.
By default the path where these files are loaded is the absolute path ``/dist/``.
You might want to override this path for your application.
There are two ways to do this:

1) Similar to ``src/patterns.js`` you can import on top of all other imports another file like ``src/public_path.js`` and define the public path for webpack like so:
```
__webpack_public_path__ = "/my-other-dist-directory";
```

2) You can dynamically set the public path from your web framework and include a ``<script>`` tag in your header BEFORE you load the bundle like so:

```
<script>window.__patternslib_public_path__ = "/my-other-dist-directory/";</script>
```

## Using polyfills

For Internet Explorer support we have included a ``src/polyfills.js`` module.
You can inlcude it optionally via ``src/polyfills-loader.js`` which injects the polyfills bundle only if the current browser is Internet Explorer.
For this to work, include the following in BEFORE you load the patternslib bundle:

```
<script src="/your-dist-directory/polyfills-loader.js" type="text/javascript"></script>
```

Note: this only works, if the bundle nor the polyfills-loader are not loaded asynchronously.
The script loading order matters here and async loading has no deterministic loading order.


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

You can then visit http://localhost:4001 to see a site with demos.

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
-   [Staralliance](http://www.staralliance.com) uses Patternslib in their intranet.
-   [Plone](http://plone.com) CMS and [Plone Intranet project](http://ploneintranet.com) both use Patternslib.

### Interactive HTML/CSS prototypes made with Patternslib

-   [The Plone Intranet prototype](http://prototype.ploneintranet.net/dashboard.html)
-   The [Patternslib.com](http://patternslib.com) website uses Patternslib and is based upon a prototype, which can be found [here](https://github.com/patternslib/Patterns-site).
