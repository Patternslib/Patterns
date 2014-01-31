
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

    // "../tests/specs/pat/carousel.js","../tests/specs/pat/checkedflag.js","../tests/specs/pat/checklist.js","../tests/specs/pat/collapsible.js","../tests/specs/pat/depends.js","../tests/specs/pat/equaliser.js","../tests/specs/pat/focus.js","../tests/specs/pat/gallery.js","../tests/specs/pat/image-crop.js","../tests/specs/pat/inject.js","../tests/specs/pat/legend.js","../tests/specs/pat/markdown.js","../tests/specs/pat/modal.js","../tests/specs/pat/slideshow-builder.js","../tests/specs/pat/stacks.js","../tests/specs/pat/switch.js","../tests/specs/pat/toggle.js","../tests/specs/pat/validate.js","../tests/specs/pat/zoom.js"]

    require([
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
        "specs/pat/carousel.js"
        // "../tests/specs/pat/markdown.js",
        // "../tests/specs/pat/slides.js"
    ], function() {
        jasmineEnv.execute();
    });
});

require(["TestRunner"]);

