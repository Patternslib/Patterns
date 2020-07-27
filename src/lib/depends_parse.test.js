import parser from "./depends_parse";

describe("Depedency expression parser", function() {

    describe("Simple expressions", function() {
        it("Input has a value", function() {
            var ast = parser.parse("foo");
            expect(ast).toEqual({type: "truthy",
                                 input: "foo"});
        });

        it("Input has a specific value", function() {
            var ast = parser.parse("foo=15");
            expect(ast).toEqual({type: "comparison",
                                 input: "foo",
                                 operator: "=",
                                 value: "15"});
        });

        it("Order comparision", function() {
            var ast = parser.parse("foo>=15");
            expect(ast).toEqual({type: "comparison",
                                 input: "foo",
                                 operator: ">=",
                                 value: 15});
        });

        it("Can not do order comparison to string", function() {
            expect(function() {
                parser.parse("foo<bar");
            }).toThrowError('Expected number or whitespace but "b" found.');

        });

        it("Equality comparison with string", function() {
            var ast = parser.parse("foo=bar");
            expect(ast).toEqual({type: "comparison",
                                 input: "foo",
                                 operator: "=",
                                 value: "bar"});
        });

        it("Wrapped simple expression", function() {
            var ast = parser.parse("(foo=15)");
            expect(ast).toEqual({type: "comparison",
                                 input: "foo",
                                 operator: "=",
                                 value: "15"});
        });

        it("Unicode value", function() {
            var ast = parser.parse("føø=bar");
            expect(ast).toEqual({type: "comparison",
                                 input: "føø",
                                 operator: "=",
                                 value: "bar"});
        });

        it("Unicode value", function() {
            var ast = parser.parse("foo=bær");
            expect(ast).toEqual({type: "comparison",
                                 input: "foo",
                                 operator: "=",
                                 value: "bær"});
        });

        it("Dashes in name", function() {
            var ast = parser.parse("foo-bar");
            expect(ast).toEqual({type: "truthy",
                                 input: "foo-bar"});
        });

        it("Single quoted value", function() {
            var ast = parser.parse("foo='bar buz'");
            expect(ast).toEqual({type: "comparison",
                                 input: "foo",
                                 operator: "=",
                                 value: "bar buz"});
        });

        it("Double quoted value", function() {
            var ast = parser.parse("foo=\"bar buz\"");
            expect(ast).toEqual({type: "comparison",
                                 input: "foo",
                                 operator: "=",
                                 value: "bar buz"});
        });
    });

    describe("Expressions", function() {
        it("Negated simple expression", function() {
            var ast = parser.parse("not foo=15");
            expect(ast).toEqual({type: "NOT",
                                 children: [{type: "comparison",
                                             input: "foo",
                                             operator: "=",
                                             value: "15"}]});
        });

        it("OR two simple expressions", function() {
            var ast = parser.parse("foo or baf");
            expect(ast).toEqual({type: "OR",
                                 children: [{type: "truthy",
                                             input: "foo"},
                                            {type: "truthy",
                                             input: "baf"}]});
        });

        it("Complex expression", function() {
            var ast = parser.parse("foo or not (bar=1 and buz)");
            expect(ast).toEqual({type: "OR",
                                 children: [{type: "truthy",
                                             input: "foo"},
                                            {type: "NOT",
                                             children: [{type: "AND",
                                                         children: [{type: "comparison",
                                                                     input: "bar",
                                                                     operator: "=",
                                                                     value: "1"},
                                                                    {type: "truthy",
                                                                     input: "buz"}]}]}]});
        });
    });
});
