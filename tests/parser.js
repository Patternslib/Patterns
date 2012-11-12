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

    describe("add_argument", function() {
        it("Create new group", function() {
            var parser = new ArgumentParser();
            parser.add_argument("dummy-field", "default");
            expect("dummy" in parser.groups).toBeTruthy();
        });

        it("Add argument to sub-parser", function() {
            var parser = new ArgumentParser();
            parser.add_argument("dummy-field", "default", ["yes", "no"], false);
            expect(parser.groups.dummy.order).toEqual(["field"]);
            var spec = parser.groups.dummy.parameters.field;
            expect(spec.value).toBe("default");
            expect(spec.choices).toEqual(["yes", "no"]);
            expect(spec.multiple).toBe(false);
        });

        it("Preserve argument order", function() {
            var parser = new ArgumentParser();
            parser.add_argument("dummy-one");
            parser.add_argument("dummy-two");
            expect(parser.groups.dummy.order).toEqual(["one", "two"]);
        });
    });

    describe("_parse", function() {
        describe("Shorthand notation", function() {
            it("Single argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                var opts = parser._parse(".MyClass");
                expect(opts.selector).toBe(".MyClass");
            });

            it("Ignore extra positional parameters", function() {
                var parser=new ArgumentParser();
                parser.add_argument("foo");
                var opts = parser._parse("bar buz");
                expect(opts.foo).toBe("bar");
            });

            it("String value with name of string argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("foo");
                var opts = parser._parse("foo");
                expect(opts.foo).toBe("foo");
            });

            it("Positive boolean value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("foo", true);
                var opts = parser._parse("foo");
                expect(opts.foo).toBe(true);
            });

            it("Negative boolean value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("foo", true);
                var opts = parser._parse("no-foo");
                expect(opts.foo).toBe(false);
            });

            it("Multiple boolean values", function() {
                var parser=new ArgumentParser();
                parser.add_argument("foo", false);
                parser.add_argument("bar", true);
                var opts = parser._parse("no-bar foo");
                expect(opts.foo).toBe(true);
                expect(opts.bar).toBe(false);
            });

            it("Enum value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("flavour", "cheese", ["cheese", "bacon"]);
                var opts = parser._parse("bacon");
                expect(opts.flavour).toBe("bacon");
            });

            it("Mix it all up", function() {
                var parser=new ArgumentParser();
                parser.add_argument("delay");
                parser.add_argument("sticky", false);
                parser.add_argument("flavour", "cheese", ["cheese", "bacon"]);
                var opts = parser._parse("15 bacon sticky");
                expect(opts.delay).toBe("15");
                expect(opts.sticky).toBe(true);
                expect(opts.flavour).toBe("bacon");
            });
        });

        describe("Extended notation" , function() {
            it("Named argument", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                parser.add_argument("attr");
                var opts = parser._parse("attr: class");
                expect(opts.selector).toBe(undefined);
                expect(opts.attr).toBe("class");
            });

            it("Colons in value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                var opts = parser._parse("selector: nav:first");
                expect(opts.selector).toBe("nav:first");
            });

            it("Ignore unknown named parameter", function() {
                var parser=new ArgumentParser();
                parser.add_argument("selector");
                var opts = parser._parse("attr: class");
                expect(opts.attr).toBeUndefined();
            });

            it("Grouped options", function() {
                var parser=new ArgumentParser();
                parser.add_argument("group-foo", false);
                parser.add_argument("group-bar", true);
                var opts = parser._parse("group: foo no-bar");
                expect(opts).toEqual({"group-foo": true, "group-bar": false});
            });
        });

        describe("Mixed notation", function() {
            it("Basic usage", function() {
                var parser=new ArgumentParser();
                parser.add_argument("foo");
                parser.add_argument("bar");
                parser.add_argument("buz");
                parser.add_argument("boo");
                var opts = parser._parse("foo bar; boo: blue");
                expect(opts.foo).toBe("foo");
                expect(opts.bar).toBe("bar");
                expect(opts.buzz).toBe(undefined);
                expect(opts.boo).toBe("blue");
            });
        });
    });
    
    describe("_defaults", function() {
        it("No default value provided", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector");
            var defaults = parser._defaults($());
            expect(defaults.selector).toBeNull();
        });

        it("Default value provided", function() {
            var parser=new ArgumentParser();
            parser.add_argument("selector", "default");
            var defaults = parser._defaults($());
            expect(defaults.selector).toBe("default");
        });

        it("Default value from function", function() {
            var parser=new ArgumentParser(),
                func=jasmine.createSpy("func").andReturn("default");
            parser.add_argument("selector", func);
            var defaults = parser._defaults("element");
            expect(defaults.selector).toBe("default");
            expect(func).toHaveBeenCalledWith("element", "selector");
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

            it("Include extra options", function() {
                var parser=new ArgumentParser();
                var opts = parser.parse($(), {foo: "bar"});
                expect(opts).toEqual({foo: "bar"});
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

        it("Resolve variable references", function() {
            var parser=new ArgumentParser("mypattern");
            parser.add_argument("value", 15);
            parser.add_argument("other", "$value");
            var opts = parser.parse($());
            expect(opts.other).toBe(15);
        });

        it("Grouped options", function() {
            var parser=new ArgumentParser("mypattern"),
                $content = $("<div data-pat-mypattern='group: y n'/>");
            parser.add_argument("group-foo", false);
            parser.add_argument("group-bar", true);
            var opts = parser.parse($content);
            expect(opts).toEqual({group: {foo: true, bar: false}});
        });


        it("Coerce to type from default function", function() {
            var parser=new ArgumentParser("mypattern"),
                func=jasmine.createSpy("func").andReturn(15),
                $content = $("<div data-pat-mypattern='value: 32'/>");
            parser.add_argument("value", func);
            var defaults = parser.parse($content);
            expect(defaults.value).toBe(32);
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

    describe("_coerce", function() {
        describe("Enum handling", function() {
            it("Valid value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", "red",  ["red", "blue", "green"]);
                expect(parser._coerce("value", "red")).toBe("red");
            });

            it("Unknown value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", "red",  ["red", "blue", "green"]);
                expect(parser._coerce("value", "pink")).toBe(null);
            });

            it("Coercion for enum values", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", 5, [1, 3, 5, 10]);
                expect(parser._coerce("value", "3")).toBe(3);
            });
        });

        describe("Convert to boolean", function() {
            it("String with non-zero number", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", false);
                expect(parser._coerce("value", "1")).toBe(true);
            });

            it("String with uppercase bool", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", false);
                expect(parser._coerce("value", "TRUE")).toBe(true);
            });

            it("String with mixed-case yes", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", false);
                expect(parser._coerce("value", "YeS")).toBe(true);
            });

            it("String with zero number", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", false);
                expect(parser._coerce("value", "0")).toBe(false);
            });

            it("String with mixed-case false", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", false);
                expect(parser._coerce("value", "False")).toBe(false);
            });

            it("String with n", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", false);
                expect(parser._coerce("value", "n")).toBe(false);
            });

            it("String with unknown value", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", false);
                expect(parser._coerce("value", "unknown")).toBe(false);
            });
        });

        describe("Convert to number", function() {
            it("False boolean", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", 15);
                expect(parser._coerce("value", false)).toBe(0);
            });

            it("True boolean", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", 15);
                expect(parser._coerce("value", true)).toBe(1);
            });

            it("String with positive number", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", 15);
                expect(parser._coerce("value", "1")).toBe(1);
            });

            it("String with zero number", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", 0);
                expect(parser._coerce("value", "0")).toBe(0);
            });

            it("Always use decimal notation for numbers", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", 0);
                expect(parser._coerce("value", "010")).toBe(10);
            });

            it("String with invalid", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", 0);
                expect(parser._coerce("value", "ZZ")).toBe(null);
            });
        });

        describe("Convert to string", function() {
            it("Boolean", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", "value");
                expect(parser._coerce("value", true)).toBe("true");
            });

            it("Number", function() {
                var parser=new ArgumentParser();
                parser.add_argument("value", "value");
                expect(parser._coerce("value", 15)).toBe("15");
            });
        });

    });

    describe("_set", function() {
        it("Ignore unknown parameter", function() {
            var parser=new ArgumentParser(),
                opts={};
            parser._set(opts, "value", "1");
            expect(opts).toEqual({});
        });

        describe("Singular parameters", function() {
            it("Do type coercion", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 1);
                spyOn(parser, "_coerce").andReturn("coerced!");
                parser._set(opts, "value", "1");
                expect(parser._coerce).toHaveBeenCalledWith("value", "1");
                expect(opts.value).toBe("coerced!");
            });

            it("Abort if coercion fails", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 1);
                spyOn(parser, "_coerce").andReturn(null);
                parser._set(opts, "value", "1");
                expect(opts.value).toBe(undefined);
            });
        });

        describe("Multiple parameters", function() {
            it("Split on comma", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", [], null, true);
                parser._set(opts, "value", "foo,bar,buz");
                expect(opts.value).toEqual(["foo", "bar", "buz"]);
            });

            it("Do type coercion", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", [1], null, true);
                spyOn(parser, "_coerce").andReturn("coerced!");
                parser._set(opts, "value", "1");
                expect(parser._coerce).toHaveBeenCalledWith("value", "1");
                expect(opts.value).toEqual(["coerced!"]);
            });

            it("Ignored values that can not be coerced", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.add_argument("value", 1);
                spyOn(parser, "_coerce").andReturn(null);
                parser._set(opts, "value", "1");
                expect(opts.value).toBe(undefined);
            });
        });
    });

    describe("_cleanupOptions", function() {
        describe("Variable references", function() {
            it("Basic reference", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("value", 15);
                parser.add_argument("other", "$value");
                var opts = {value: 20, other: "$value"};
                parser._cleanupOptions(opts);
                expect(opts.other).toBe(20);
            });

            it("Do not follow $ in value", function() {
                var parser=new ArgumentParser("mypattern");
                parser.add_argument("value", 15);
                parser.add_argument("other");
                var opts = {value: 20, other: "$value"};
                parser._cleanupOptions(opts);
                expect(opts.other).toBe("$value");
            });
        });

        describe("Option grouping", function() {
            it("Create new group", function() {
                var parser=new ArgumentParser();
                parser.add_argument("group-foo");
                var opts = {"group-foo": 15};
                parser._cleanupOptions(opts);
                expect(opts).toEqual({group: {foo: 15}});
            });

            it("Multiple values in group", function() {
                var parser=new ArgumentParser();
                parser.add_argument("group-foo");
                parser.add_argument("group-bar");
                var opts = {"group-foo": 15, "group-bar": 20};
                parser._cleanupOptions(opts);
                expect(opts).toEqual({group: {foo: 15, bar:20}});
            });

            it("Extend existing group", function() {
                var parser=new ArgumentParser();
                parser.add_argument("group-foo");
                var opts = {"group-foo": 15, group: {bar: 20}};
                parser._cleanupOptions(opts);
                expect(opts).toEqual({group: {foo: 15, bar:20}});
            });
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab

