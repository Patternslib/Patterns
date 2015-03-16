/* jshint sub: true */
/* global config */
//
config.paths["jasmine"] =        "bower_components/jasmine/lib/jasmine-core/jasmine";
config.paths["jasmine-html"] =   "bower_components/jasmine/lib/jasmine-core/jasmine-html";
config.paths["console-runner"] = "../node_modules/phantom-jasmine/lib/console-runner";
config.shim['jasmine-html'] = {
    deps: ['jasmine'],
    exports: 'jasmine'
};

require.config(config);

require([
    "jquery",
    "jasmine-html",
    "jquery.browser"
    ], function($, jasmine) {
        require([
            "console-runner",
            "pat-compat",
            "../tests/specs/core/base",
            "../tests/specs/core/jquery-ext",
            "../tests/specs/core/parser",
            "../tests/specs/core/store",
            "../tests/specs/core/url",
            "../tests/specs/core/utils",
            "../tests/specs/lib/depends_parse",
            "../tests/specs/lib/dependshandler",
            "../tests/specs/lib/htmlparser",
            "../tests/specs/pat/ajax",
            "../tests/specs/pat/autoscale",
            "../tests/specs/pat/autosubmit",
            "../tests/specs/pat/autosuggest",
            "../tests/specs/pat/bumper",
            "../tests/specs/pat/calendar",
            "../tests/specs/pat/carousel",
            "../tests/specs/pat/checkedflag",
            "../tests/specs/pat/checklist",
            "../tests/specs/pat/clone",
            "../tests/specs/pat/collapsible",
            "../tests/specs/pat/depends",
            "../tests/specs/pat/equaliser",
            "../tests/specs/pat/focus",
            "../tests/specs/pat/gallery",
            "../tests/specs/pat/image-crop",
            "../tests/specs/pat/inject",
            "../tests/specs/pat/legend",
            "../tests/specs/pat/markdown",
            "../tests/specs/pat/masonry",
            "../tests/specs/pat/modal",
            "../tests/specs/pat/slides",
            "../tests/specs/pat/slideshow-builder",
            "../tests/specs/pat/stacks",
            "../tests/specs/pat/switch",
            "../tests/specs/pat/toggle",
            "../tests/specs/pat/tooltip",
            "../tests/specs/pat/validate",
            "../tests/specs/pat/zoom"
        ], function() {
            var jasmineEnv = jasmine.getEnv();
            var reporter;
            if (/PhantomJS/.test(navigator.userAgent)) {
                reporter = new jasmine.ConsoleReporter();
                window.console_reporter = reporter;
                jasmineEnv.addReporter(reporter);
                jasmineEnv.updateInterval = 0;
            } else {
                reporter = new jasmine.HtmlReporter();
                jasmineEnv.addReporter(reporter);
                jasmineEnv.specFilter = function(spec) {
                    return reporter.specFilter(spec);
                };
                jasmineEnv.updateInterval = 0; // Make this more to see what's happening
            }
            jasmineEnv.execute();
        });
    }
);
