require.config({
    // define module dependencies for modules not using define
    shim: {
        '../lib/pavlov/pavlov': {
            // XXX: not sure why not: ../lib/qunit/qunit/qunit
            deps: ['../qunit/qunit/qunit']
        }
    }
});
require([
    'require',
    '../lib/pavlov',
    '../src/main',
    '../src/registry',
//    'spec!./spec/aloha',
//    'spec!./spec/edit',
    'spec!./spec/inject',
    'spec!./spec/modal',
    'spec!./spec/parser'
], function(require) {
    var registry = require('../src/registry'),
        spec_names = [
//            'aloha',
//            'edit',
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
        var modules = names.reduce(function(acc, name) {
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
                            registry.scan($$());
                        });
                    }
                    spec($$);
                })(name);
            });
        };
    });
});
