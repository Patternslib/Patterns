require([
    'require',
    '../src/lib/order!../lib/jasmine/lib/jasmine-core/jasmine',
    '../src/lib/order!../lib/jasmine/lib/jasmine-core/jasmine-html',
    '../src/lib/order!./spec/parser'
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
