describe("DependsHandler parser", function() {
    var parser;

    requireDependencies(["lib/depends_parse"], function(cls) {
        parser=cls;
    });

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
            }).toThrow();

        });

        it("Equalituy comparison with string", function() {
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
    });

    describe("Expressions", function() {
        it("Negated simple expression", function() {
            var ast = parser.parse("not foo=15");
            expect(ast).toEqual({type: "not",
                                 child: {type: "comparison",
                                         input: "foo",
                                         operator: "=",
                                         value: "15"}});
        });

        it("OR two simple expressions", function() {
            var ast = parser.parse("foo or baf");
            expect(ast).toEqual({type: "OR",
                                 leaves: [{type: "truthy",
                                           input: "foo"},
                                          {type: "truthy",
                                           input: "baf"}]});
        });

        it("Complex expression", function() {
            var ast = parser.parse("foo or not (bar=1 and buz)");
            expect(ast).toEqual({type: "OR",
                                 leaves: [{type: "truthy",
                                           input: "foo"},
                                          {type: "not",
                                           child: {type: "AND",
                                                   leaves: [{type: "comparison",
                                                             input: "bar",
                                                             operator: "=",
                                                             value: "1"},
                                                            {type: "truthy",
                                                             input: "buz"}]}}]});
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
