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

            it("Default value for second", function() {
                var parser=new ArgumentParser("first; selector: default");
                var opts = parser.parse("abc");
                expect(opts.first).toEqual("abc");
                expect(opts.selector).toEqual("default");
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

        describe("parse - multiple with &&", function() {
            it("Positional argument", function() {
                var parser=new ArgumentParser("selector");
                var opts = parser.parse(".MyClass && .MyOther");
                expect(opts[0].selector).toEqual(".MyClass");
                expect(opts[1].selector).toEqual(".MyOther");
            });

            it("Default value", function() {
                var parser=new ArgumentParser("selector: default");
                var opts = parser.parse("&&");
                expect(opts[0].selector).toEqual("default");
                expect(opts[1].selector).toEqual("default");
            });

            it("Use default for empty value", function() {
                var parser=new ArgumentParser("first: default; second");
                var opts = parser.parse("; bar && ;baz");
                expect(opts[0].first).toEqual("default");
                expect(opts[0].second).toEqual("bar");
                expect(opts[1].first).toEqual("default");
                expect(opts[1].second).toEqual("baz");
            });

            it("Named argument", function() {
                var parser=new ArgumentParser("selector; attr");
                var opts = parser.parse("attr: class && ;foo");
                expect(opts[0].attr).toEqual("class");
                expect(opts[1].attr).toEqual("foo");
            });

            it("Parse time default", function() {
                var parser=new ArgumentParser("selector; attr");
                var opts = parser.parse("attr: class && ;foo", {"selector": "bar"});
                expect(opts[0].attr).toEqual("class");
                expect(opts[0].selector).toEqual("bar");
                expect(opts[1].attr).toEqual("foo");
                expect(opts[1].selector).toEqual("bar");
            });
        });
    });
});