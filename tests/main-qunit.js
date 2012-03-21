require([
    'require',
    'domReady',
    '../lib/qunit'
    // '../src/lib/dist/underscore',
    // '../src/lib/order!../src/lib/jquery',
    // '../src/lib/order!../lib/jasmine/lib/jasmine-core/jasmine',
    // '../src/lib/order!../lib/jasmine/lib/jasmine-core/jasmine-html',
    // '../src/lib/order!../lib/jasmine-jquery/lib/jasmine-jquery',
    // '../src/patterns',
    // '../src/utils',
    // './spec/collapsible',
    // './spec/edit',
    // './spec/inject',
    // './spec/modal',
    // './spec/parser'
], function(require) {
    // wait for the dom to be ready
    require('domReady');

    test("a basic test example", function() {
        ok( true, "this test is fine" );
        var value = "hello";
        equal( value, "hello", "We expect value to be hello" );
    });

    module("Module A");

    test("first test within module", function() {
        ok( true, "all pass" );
    });

    test("second test within module", function() {
        ok( true, "all pass" );
    });

    module("Module B");

    test("some other test", function() {
        expect(2);
        equal( true, false, "failing test" );
        equal( true, true, "passing test" );
    });

});
