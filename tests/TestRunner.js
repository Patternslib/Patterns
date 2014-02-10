
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

    // "specs/pat/image-crop.js","../tests/specs/pat/markdown.js",
    // "../tests/specs/pat/validate.js","../tests/specs/pat/zoom.js"]
    require([
        "./specs/core/jquery-ext.js",
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
        "specs/pat/validate.js",
        "specs/pat/zoom.js"
        // "specs/pat/gallery.js"
        // "specs/pat/markdown.js",
    ], function() {
        jasmineEnv.execute();
    });
});

require(["TestRunner"]);

