/*

The configuration (for the r.js script) and these instructions are based on the
following assumptions:
* This file (app.build.js) is located in project's root directory
  (i.e. /home/user/workspace/Patterns - refered to as <Patterns> in the rest of the text
* The r.js file is also located in <Patterns> dir.
* <Patterns> dir contains a subdirectory named src. The latter contains JS files (might
  be nested in other subdirs) which we want to combine into a single JS file.

To optimize and combine files, cd to <Patterns> dir and run the following command:

  node r.js -o app.build.js

It is assumed you have nodejs installed on your system. If not refer to the require.js's
documentation:
http://requirejs.org/docs/optimization.html#requirements

The r.js script will copy all source files from src to src-build directory and optimize
them there. The resulting src-build/main.js file is the one which can now be used on
in production.

You can test it by opening one of the .html files in "demo" directory. Find a line
which looks like this:

    <script data-main="../src/main" src="../lib/require.js" charset="utf-8"></script>

and replace it with the following:

    <script data-main="../src-build/main" src="../lib/require.js" charset="utf-8"></script>

If you open both version of a demo in browsers, you will notice (see Firebug's Net panel),
that in the old version a lot of smaller JS files are requested and downloaded, while the
new version (2nd line) downloads only two JS files - require.js and one big optimized
main.js containing everything, what was then split accros multiple inter-dependent JS files.

Know issues:
------------

* There is a soft link in the src dir pointing to the directory itself. Temporarily
  remove it as it confuses r.js - it causes it to loop until it breaks with an error
  message ("too many symbolic links")
* Optimizing aloha package takes A LOT of time! More than 2 hours on i7 processor were
  not enough. For testing just remove it temporarily. (NOTE: this might also be solved by
  removing any references to the aloha package, but I haven't done much research yet)

*/


({
    appDir: "src",
    baseUrl: "./",     //relative to appDir
    dir: "src-build",  //directory where to copy optimized files
    modules: [
        {
            name: "main",
        }
    ],

    //TODO: this necessary? do we have any "require()"-s nested inside require() or define() calls?
    findNestedDependencies: true
})
