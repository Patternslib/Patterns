define([
    'require',
    '../../src/core/parser'
], function(require) {
    var ArgumentParser = require('../../src/core/parser');

    describe("ArgumentParser", function() {
        describe("trim", function() {
            it("No whitespace", function() {
                expect("foo".trim()).toEqual("foo");
            });

            it("Leading whitespace", function() {
                expect("  foo".trim()).toEqual("foo");
            });

            it("Trailing whitespace", function() {
                expect("foo  ".trim()).toEqual("foo");
            });

            it("Whitespace everywhere", function() {
                expect("  f o o  ".trim()).toEqual("f o o");
            });
        });


        describe("parse", function() {
            it("Positional argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                parser.parse(".MyClass");
                expect(parser.options.selector).toEqual(".MyClass");
            });

            it("Default value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector", "default");
                parser.parse("");
                expect(parser.options.selector).toEqual("default");
            });

            it("Use default for empty value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("first", "default");
                parser.add_argument("second");
                parser.parse("; bar");
                expect(parser.options.first).toEqual("default");
                expect(parser.options.second).toEqual("bar");
            });

            it("Named argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                parser.add_argument("attr");
                parser.parse("attr: class");
                expect(parser.options.attr).toEqual("class");
            });

            it("Extra colons in named argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                parser.parse("selector: nav:first");
                expect(parser.options.selector).toEqual("nav:first");
            });

            it("Ignore extra positional parameters", function() {
                var parser=new ArgumentParser();
                parser.add_argument("foo");
                parser.parse("bar; buz");
                expect(parser.options.foo).toEqual("bar");
            });

            it("Ignore unknown named parameter", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                parser.parse("attr: class");
                expect(parser.options.attr).not.toBeDefined();
            });
        });
    });
});