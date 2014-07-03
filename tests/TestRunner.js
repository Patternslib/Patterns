require.config({
    paths: {
        "jasmine": "../src/bower_components/jasmine/lib/jasmine-core/jasmine",
        "jasmine-html": "../src/bower_components/jasmine/lib/jasmine-core/jasmine-html",
        "console-runner": "../node_modules/phantom-jasmine/lib/console-runner"
    },
    shim: {
        "jasmine-html": {
            deps: ["jasmine"],
            exports: "jasmine"
        }
    }
});

define("TestRunner", function() {
    require([
        "jquery",
        "jasmine-html"
    ], function($, jasmine) {
        require([
            "console-runner",
            "specs/core/jquery-ext.js",
            "specs/core/utils.js",
            "specs/core/parser.js",
            "specs/core/utils.js",
            "specs/core/url.js",
            "specs/core/store.js",
            "specs/lib/htmlparser.js",
            "specs/lib/depends_parse.js",
            "specs/lib/dependshandler",
            "specs/pat/ajax.js",
            "specs/pat/inject.js",
            "specs/pat/autoscale.js",
            "specs/pat/autosubmit.js",
            "specs/pat/autosuggest.js",
            "specs/pat/bumper.js",
            "specs/pat/carousel.js",
            "specs/pat/checkedflag.js",
            "specs/pat/checklist.js",
            "specs/pat/collapsible.js",
            "specs/pat/depends.js",
            "specs/pat/equaliser.js",
            "specs/pat/focus.js",
            "specs/pat/legend",
            "specs/pat/modal",
            "specs/pat/slideshow-builder",
            "specs/pat/slides.js",
            "specs/pat/stacks.js",
            "specs/pat/switch.js",
            "specs/pat/toggle.js",
            "specs/pat/tooltip",
            "specs/pat/validate.js",
            "specs/pat/zoom.js",
            "specs/pat/image-crop.js",
            "specs/pat/gallery.js",
            "specs/pat/markdown.js"
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
    });
});
require(["TestRunner"]);
