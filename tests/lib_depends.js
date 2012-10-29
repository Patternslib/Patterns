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
            var ast = parser.parse("foo OR baf");
            expect(ast).toEqual({type: "or",
                                 leaves: [{type: "truthy",
                                           input: "foo"},
                                          {type: "truthy",
                                           input: "baf"}]});
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
