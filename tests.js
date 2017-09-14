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
        $.fx.off = true;
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
            "pat/ajax/tests",
            "pat/auto-scale/tests",
            "pat/auto-submit/tests",
            "pat/auto-suggest/tests",
            "pat/bumper/tests",
            "pat/calendar/tests",
            "pat/carousel/tests",
            "pat/checked-flag/tests",
            "pat/checklist/tests",
            "pat/clone/tests",
            "pat/collapsible/tests",
            "pat/date-picker/tests",
            "pat/datetime-picker/tests",
            "pat/depends/tests",
            "pat/equaliser/tests",
            "pat/focus/tests",
            "pat/image-crop/tests",
            "pat/inject/tests",
            "pat/legend/tests",
            "pat/markdown/tests",
            "pat/masonry/tests",
            "pat/modal/tests",
            "pat/scroll/tests",
            "pat/slides/tests",
            "pat/slideshow-builder/tests",
            "pat/sortable/tests",
            "pat/stacks/tests",
            "pat/switch/tests",
            "pat/tabs/tests",
            "pat/toggle/tests",
            "pat/tooltip/tests",
            "pat/validation/tests",
            "pat/zoom/tests"
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
