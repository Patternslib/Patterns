define([
    'require',
    '../../src/core/parser'
], function(require) {
    var ArgumentParser = require('../../src/core/parser');

    var spec = function() {
        describe("trim", function() {
            it("No whitespace", function() {
                assert("foo".trim()).equals("foo");
            });

            it("Leading whitespace", function() {
                assert("  foo".trim()).equals("foo");
            });

            it("Trailing whitespace", function() {
                assert("foo  ".trim()).equals("foo");
            });

            it("Whitespace everywhere", function() {
                assert("  f o o  ".trim()).equals("f o o");
            });
        });


        describe("parse", function() {
            it("Empty paramter", functino() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                var opts = parser.parse(undefined, {default: true});
                assert(opts.default).equals(true);
            });

            it("Positional argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                var opts = parser.parse(".MyClass");
                assert(opts.selector).equals(".MyClass");
            });

            it("Default value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector", "default");
                var opts = parser.parse("");
                assert(opts.selector).equals("default");
            });

            it("Use default for empty value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("first", "default");
                parser.add_argument("second");
                var opts = parser.parse("; bar");
                assert(opts.first).equals("default");
                assert(opts.second).equals("bar");
            });

            it("Named argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                parser.add_argument("attr");
                var opts = parser.parse("attr: class");
                assert(opts.attr).equals("class");
            });

            it("Extra colons in named argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                var opts = parser.parse("selector: nav:first");
                assert(opts.selector).equals("nav:first");
            });

            // XXX: test for warn message
            it("Ignore extra positional parameters", function() {
                var parser=new ArgumentParser();
                parser.add_argument("foo");
                var opts = parser.parse("bar; buz");
                assert(opts.foo).equals("bar");
            });

            // XXX: test for warn message
            it("Ignore unknown named parameter", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                var opts = parser.parse("attr: class");
                assert(opts.attr).isUndefined();
            });
        });

        describe("parse - params via init", function() {
            it("Positional argument", function() {
                var parser=new ArgumentParser("selector");
                var opts = parser.parse(".MyClass");
                assert(opts.selector).equals(".MyClass");
            });

            it("Default value", function() {
                var parser=new ArgumentParser("selector: default");
                var opts = parser.parse("");
                assert(opts.selector).equals("default");
            });

            it("Use default for empty value", function() {
                var parser=new ArgumentParser("first: default; second");
                var opts = parser.parse("; bar");
                assert(opts.first).equals("default");
                assert(opts.second).equals("bar");
            });

            it("Default value for second", function() {
                var parser=new ArgumentParser("first; selector: default");
                var opts = parser.parse("abc");
                assert(opts.first).equals("abc");
                assert(opts.selector).equals("default");
            });

            it("Named argument", function() {
                var parser=new ArgumentParser("selector; attr");
                var opts = parser.parse("attr: class");
                assert(opts.attr).equals("class");
            });

            // XXX: test for warn message
            it("Ignore extra positional parameters", function() {
                var parser=new ArgumentParser("foo");
                var opts = parser.parse("bar; buz");
                assert(opts.foo).equals("bar");
            });

            // XXX: test for warn message
            it("Ignore unknown named parameter", function() {
                var parser=new ArgumentParser("selector");
                var opts = parser.parse("attr: class");
                assert(opts.attr).isUndefined();
            });

            it("Reference other param for default value", function() {
                var parser=new ArgumentParser("p1; p2: $p1");
                var opts = parser.parse("foo");
                assert(opts.p1).equals("foo");
                assert(opts.p2).equals("foo");
            });
        });

        describe("parse - multiple with &&", function() {
            it("Positional argument", function() {
                var parser=new ArgumentParser("selector");
                var opts = parser.parse(".MyClass && .MyOther");
                assert(opts[0].selector).equals(".MyClass");
                assert(opts[1].selector).equals(".MyOther");
            });

            it("Default value", function() {
                var parser=new ArgumentParser("selector: default");
                var opts = parser.parse("&&");
                assert(opts[0].selector).equals("default");
                assert(opts[1].selector).equals("default");
            });

            it("Use default for empty value", function() {
                var parser=new ArgumentParser("first: default; second");
                var opts = parser.parse("; bar && ;baz");
                assert(opts[0].first).equals("default");
                assert(opts[0].second).equals("bar");
                assert(opts[1].first).equals("default");
                assert(opts[1].second).equals("baz");
            });

            it("Named argument", function() {
                var parser=new ArgumentParser("selector; attr");
                var opts = parser.parse("attr: class && ;foo");
                assert(opts[0].attr).equals("class");
                assert(opts[1].attr).equals("foo");
            });

            it("Parse time default", function() {
                var parser=new ArgumentParser("selector; attr");
                var opts = parser.parse("attr: class && ;foo", {"selector": "bar"});
                assert(opts[0].attr).equals("class");
                assert(opts[0].selector).equals("bar");
                assert(opts[1].attr).equals("foo");
                assert(opts[1].selector).equals("bar");
            });
        });
    };
    spec.nofixture = true;
    return spec;
});
