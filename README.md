[![Build Status](https://travis-ci.org/Patternslib/Patterns.png?branch=master)](https://travis-ci.org/Patternslib/Patterns)

# Patterns

Patterns is a JavaScript library that enables designers to build rich
interactive prototypes without the need for writing any JavaScript. All events
are triggered by classes and other attributes in the HTML, without abusing the
HTML as a programming language. Accessibility, SEO and well structured HTML are
core values of Patterns.

## Browser support

Patterns aims to support at least the two latest major versions of all popular browsers.

Currently that means:

- Apple Safari 5+
- Google Chrome 20+
- Microsoft Internet Explorer 8+

Other browser version may work too, but are not actively tested against.

### Installation

    git clone git://github.com/Patternslib/Patterns.git
    cd Patterns
    ./bootstrap

This will generate minified and non-minified bundles of the current Patterns
snapshot in the `bundles` subdirectory. If you want to create bundles for a
specific version, you can use `make bundle REF=version`. For example

    make bundle REF=v1.1.0

will create bundles for Patterns 1.1.0. You can set `version` to any reference
git understands. If, for some reason, you want to build bundles for all
previous versions of Patterns you can use

    make bundles-all-tags

## Development

To develop on Patterns, clone the repository and set it's push-url to
your fork:

    git remote set-url --push origin <url_to_your_fork>

Create a branch for the feature/bug you are working on:

    git checkout -b <feature>

For inclusion use either a GitHub pull request or create a ticket with
a url to your external repository.

### Running the webservice locally

For testing with a web browser you can start a small standalone web server from
the patterns git checkout.

Start the server with

    node webserver.js

and open

    http://localhost:2652

with your favourite internet browser.

### Running tests

The simplest way to run the tests are to use npm:

    npm test

The command `npm test` will alse create the files
`tests/TestRunner-modules.html`, `tests/TestRunner-bundle.html`, and
``tests/TestRunner-bundle-min.html` which you can open in a browser to
test the modularized, bundled and minified version of Patterns. The
modularized version is linked to `tests/index.html`.

