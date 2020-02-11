# Patterns

[![Build Status](https://travis-ci.org/Patternslib/Patterns.png?branch=master)](https://travis-ci.org/Patternslib/Patterns)

Patterns is a toolkit that enables designers to build rich
interactive prototypes without the need for writing any JavaScript. All events
are triggered by classes and other attributes in the HTML, without abusing the
HTML as a programming language. Accessibility, SEO and well structured HTML are
core values of Patterns.

## Browser support

Patterns aims to support at least the two latest major versions of all popular browsers.

Currently that means:

- Apple Safari 5+
- Google Chrome 30+
- Microsoft Internet Explorer 9+

Other browser version may work too, but are not actively tested against.

## Installation

You need to be on a recent node version and have yarn installed.

    git clone git://github.com/Patternslib/Patterns.git
    cd Patterns
    make

This will generate a `bundle.js` file which contains Patterns and all its
dependencies.

Alternatively, you can [download a bundle at patternslib.com](http://patternslib.com/download.html).

## Layout

The individual patterns are located in their own folders in `./src/pat/`.

Each pattern folder contains some or all of the following files:

- _index.html_ which contains HTML markup that shows a demonstration of the pattern.
- _documentation.md_ which is a Markdown file that documents the pattern's purpose, how to use it and how to configure it.
- A javascript file which implements the pattern's functionality.
- A Sass (.scss) file which provides the CSS associated with the pattern.

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

To run the tests in a browser, open the `tests.html` file in the browser of your choice.

To run automated tests in a browser instead of the defaul headless browser, run the following command:

    karma start webpack/karma.config.js --browsers=Chrome --single-run=false


### Check bundle sizes

We added a webpack plugin which helps in analyzing bundle sizes.
Check if the bundle size doesn't grow much bigger.
After running webpack via `make build`, `make serve` or `make check` stats.json and stats.html file are created.
Open stats.html in a browser to interactively check the payload each package contributes to the generated bundle.

### Organisations and projects which use Patternslib

- [Overstroom ik?](http://www.overstroomik.nl), a website which informs Dutch citizens of their risk of flooding. It was introduced and highly praised by the Dutch minister of infrastructure and environment, Melanie Schultz.
- [OiRA](https://client.oiraproject.eu/), an online risk assessment tool, created for the Occupational Health and Safety Agency (OSHA) of the European Union.
- [Staralliance](http://www.staralliance.com) uses Patternslib in their intranet.
- [Plone](http://plone.com) CMS and [Plone Intranet project](http://ploneintranet.com) both use Patternslib.

### Interactive HTML/CSS prototypes made with Patternslib

- [The Plone Intranet prototype](http://prototype.ploneintranet.net/dashboard.html)
- The [Patternslib.com](http://patternslib.com) website uses Patternslib and is based upon a prototype, which can be found [here](https://github.com/patternslib/Patterns-site).
