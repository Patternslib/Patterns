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
                var opts = parser.parse(".MyClass");
                expect(opts.selector).toEqual(".MyClass");
            });

            it("Default value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector", "default");
                var opts = parser.parse("");
                expect(opts.selector).toEqual("default");
            });

            it("Use default for empty value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("first", "default");
                parser.add_argument("second");
                var opts = parser.parse("; bar");
                expect(opts.first).toEqual("default");
                expect(opts.second).toEqual("bar");
            });

            it("Named argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                parser.add_argument("attr");
                var opts = parser.parse("attr: class");
                expect(opts.attr).toEqual("class");
            });

            it("Extra colons in named argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                var opts = parser.parse("selector: nav:first");
                expect(opts.selector).toEqual("nav:first");
            });

            // XXX: test for warn message
            it("Ignore extra positional parameters", function() {
                var parser=new ArgumentParser();
                parser.add_argument("foo");
                var opts = parser.parse("bar; buz");
                expect(opts.foo).toEqual("bar");
            });

            // XXX: test for warn message
            it("Ignore unknown named parameter", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                var opts = parser.parse("attr: class");
                expect(opts.attr).not.toBeDefined();
            });
        });

        describe("parse - params via init", function() {
            it("Positional argument", function() {
                var parser=new ArgumentParser("selector");
                var opts = parser.parse(".MyClass");
                expect(opts.selector).toEqual(".MyClass");
            });

            it("Default value", function() {
                var parser=new ArgumentParser("selector: default");
                var opts = parser.parse("");
                expect(opts.selector).toEqual("default");
            });

            it("Use default for empty value", function() {
                var parser=new ArgumentParser("first: default; second");
                var opts = parser.parse("; bar");
                expect(opts.first).toEqual("default");
                expect(opts.second).toEqual("bar");
            });

            it("Named argument", function() {
                var parser=new ArgumentParser("selector; attr");
                var opts = parser.parse("attr: class");
                expect(opts.attr).toEqual("class");
            });

            // XXX: test for warn message
            it("Ignore extra positional parameters", function() {
                var parser=new ArgumentParser("foo");
                var opts = parser.parse("bar; buz");
                expect(opts.foo).toEqual("bar");
            });

            // XXX: test for warn message
            it("Ignore unknown named parameter", function() {
                var parser=new ArgumentParser("selector");
                var opts = parser.parse("attr: class");
                expect(opts.attr).not.toBeDefined();
            });
        });
    });
});