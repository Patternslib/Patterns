require([
    'require',
    '../src/lib/order!../lib/jasmine/lib/jasmine-core/jasmine',
    '../src/lib/order!../lib/jasmine/lib/jasmine-core/jasmine-html',
    '../src/lib/order!../src/lib/jquery',
    '../src/lib/order!../lib/jasmine-jquery/lib/jasmine-jquery',
    '../src/lib/order!./jasmine-settings',
    // XXX: the order matters for some reason
    '../src/lib/order!./spec/inject',
    '../src/lib/order!./spec/parser',
    '../src/lib/order!./spec/collapsible'
], function(require) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var reporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(reporter);

    jasmineEnv.specFilter = function(spec) {
        return reporter.specFilter(spec);
    };

    var currentWindowOnload = window.onload;

    window.onload = function() {
        if (currentWindowOnload) {
            currentWindowOnload();
        }
        execJasmine();
    };

    function execJasmine() {
        jasmineEnv.execute();
    }
});
