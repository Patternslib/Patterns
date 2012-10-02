describe("trim", function() {
    it("No whitespace", function() {
        expect("foo".trim()).toBe("foo");
    });

    it("Leading whitespace", function() {
        expect("  foo".trim()).toBe("foo");
    });

    it("Trailing whitespace", function() {
        expect("foo  ".trim()).toBe("foo");
    });

    it("Whitespace everywhere", function() {
        expect("  f o o  ".trim()).toBe("f o o");
    });
});


describe("Core / Parser", function() {
    var ArgumentParser;

    requireDependencies(["core/parser"], function(cls) {
        ArgumentParser = cls;
    });

    describe("parse", function() {
        it("Empty paramter", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            var opts = parser.parse(undefined, {"default": true});
            expect(opts["default"]).toBe(true);
        });

        it("Positional argument", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            var opts = parser.parse(".MyClass");
            expect(opts.selector).toBe(".MyClass");
        });

        it("Default value", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector", "default");
            var opts = parser.parse("");
            expect(opts.selector).toBe("default");
        });

        it("Use default for empty value", function() {
            var parser=new ArgumentParser();
            parser.add_argument("first", "default");
            parser.add_argument("second");
            var opts = parser.parse("; bar");
            expect(opts.first).toBe("default");
            expect(opts.second).toBe("bar");
        });

        it("Named argument", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            parser.add_argument("attr");
            var opts = parser.parse("attr: class");
            expect(opts.attr).toBe("class");
        });

        it("Numeric value only", function() {
            // This is likely to happen since $().data("name") will return a
            // number of a digits-only value was used. Simple test case:
            // typeof $("<div/>", {"data-xyz": "500"}).data("xyz") === "number"
            var parser=new ArgumentParser();
            parser.add_argument("delay");
            var opts = parser.parse(500);
            expect(opts.delay).toBe("500");
        });

        it("Extra colons in named argument", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            var opts = parser.parse("selector: nav:first");
            expect(opts.selector).toBe("nav:first");
        });

        // XXX: test for warn message
        it("Ignore extra positional parameters", function() {
            var parser=new ArgumentParser();
            parser.add_argument("foo");
            var opts = parser.parse("bar; buz");
            expect(opts.foo).toBe("bar");
        });

        // XXX: test for warn message
        it("Ignore unknown named parameter", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            var opts = parser.parse("attr: class");
            expect(opts.attr).toBeUndefined();
        });
    });

    describe("parse - params via init", function() {
        it("Positional argument", function() {
            var parser=new ArgumentParser("selector");
            var opts = parser.parse(".MyClass");
            expect(opts.selector).toBe(".MyClass");
        });

        it("Default value", function() {
            var parser=new ArgumentParser("selector: default");
            var opts = parser.parse("");
            expect(opts.selector).toBe("default");
        });

        it("Use default for empty value", function() {
            var parser=new ArgumentParser("first: default; second");
            var opts = parser.parse("; bar");
            expect(opts.first).toBe("default");
            expect(opts.second).toBe("bar");
        });

        it("Default value for second", function() {
            var parser=new ArgumentParser("first; selector: default");
            var opts = parser.parse("abc");
            expect(opts.first).toBe("abc");
            expect(opts.selector).toBe("default");
        });

        it("Named argument", function() {
            var parser=new ArgumentParser("selector; attr");
            var opts = parser.parse("attr: class");
            expect(opts.attr).toBe("class");
        });

        // XXX: test for warn message
        it("Ignore extra positional parameters", function() {
            var parser=new ArgumentParser("foo");
            var opts = parser.parse("bar; buz");
            expect(opts.foo).toBe("bar");
        });

        // XXX: test for warn message
        it("Ignore unknown named parameter", function() {
            var parser=new ArgumentParser("selector");
            var opts = parser.parse("attr: class");
            expect(opts.attr).toBeUndefined();
        });

        it("Reference other param for default value", function() {
            var parser=new ArgumentParser("p1; p2: $p1");
            var opts = parser.parse("foo");
            expect(opts.p1).toBe("foo");
            expect(opts.p2).toBe("foo");
        });
    });

    describe("parse - multiple with &&", function() {
        it("Positional argument", function() {
            var parser=new ArgumentParser("selector");
            var opts = parser.parse(".MyClass && .MyOther");
            expect(opts[0].selector).toBe(".MyClass");
            expect(opts[1].selector).toBe(".MyOther");
        });

        it("Default value", function() {
            var parser=new ArgumentParser("selector: default");
            var opts = parser.parse("&&");
            expect(opts[0].selector).toBe("default");
            expect(opts[1].selector).toBe("default");
        });

        it("Use default for empty value", function() {
            var parser=new ArgumentParser("first: default; second");
            var opts = parser.parse("; bar && ;baz");
            expect(opts[0].first).toBe("default");
            expect(opts[0].second).toBe("bar");
            expect(opts[1].first).toBe("default");
            expect(opts[1].second).toBe("baz");
        });

        it("Named argument", function() {
            var parser=new ArgumentParser("selector; attr");
            var opts = parser.parse("attr: class && ;foo");
            expect(opts[0].attr).toBe("class");
            expect(opts[1].attr).toBe("foo");
        });

        it("Parse time default", function() {
            var parser=new ArgumentParser("selector; attr");
            var opts = parser.parse("attr: class && ;foo", {"selector": "bar"});
            expect(opts[0].attr).toBe("class");
            expect(opts[0].selector).toBe("bar");
            expect(opts[1].attr).toBe("foo");
            expect(opts[1].selector).toBe("bar");
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

