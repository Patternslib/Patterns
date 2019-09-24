# Upgrading from Patternslib 2 to 3

## Requirements

You need to be on a recent node version and have yarn installed.

- node 6.11.2LTS or greater

The change has been made with webpack 3.5.5. Patternslib is configured to fetch the latest version

## Reason for the Upgrade

Bower (https://bower.io) is going slowly out of maintenance and now recommends webpack (https://webpack.js.org) as replacement.

If you are using your own Makefile, bower.js and package.js, things should just continue to work but will eventually get out of sync as paths are going to change. Therefore we recommend changing your installation setup and here are the necessary steps:

## Resources to support you

- There is a very good blog post describing the upgrade steps by Jamund: https://gist.github.com/xjamundx/b1c800e9282e16a6a18e
- There is a tool to help convert: https://www.npmjs.com/package/requirejs-to-webpack-cli
- But you can always look at the new webpack.config.js and compare it to the old build.js and main.js files for details.

## What has been changed?

- The package.json has been extended to download all dependencies, including those that were downloaded by bower before. This required some package name and path changes. As we have downloaded dev dependencies using npm before, this should not have a big influence for you.
  **Action to take: If you have your own package.json and bower.json files, copy over the new "dependencies" section from package.json in patternslib and then extend it with any custom paths you have in your bower.json file. Make sure the names are still the same on npmjs.org compared to the old bower.io package names!**

- The Makefile has been changed to run webpack instead of require.js
  **Action to take: If you have your own Makefile, compare it to the new patternslib one. Mainly all references to bower are gone and we call now webpack instead of bower.**

- The new main config file is webpack.config.js. It contains everything that was before in main.js and build.js.
  **Action to take: If you have your own main.js and build.js, the module declarations now need to go into webpack.config.js. Copy webpack.config.js from patternslib and extend it with the declarations from your main.js. Note that the dependencies are now in node_modules instead of bower_components.**

Once you are done, you can remove the following old files:

- main.js
- build.js
- bower.json
- .bowerrc

## Development

If you want to work on patternslib, you can start the webpack-dev-server by typing

> npm run start

This will open a small http server on port 3001 and load it immediately in your standard web browser.
You can now open the pattern demo pages and work on the js files. On save, dev server will recompile the bundle and you can test.

## Testing

3.0 now uses Karma as testrunner and jasmine 2 syntax for tests. If you have written tests for your code using the old environment, you may now get errors and need to upgrade the syntax. Here are a few helpful links to do that:

- https://jasmine.github.io/2.0/upgrading.html
- http://thejsguy.com/2015/01/29/Upgrading-Jasmine-from-1.3-to-2.1.html

# Changelog

There has been some cleanup as well that might affect your project. Here is a list of changes. If something in here conflicts with your needs, don't upgrade just yet.

## Packages removed

- jquery.tinymce
  Very big and unmaintained. We have never advertised it so we don't include it anymore to clean up.
- requirejs
  No longer required
- requirejs-text
  No longer required
- jquery.textchange
  needed for tinymce, not npm compatible, assumed unnecessary as we removed jquery.tinymce
- Showdown Table
  As of showdown v 1.2.0, table support was moved into core as an opt-in feature making this extension obsolete. See https://github.com/showdownjs/table-extension
- Showdown Github
  As of showdown v 1.2.0, github support was moved into core as an opt-in feature making this extension obsolete. See https://github.com/showdownjs/github-extension
- pat-validate
  Has been superceeded by pat-validation and is no longer maintained.

## Upgraded / converted

- Anythingslider
  Is now pulled from a git repository as it is not available on npmjs.org
- jquery.form
  Has been upgraded from 3.46.0 to 3.50.0 as there is no 3.46 on npmjs.org
- Parsley
  Has been upgraded from 1.2.4 to 2.7.2, because 1.x is not npm compatible
- jcrop
  Has been upgraded from 0.9.14 to 2.0.4 to be npm compatible
- chosen upgraded from "chosen": "https://github.com/syslabcom/chosen.git#4371e8fdabe16d4e8aaa3734421edc367e32a296",
  to chosen-js latest
- Showdown to 1.7.2
- Jasmine to 2.8.0

## Other changes or potential issues

- masonry is now called masonry-layout on npmjs.org
- validate is called validate.js on npmjs.org
- in pat-gallery, replaced requirejs-text plugin with text-loader, see https://github.com/webpack/webpack/issues/1046
- Webpack by default includes everything that is referenced in other files. Moment locale files ship with moment and get autoincluded which results in 100Kb more minified js. We are excluding moment locale files explicitly in webpack.config.js, so by default only english is included.
  XXX Check if that kills some of your localisations.
