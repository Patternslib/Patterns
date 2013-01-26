[![Build Status](https://travis-ci.org/Patternslib/Patterns.png?branch=master)](https://travis-ci.org/Patternslib/Patterns)

Patterns is a JavaScript library that enables designers to build rich
interactive prototypes without the need for writing any Javascript. All events
are triggered by classes and other attributes in the HTML, without abusing the
HTML as a programming language. Accessibility, SEO and well structured HTML are
core values of Patterns.

For more information please see the [documentation](http://patterns.readthedocs.org/).

Install
-------

    git clone git://github.com/Patternslib/Patterns.git
    make

Browser support
---------------

Patterns aims to support the two latest major versions of all popular browsers.
Currently that means:

* Apple Safari 5
* Apple Safari 6
* Google Chrome 20
* Google Chrome 21
* Microsoft Internet Explorer 8
* Microsoft Internet Explorer 9


Development
-----------

To develop on Patterns or one of it's submodules, clone the repository
and set it's push-url to your fork:

    git remote set-url --push origin <url_to_your_fork>

Create a branch for the feature/bug you are working on:

    git checkout -b <feature>

For inclusion use either a github pull request or create a ticket with
a url to your external repository.

Running tests
-------------

The simplest way to run the tests are to use npm:

    npm install
    npm test

The first command is only needed once and will install all tools required to 
build patterns and run its tests. You must have the `grunt-cli` package
installed globally for this to work or npm will not be able to find the
*grunt* command. You can install grunt-cli using `npm`:

    npm install -g grunt-cli

If you want to run the tests in a browser you will need to generate a
testrunner template first:

    grunt jasmine:src:build

This will create a `_SpecRunner.html` file which you can open in a browser.
