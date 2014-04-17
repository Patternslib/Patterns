
define("TestRunner", function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);

    var consoleReporter = new jasmine.ConsoleReporter();
    window.console_reporter = consoleReporter;
    jasmineEnv.addReporter(consoleReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    require([
        "specs/core/jquery-ext.js",
        "specs/core/parser.js",
        "specs/core/store.js",
        "specs/core/url.js",
        "specs/core/utils.js",
        "specs/core/utils.js",
        "specs/lib/depends_parse.js",
        "specs/lib/dependshandler",
        "specs/lib/htmlparser.js",
        "specs/pat/ajax.js",
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
        "specs/pat/gallery.js",
        "specs/pat/image-crop.js",
        "specs/pat/inject.js",
        "specs/pat/legend",
        "specs/pat/markdown.js",
        "specs/pat/modal",
        "specs/pat/slides.js",
        "specs/pat/slideshow-builder",
        "specs/pat/stacks.js",
        "specs/pat/switch.js",
        "specs/pat/toggle.js",
        "specs/pat/validate.js",
        "specs/pat/zoom.js"
    ], function() {
        jasmineEnv.execute();
    });
});

require(["TestRunner"]);

