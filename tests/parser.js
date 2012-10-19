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

    describe("_parse", function() {
        it("Positional argument", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            var opts = parser._parse(".MyClass");
            expect(opts.selector).toBe(".MyClass");
        });

        it("Empty first value value", function() {
            var parser=new ArgumentParser();
            parser.add_argument("first");
            parser.add_argument("second");
            var opts = parser._parse("; bar");
            expect(opts.first).toBe(undefined);
            expect(opts.second).toBe("bar");
        });

        it("Named argument", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            parser.add_argument("attr");
            var opts = parser._parse("attr: class");
            expect(opts.selector).toBe(undefined);
            expect(opts.attr).toBe("class");
        });

        it("camelCase parameter names", function() {
            var parser=new ArgumentParser();
            parser.add_argument("time-delay");
            var opts = parser._parse("15");
            expect(opts.timeDelay).toBeDefined();
        });

        it("Extra colons in named argument", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            var opts = parser._parse("selector: nav:first");
            expect(opts.selector).toBe("nav:first");
        });

        it("Ignore extra positional parameters", function() {
            var parser=new ArgumentParser();
            parser.add_argument("foo");
            var opts = parser._parse("bar; buz");
            expect(opts.foo).toBe("bar");
        });

        it("Ignore unknown named parameter", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            var opts = parser._parse("attr: class");
            expect(opts.attr).toBeUndefined();
        });
    });
    
    describe("parse", function() {
        describe("Value bubbling", function() {
            it("Use default from parser", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector", "default");
                var opts = parser.parse($(), "");
                expect(opts.selector).toBe("default");
            });

            it("Value from data attribute", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("selector", "default");
                var opts = parser.parse($('<div data-pat-mypattern="element"/>'));
                expect(opts.selector).toBe("element");
            });

            it("Inherit value from parent data attribute", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("selector", "default");
                var $content = $("<div data-pat-mypattern='parent'><span/></div>").find("span");
                var opts = parser.parse($content);
                expect(opts.selector).toBe("parent");
            });

            it("Prefer value from element data attribute", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("selector", "default");
                var $content = $("<div data-pat-mypattern='parent'><span data-pat-mypattern='el'/></div>").find("span");
                var opts = parser.parse($content);
                expect(opts.selector).toBe("el");
            });

            it("Parameter trumps all", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("selector", "default");
                var opts = parser.parse(
                    $('<div data-pat-mypattern="element"/>'),
                    {selector: "parameter"});
                expect(opts.selector).toBe("parameter");
            });

        });

        describe("Multiple argument handling", function() {
            it("Ignore extra arguments when multiple not requested", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("value");
                var $content = $("<div data-pat-mypattern='one && two'/>");
                var opts = parser.parse($content);
                expect(Array.isArray(opts)).toBe(false);
                expect(opts.value).toBe("one");
            });

            it("Return all arguments when multiple requested", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("value");
                var $content = $("<div data-pat-mypattern='one && two'/>");
                var opts = parser.parse($content, true);
                expect(Array.isArray(opts)).toBe(true);
                expect(opts[0].value).toBe("one");
                expect(opts[1].value).toBe("two");
            });

            it("Provide multiple options to parse()", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("value");
                var opts = parser.parse($(), [{value: "one"}, {value: "two"}], true);
                expect(Array.isArray(opts)).toBe(true);
                expect(opts.length).toBe(2);
                expect(opts[0].value).toBe("one");
                expect(opts[1].value).toBe("two");
            });
        });

        describe("Variable references", function() {
            it("Basic reference", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("value", 15);
                parser.add_argument("other", "$value");
                var opts = parser.parse($());
                expect(opts.other).toBe(15);
            });

            it("Coerce to referenced type", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("value", 15);
                parser.add_argument("other", "$value");
                var $content = $("<div data-pat-mypattern='other: 32'/>");
                var opts = parser.parse($content);
                expect(opts.other).toBe(32);
            });

            it("Do not follow $ in value", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("value", 15);
                parser.add_argument("other");
                var opts = parser.parse($(), {other: "$value"});
                expect(opts.other).toBe("$value");
            });
        });
    });

    describe("_typeof", function() {
        it("null", function() {
            var parser=new ArgumentParser("mypattern");
            expect(parser._typeof(null)).toBe("null");
        });

        it("number", function() {
            var parser=new ArgumentParser("mypattern");
            expect(parser._typeof(15)).toBe("number");
        });

        it("boolean", function() {
            var parser=new ArgumentParser("mypattern");
            expect(parser._typeof(false)).toBe("boolean");
        });
    });

    describe("_set", function() {
        it("Ignore unknown parameter", function() {
            var parser=new ArgumentParser(),
                opts={};
            parser._set(opts, "value", "1");
            expect(opts).toEqual({});
        });

        describe("Enum handling", function() {
            it("Valid value", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", "red",  ["red", "blue", "green"]);
                parser._set(opts, "value", "red");
                expect(opts.value).toBe("red");
            });

            it("Unknown value", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", "red",  ["red", "blue", "green"]);
                parser._set(opts, "value", "pink");
                expect(opts.value).toBe(undefined);
            });

            it("Coercion for enum values", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 5, [1, 3, 5, 10]);
                parser._set(opts, "value", "3");
                expect(opts.value).toBe(3);
            });
        });

        describe("Convert to boolean", function() {
            it("String with non-zero number", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", false);
                parser._set(opts, "value", "1");
                expect(opts.value).toBe(true);
            });

            it("String with uppercase bool", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", false);
                parser._set(opts, "value", "TRUE");
                expect(opts.value).toBe(true);
            });

            it("String with mixed-case yes", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", false);
                parser._set(opts, "value", "YeS");
                expect(opts.value).toBe(true);
            });

            it("String with zero number", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", false);
                parser._set(opts, "value", "0");
                expect(opts.value).toBe(false);
            });

            it("String with mixed-case false", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", false);
                parser._set(opts, "value", "False");
                expect(opts.value).toBe(false);
            });

            it("String with n", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", false);
                parser._set(opts, "value", "n");
                expect(opts.value).toBe(false);
            });

            it("String with unknown value", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", false);
                parser._set(opts, "value", "unknown");
                expect(opts.value).toBe(false);
            });
        });

        describe("Convert to number", function() {
            it("False boolean", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 15);
                parser._set(opts, "value", false);
                expect(opts.value).toBe(0);
            });

            it("True boolean", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 15);
                parser._set(opts, "value", true);
                expect(opts.value).toBe(1);
            });

            it("String with positive number", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 15);
                parser._set(opts, "value", "1");
                expect(opts.value).toBe(1);
            });

            it("String with zero number", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 0);
                parser._set(opts, "value", "0");
                expect(opts.value).toBe(0);
            });

            it("Always use decimal notation for numbers", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 0);
                parser._set(opts, "value", "010");
                expect(opts.value).toBe(10);
            });

            it("String with invalid", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 0);
                parser._set(opts, "value", "ZZ");
                expect(opts.value).toBe(undefined);
            });
        });

        describe("Convert to string", function() {
            it("Boolean", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", "value");
                parser._set(opts, "value", true);
                expect(opts.value).toBe("true");
            });

            it("Number", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", "value");
                parser._set(opts, "value", 15);
                expect(opts.value).toBe("15");
            });
        });

    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

