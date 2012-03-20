require([
    'require',
    '../src/lib/dist/underscore',
    '../src/lib/order!../src/lib/jquery',
    '../src/lib/order!../lib/jasmine/lib/jasmine-core/jasmine',
    '../src/lib/order!../lib/jasmine/lib/jasmine-core/jasmine-html',
    '../src/lib/order!../lib/jasmine-jquery/lib/jasmine-jquery',
    // '../src/lib/order!./spec/inject',
    // '../src/lib/order!./spec/parser',
    '../src/patterns',
    '../src/utils',
    './spec/collapsible',
    './spec/modal'
], function(require) {
    var patterns = require('../src/patterns'),
        spec_names = [
            'collapsible',
            'modal'
        ];

    // jasmine settings
    jasmine.getFixtures().fixturesPath = './';

    var load_modules = function(prefix, names, suffix) {
        prefix = prefix || '';
        suffix = suffix || '';
        var modules = _.reduce(names, function(acc, name) {
            acc[name] = require(prefix + name + suffix);
            return acc;
        }, {});
        return modules;
    };

    var specs = load_modules('./spec/', spec_names);

    // a jquery local to the fixtures container will be passed to the specs
    var $$ = function(selector) {
        selector = selector || '';
        return $('#jasmine-fixtures ' + selector);
    };
    for (var name in specs) {
        var spec = specs[name];
        describe(name, function() {
            (function(name) {
                beforeEach(function() {
                    loadFixtures(name + '.html');
                    patterns.scan($$());
                });
                spec.describe($$);
            })(name);
        });
    };


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
