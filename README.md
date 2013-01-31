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

## Development

To develop on Patterns or one of it's submodules, clone the repository
and set it's push-url to your fork:

    git remote set-url --push origin <url_to_your_fork>

Create a branch for the feature/bug you are working on:

    git checkout -b <feature>

For inclusion use either a GitHub pull request or create a ticket with
a url to your external repository.

### Installation

    git clone git://github.com/Patternslib/Patterns.git
    make

### Running tests

The simplest way to run the tests are to use npm:

    npm install
    npm test

The first command is only needed once and will install all tools required to 
build patterns and run its tests.

The command `npm test` will alse create the files
`tests/TestRunner-modules.html` and `tests/TestRunner-bundle.html` which you
can open in a browser to test the modularized oder bundled version Patterns.

