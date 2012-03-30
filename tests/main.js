require([
    'require',
    'domReady',
    '../src/lib/jquery',
    '../lib/pavlov',
    '../lib/qunit',
    '../src/lib/dist/underscore',
    '../src/patterns',
    'spec!./spec/aloha',
    'spec!./spec/collapsible',
    'spec!./spec/inject',
    'spec!./spec/modal',
    'spec!./spec/parser'
], function(require) {
    var patterns = require('../src/patterns'),
        qunit = require('../lib/qunit'),
        spec_names = [
            'aloha',
            'collapsible',
            'inject',
            'modal',
            'parser'
        ];

    // a jquery local to the fixtures container will be passed to the specs
    var $$ = function(selector) {
        var $fix = $('#qunit-fixture');
        return selector ? $fix.find(selector) : $fix;
    };

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

    pavlov.specify("Patterns", function() {
        for (var name in specs) {
            var spec = specs[name];
            describe(name, function() {
                (function(name) {
                    if (!spec.nofixture) {
                        before(function() {
                            $.ajax({
                                async: false,
                                url: name + '.html',
                                error: function(xhr, text, error) {
                                    console.error(xhr, text, error);
                                },
                                success: function(data, text, xhr) {
                                    $('#qunit-fixture').html(data);
                                }
                            });
                            patterns.scan($$());
                        });
                    }
                    spec($$);
                })(name);
            });
        };
    });
});
