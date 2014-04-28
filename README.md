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
    make

This will generate a `bundle.js` file which contains Patterns and all its
dependencies.

## Development

To develop on Patterns, clone the repository and set it's push-url to
your fork:

    git remote set-url --push origin <url_to_your_fork>

Create a branch for the feature/bug you are working on:

    git checkout -b <feature>

For inclusion use either a GitHub pull request or create a ticket with
a url to your external repository.

### Running tests

The simplest way to run the tests are to use make:

    make check

This will install all required npm and bower packages and run the tests.
