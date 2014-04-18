require.config({
    paths: {
        "jasmine": "../src/bower_components/jasmine/lib/jasmine-core/jasmine",
        "jasmine-html": "../src/bower_components/jasmine/lib/jasmine-core/jasmine-html",
        "jasmine-console-reporter": "../node_modules/jasmine-reporters/src/jasmine.console_reporter",
        "jasmine-junit-reporter": "../node_modules/jasmine-reporters/src/jasmine.junit_reporter"
    },
    shim: {
        // Extra test dependencies
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        'jasmine-console-reporter': {
            deps: ['jasmine-html'],
            exports: 'jasmine'
        },
        'jasmine-junit-reporter': {
            deps: ['jasmine-html'],
            exports: 'jasmine'
        }
    }
});

define("TestRunner", function() {

    require([
        "jquery",
        "jasmine-html"
    ], function($, jasmine) {

            require([
                "jasmine-console-reporter",
                "jasmine-junit-reporter",
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
                var consoleReporter = new jasmine.ConsoleReporter();
                window.console_reporter = consoleReporter;
                jasmineEnv.addReporter(consoleReporter);

                if (/PhantomJS/.test(navigator.userAgent)) {
                    jasmineEnv.addReporter(new jasmine.JUnitXmlReporter('./test-reports/'));
                    jasmineEnv.updateInterval = 0;
                } else {
                    var htmlReporter = new jasmine.HtmlReporter();
                    jasmineEnv.addReporter(htmlReporter);
                    jasmineEnv.specFilter = function(spec) {
                        return htmlReporter.specFilter(spec);
                    };
                    jasmineEnv.updateInterval = 100;
                }
                jasmineEnv.execute();
            });
        });
});
require(["TestRunner"]);
