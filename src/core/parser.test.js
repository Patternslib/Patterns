import _ from "underscore";
import $ from "jquery";
import ArgumentParser from "./parser";

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


describe("The Patterns parser", function() {
    describe("When adding an argument", function() {

        it("is possible to add a default value", function() {
            var parser = new ArgumentParser();
            parser.addArgument("color", "red");
            expect(parser.parameters.color.value).toBe("red");

            parser.addJSONArgument("color", {"color": "red"});
            expect(_.isEqual(parser.parameters.color.value, {"color":"red"})).toBeTruthy();
        });

        it("preserves the argument order", function() {
            var parser = new ArgumentParser();
            parser.addArgument("dummy-one");
            parser.addArgument("dummy-two");
            expect(parser.groups.dummy.order).toEqual(["one", "two"]);

            parser.addJSONArgument("json-one");
            parser.addJSONArgument("json-two");
            expect(parser.groups.json.order).toEqual(["one", "two"]);
        });

        it("won't group a prefixed argument if the prefix is used only once", function() {
            var parser = new ArgumentParser();
            parser.addArgument("dummy-field", "default");
            expect("dummy" in parser.groups).toBeFalsy();
            expect(parser.parameters["dummy-field"].dest).toBe("dummyField");

            parser.addJSONArgument("json-field", "default");
            expect("json" in parser.groups).toBeFalsy();
            expect(parser.parameters["json-field"].dest).toBe("jsonField");
        });

        it("will create a group out of multiple arguments with the same prefix", function() {
            var parser = new ArgumentParser();
            parser.addArgument("dummy-field", "default");
            parser.addArgument("dummy-field-two", "default");
            expect("dummy" in parser.groups).toBeTruthy();
            expect(parser.groups.dummy.order).toEqual(["field", "field-two"]);

            parser.addArgument("json-field", "default");
            parser.addArgument("json-field-two", "default");
            expect("json" in parser.groups).toBeTruthy();
            expect(parser.groups.json.order).toEqual(["field", "field-two"]);
        });

        it("will assign to each argument in a group its own parameters config", function() {
            var parser = new ArgumentParser();
            parser.addArgument("dummy-foo");
            parser.addArgument("dummy-field", "default", ["yes", "no"], false);
            expect(parser.groups.dummy.order).toEqual(["foo", "field"]);
            var spec = parser.groups.dummy.parameters.field;
            expect(spec.value).toBe("default");
            expect(spec.choices).toEqual(["yes", "no"]);
            expect(spec.multiple).toBe(false);

            parser.addArgument("json-foo");
            parser.addArgument("json-field", "default", ["yes", "no"], false);
            expect(parser.groups.json.order).toEqual(["foo", "field"]);
            spec = parser.groups.json.parameters.field;
            expect(spec.value).toBe("default");
            expect(spec.choices).toEqual(["yes", "no"]);
            expect(spec.multiple).toBe(false);
        });

        it("is also possible to add an alias for that argument", function () {
            var parser = new ArgumentParser();
            parser.addArgument("color", "red", ["red", "blue"]);
            parser.addAlias("colour", "color");
            expect(parser.parameters.color.alias).toBe("colour");

            parser.addJSONArgument("color", {"color": "red"});
            parser.addAlias("colour", "color");
            expect(parser.parameters.color.alias).toBe("colour");
        });
    });

    describe("When parsing", function() {

        it("only the allowed values for an argument are parsed", function() {
            var parser = new ArgumentParser();
            parser.addArgument("color", "red", ["red", "blue"]);
            var opts = parser._parse("color: pink");
            expect(opts.color).toBe(undefined);
            opts = parser._parse("color: red");
            expect(opts.color).toBe("red");
            opts = parser._parse("color: blue");
            expect(opts.color).toBe("blue");
        });

        it("JSON values are parsed properly", function() {
            var parser = new ArgumentParser();
            parser.addJSONArgument("json-color", {"color": "red"});
            var opts = parser._parse('json-color: {"color": "pink"}');
            expect(_.isEqual(opts["json-color"], {"color":"pink"})).toBeTruthy();
        });

        describe("the shorthand notation", function() {
            it("Single argument", function() {
                var parser=new ArgumentParser();
                parser.addArgument("selector");
                var opts = parser._parse(".MyClass");
                expect(opts.selector).toBe(".MyClass");
            });

            it("Ignore extra positional parameters", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo");
                var opts = parser._parse("bar buz");
                expect(opts.foo).toBe("bar");
            });

            it("String value with name of string argument", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo");
                var opts = parser._parse("foo");
                expect(opts.foo).toBe("foo");
            });

            it("Positive boolean value", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo", true);
                var opts = parser._parse("foo");
                expect(opts.foo).toBe(true);
            });

            it("Negative boolean value", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo", true);
                var opts = parser._parse("no-foo");
                expect(opts.foo).toBe(false);
            });

            it("Multiple boolean values", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo", false);
                parser.addArgument("bar", true);
                var opts = parser._parse("no-bar foo");
                expect(opts.foo).toBe(true);
                expect(opts.bar).toBe(false);
            });

            it("Enum value", function() {
                var parser=new ArgumentParser();
                parser.addArgument("flavour", "cheese", ["cheese", "bacon"]);
                var opts = parser._parse("bacon");
                expect(opts.flavour).toBe("bacon");
            });

            it("Double quoted argument", function() {
                var parser=new ArgumentParser();
                parser.addArgument("selector");
                var opts = parser._parse("\"#root .MyClass\"");
                expect(opts.selector).toBe("\"#root .MyClass\"");
            });

            it("Mix it all up", function() {
                var parser=new ArgumentParser();
                parser.addArgument("delay");
                parser.addArgument("sticky", false);
                parser.addArgument("flavour", "cheese", ["cheese", "bacon"]);
                var opts = parser._parse("15 bacon sticky");
                expect(opts.delay).toBe("15");
                expect(opts.sticky).toBe(true);
                expect(opts.flavour).toBe("bacon");
            });
        });

        describe("the extended notation" , function() {
            it("parses named arguments", function() {
                var parser=new ArgumentParser();
                parser.addArgument("selector");
                parser.addArgument("attr");
                var opts = parser._parse("attr: class");
                expect(opts.selector).toBe(undefined);
                expect(opts.attr).toBe("class");
            });

            it("can handle colons in an argument's value", function() {
                var parser=new ArgumentParser();
                parser.addArgument("selector");
                var opts = parser._parse("selector: nav:first");
                expect(opts.selector).toBe("nav:first");
            });

            it("can handle values with whitespace", function() {
                var parser=new ArgumentParser();
                parser.addArgument("selector");
                var opts = parser._parse("selector: #root .MyClass");
                expect(opts.selector).toBe("#root .MyClass");
            });

            it("preserves quotes", function() {
                var parser=new ArgumentParser();
                parser.addArgument("selector");
                var opts = parser._parse("selector: \"#root .MyClass\"");
                expect(opts.selector).toBe("\"#root .MyClass\"");
            });

            it("can handle multiple arguments", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo");
                parser.addArgument("bar");
                var opts = parser._parse("foo: one; bar: two");
                expect(opts).toEqual({foo: "one", bar: "two"});
            });

            it("can handle a trailing semicolon", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo");
                var opts = parser._parse("foo: bar;");
                expect(opts).toEqual({foo: "bar"});
            });

            it("doesn't treat an escaped ampersand as a semicolon", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo");
                parser.addArgument("bar");
                parser.addArgument("baz");
                var opts = parser._parse("foo: one&amp;bar: still one;baz: three");
                expect(opts).toEqual({foo: "one&amp;bar: still one",
                                      baz: "three"});
            });

            it("treats semicolons as escaped when duplicated", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo");
                parser.addArgument("bar");
                parser.addArgument("baz");
                var opts = parser._parse("foo: one;; bar: still one;baz: three");
                expect(opts).toEqual({foo: "one; bar: still one",
                                      baz: "three"});
            });

            it("ignores unknown named parameters", function() {
                var parser=new ArgumentParser();
                parser.addArgument("selector");
                var opts = parser._parse("attr: class");
                expect(opts.attr).toBeUndefined();
            });

            it("can parse aliases", function () {
                var parser=new ArgumentParser();
                parser.addArgument("color", "red", ["red", "blue"]);
                parser.addAlias("colour", "color");
                var opts = parser._parse("colour: blue");
                expect(opts).toEqual({"color": "blue"});
            });

            it("can group options", function() {
                var parser=new ArgumentParser();
                parser.addArgument("group-foo", false);
                parser.addArgument("group-bar", true);
                var opts = parser._parse("group: foo no-bar");
                expect(opts).toEqual({"group-foo": true, "group-bar": false});
            });
        });

        describe("Mixed notation", function() {
            it("Basic usage", function() {
                var parser=new ArgumentParser();
                parser.addArgument("foo");
                parser.addArgument("bar");
                parser.addArgument("buz");
                parser.addArgument("boo");
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
            parser.addArgument("selector");
            var defaults = parser._defaults($());
            expect(defaults.selector).toBe(undefined);
        });

        it("Default value provided", function() {
            var parser=new ArgumentParser();
            parser.addArgument("selector", "default");
            var defaults = parser._defaults($());
            expect(defaults.selector).toBe("default");
        });

        it("Default value from function", function() {
            var parser=new ArgumentParser(),
                func=jasmine.createSpy("func").and.returnValue("default");
            parser.addArgument("selector", func);
            var defaults = parser._defaults("element");
            expect(defaults.selector).toBe("default");
            expect(func).toHaveBeenCalledWith("element", "selector");
        });
    });

    describe("parse", function() {
        describe("Value bubbling", function() {
            it("Use default from parser", function() {
                var parser=new ArgumentParser();
                parser.addArgument("selector", "default");
                var opts = parser.parse($(), "");
                expect(opts.selector).toBe("default");
            });

            it("Value from data attribute", function() {
                var parser=new ArgumentParser("mypattern");
                parser.addArgument("selector", "default");
                var opts = parser.parse($("<div data-pat-mypattern=\"element\"/>"));
                expect(opts.selector).toBe("element");
            });

            it("Inherit value from parent data attribute", function() {
                var parser=new ArgumentParser("mypattern");
                parser.addArgument("selector", "default");
                var $content = $("<div data-pat-mypattern='parent'><span/></div>").find("span");
                var opts = parser.parse($content);
                expect(opts.selector).toBe("parent");
            });

            it("Prefer value from element data attribute", function() {
                var parser=new ArgumentParser("mypattern");
                parser.addArgument("selector", "default");
                var $content = $("<div data-pat-mypattern='parent'><span data-pat-mypattern='el'/></div>").find("span");
                var opts = parser.parse($content);
                expect(opts.selector).toBe("el");
            });

            it("Parameter trumps all", function() {
                var parser=new ArgumentParser("mypattern");
                parser.addArgument("selector", "default");
                var opts = parser.parse(
                    $("<div data-pat-mypattern=\"element\"/>"),
                    {selector: "parameter"});
                expect(opts.selector).toBe("parameter");
            });

            it("Include extra options", function() {
                var parser=new ArgumentParser();
                var opts = parser.parse($(), {foo: "bar"});
                expect(opts).toEqual({foo: "bar"});
            });
        });

        describe("Handling of combined arguments", function() {
            it("ignores extra arguments when multiple not requested", function() {
                var parser=new ArgumentParser("mypattern");
                parser.addArgument("value");
                var $content = $("<div data-pat-mypattern='one && two'/>");
                var opts = parser.parse($content);
                expect(Array.isArray(opts)).toBe(false);
                expect(opts.value).toBe("one");
            });

            it("Properly parses combined arguments written in the shorthand notation", function() {
                var parser=new ArgumentParser("mypattern");
                parser.addArgument("value");
                var $content = $("<div data-pat-mypattern='one && two'/>");
                var opts = parser.parse($content, true);
                expect(Array.isArray(opts)).toBe(true);
                expect(opts[0].value).toBe("one");
                expect(opts[1].value).toBe("two");
            });

            it("Properly parses combined arguments written in key:value notation", function() {
                var parser = new ArgumentParser("inject");
                parser.addArgument("source");
                parser.addArgument("target");
                var $content = $('<div class="pat-inject" data-pat-inject="source: #workspace-events; target: #workspace-events; && source: #global-statusmessage; target: #global-statusmessage;"></div>');
                var opts = parser.parse($content, true);
                expect(Array.isArray(opts)).toBe(true);
                expect(opts[0].source).toBe("#workspace-events");
                expect(opts[0].target).toBe("#workspace-events");
                expect(opts[1].source).toBe("#global-statusmessage");
                expect(opts[1].target).toBe("#global-statusmessage");
            });

            it("Properly parses combined arguments written in both shorthand and key:value notation", function() {
                var parser = new ArgumentParser("inject");
                parser.addArgument("source");
                parser.addArgument("target");
                var $content = $('<div class="pat-inject" data-pat-inject="#workspace-events #workspace-events; && source: #global-statusmessage; target: #global-statusmessage;"></div>');
                var opts = parser.parse($content, true);
                expect(Array.isArray(opts)).toBe(true);
                expect(opts[0].source).toBe("#workspace-events");
                expect(opts[0].target).toBe("#workspace-events");
                expect(opts[1].source).toBe("#global-statusmessage");
                expect(opts[1].target).toBe("#global-statusmessage");
            });

            it("Properly parses a combined arguments list which contains newlines", function() {
                var parser = new ArgumentParser("inject");
                parser.addArgument("source");
                parser.addArgument("target");
                var $content = $('<div class="pat-inject" data-pat-inject="source: #workspace-events; target: #workspace-events; && source: #global-statusmessage; target: #global-statusmessage;\n"></div>');
                var opts = parser.parse($content, true);
                expect(Array.isArray(opts)).toBe(true);
                expect(opts[0].source).toBe("#workspace-events");
                expect(opts[0].target).toBe("#workspace-events");
                expect(opts[1].source).toBe("#global-statusmessage");
                expect(opts[1].target).toBe("#global-statusmessage");
            });

            it("Provide multiple options to parse()", function() {
                var parser=new ArgumentParser("mypattern");
                parser.addArgument("value");
                var opts = parser.parse($(), [{value: "one"}, {value: "two"}], true);
                expect(Array.isArray(opts)).toBe(true);
                expect(opts.length).toBe(2);
                expect(opts[0].value).toBe("one");
                expect(opts[1].value).toBe("two");
            });
        });

        it("Resolve variable references", function() {
            var parser=new ArgumentParser("mypattern");
            parser.addArgument("value", 15);
            parser.addArgument("other", "$value");
            var opts = parser.parse($());
            expect(opts.other).toBe(15);
        });

        it("Grouped options", function() {
            var parser=new ArgumentParser("mypattern"),
                $content = $("<div data-pat-mypattern='group: y n'/>");
            parser.addArgument("group-foo", false);
            parser.addArgument("group-bar-baz", true);
            var opts = parser.parse($content);
            // XXX: which one should it be? I feel the first, least
            // confusion and I doubt we need the groups as objects to
            // be passed around
            //expect(opts).toEqual({"group-foo": true, "group-bar-baz": false});
            expect(opts).toEqual({group: {foo: true, "bar-baz": false}});
            //expect(opts).toEqual({group: {foo: true, bar: {baz: false}}});
        });

        it("Jquery options for grouped options", function() {
            var parser=new ArgumentParser("mypattern"),
                $content = $("<div data-pat-mypattern='group: 1 2'/>");
            parser.addArgument("group-foo", 0);
            parser.addArgument("group-bar-baz", 0);
            var opts = parser.parse($content, {"group-foo": 10,
                                               "group-bar-baz": 20});
            // XXX: adjust depending on what we decide for "Grouped options"
            expect(opts.group.foo).toBe(10);
            expect(opts.group["bar-baz"]).toBe(20);
        });


        it("Coerce to type from default function", function() {
            var parser=new ArgumentParser("mypattern"),
                func=jasmine.createSpy("func").and.returnValue(15),
                $content = $("<div data-pat-mypattern='value: 32'/>");
            parser.addArgument("value", func);
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
                parser.addArgument("value", "red",  ["red", "blue", "green"]);
                expect(parser._coerce("value", "red")).toBe("red");
            });

            it("Unknown value", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", "red",  ["red", "blue", "green"]);
                expect(parser._coerce("value", "pink")).toBe(null);
            });

            it("Coercion for enum values", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", 5, [1, 3, 5, 10]);
                expect(parser._coerce("value", "3")).toBe(3);
            });
        });

        describe("Convert to boolean", function() {
            it("String with non-zero number", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", false);
                expect(parser._coerce("value", "1")).toBe(true);
            });

            it("String with uppercase bool", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", false);
                expect(parser._coerce("value", "TRUE")).toBe(true);
            });

            it("String with mixed-case yes", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", false);
                expect(parser._coerce("value", "YeS")).toBe(true);
            });

            it("String with zero number", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", false);
                expect(parser._coerce("value", "0")).toBe(false);
            });

            it("String with mixed-case false", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", false);
                expect(parser._coerce("value", "False")).toBe(false);
            });

            it("String with n", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", false);
                expect(parser._coerce("value", "n")).toBe(false);
            });

            it("String with unknown value", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", false);
                expect(parser._coerce("value", "unknown")).toBe(false);
            });
        });

        describe("Convert to number", function() {
            it("False boolean", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", 15);
                expect(parser._coerce("value", false)).toBe(0);
            });

            it("True boolean", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", 15);
                expect(parser._coerce("value", true)).toBe(1);
            });

            it("String with positive number", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", 15);
                expect(parser._coerce("value", "1")).toBe(1);
            });

            it("String with zero number", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", 0);
                expect(parser._coerce("value", "0")).toBe(0);
            });

            it("Always use decimal notation for numbers", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", 0);
                expect(parser._coerce("value", "010")).toBe(10);
            });

            it("String with invalid", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", 0);
                expect(parser._coerce("value", "ZZ")).toBe(null);
            });
        });

        describe("Convert to string", function() {
            it("Boolean", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", "value");
                expect(parser._coerce("value", true)).toBe("true");
            });

            it("Number", function() {
                var parser=new ArgumentParser();
                parser.addArgument("value", "value");
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
                parser.addArgument("value", 1);
                spyOn(parser, "_coerce").and.returnValue("coerced!");
                parser._set(opts, "value", "1");
                expect(parser._coerce).toHaveBeenCalledWith("value", "1");
                expect(opts.value).toBe("coerced!");
            });

            it("Abort if coercion fails", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.addArgument("value", 1);
                spyOn(parser, "_coerce").and.returnValue(null);
                parser._set(opts, "value", "1");
                expect(opts.value).toBe(undefined);
            });
        });

        describe("Multiple parameters", function() {
            it("Split on comma", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.addArgument("value", [], null, true);
                parser._set(opts, "value", "foo,bar,buz");
                expect(opts.value).toEqual(["foo", "bar", "buz"]);
            });

            it("Do type coercion", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.addArgument("value", [1], null, true);
                spyOn(parser, "_coerce").and.returnValue("coerced!");
                parser._set(opts, "value", "1");
                expect(parser._coerce).toHaveBeenCalledWith("value", "1");
                expect(opts.value).toEqual(["coerced!"]);
            });

            it("Ignored values that can not be coerced", function() {
                var parser=new ArgumentParser(),
                    opts={};
                parser.addArgument("value", 1);
                spyOn(parser, "_coerce").and.returnValue(null);
                parser._set(opts, "value", "1");
                expect(opts.value).toBe(undefined);
            });
        });
    });

    describe("_split", function() {
        it("Single simple token", function() {
            var parser=new ArgumentParser("mypattern");
            expect(parser._split("simple")).toEqual(["simple"]);
        });

        it("Multiple simple token", function() {
            var parser=new ArgumentParser("mypattern");
            expect(parser._split("one two three")).toEqual(["one", "two", "three"]);
        });

        it("Single quoted value", function() {
            var parser=new ArgumentParser("mypattern");
            expect(parser._split("'simple value'")).toEqual(["'simple value'"]);
        });

        it("Double quoted value", function() {
            var parser=new ArgumentParser("mypattern");
            expect(parser._split("\"simple value\"")).toEqual(["\"simple value\""]);
        });

        it("Quoted and simple tokens", function() {
            var parser=new ArgumentParser("mypattern");
            expect(parser._split("another 'simple value'")).toEqual(["another", "'simple value'"]);
        });
    });


    describe("_cleanupOptions", function() {
        describe("Variable references", function() {
            it("Basic reference", function() {
                var parser=new ArgumentParser("mypattern");
                parser.addArgument("value", 15);
                parser.addArgument("other", "$value");
                var opts = {value: 20, other: "$value"};
                parser._cleanupOptions(opts);
                expect(opts.other).toBe(20);
            });

            it("Do not follow $ in value", function() {
                var parser=new ArgumentParser("mypattern");
                parser.addArgument("value", 15);
                parser.addArgument("other");
                var opts = {value: 20, other: "$value"};
                parser._cleanupOptions(opts);
                expect(opts.other).toBe("$value");
            });
        });

        describe("Option grouping", function() {
            it("Create new group", function() {
                var parser=new ArgumentParser();
                parser.addArgument("group-foo");
                parser.addArgument("group-bar");
                var opts = {"group-foo": 15};
                parser._cleanupOptions(opts);
                expect(opts).toEqual({group: {foo: 15}});
            });

            it("Multiple values in group", function() {
                var parser=new ArgumentParser();
                parser.addArgument("group-foo");
                parser.addArgument("group-bar");
                var opts = {"group-foo": 15, "group-bar": 20};
                parser._cleanupOptions(opts);
                expect(opts).toEqual({group: {foo: 15, bar:20}});
            });

            it("Extend existing group", function() {
                var parser=new ArgumentParser();
                parser.addArgument("group-foo");
                parser.addArgument("group-buz");
                var opts = {"group-foo": 15, group: {bar: 20}};
                parser._cleanupOptions(opts);
                expect(opts).toEqual({group: {foo: 15, bar:20}});
            });
        });
    });
});
