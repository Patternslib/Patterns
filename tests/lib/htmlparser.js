define(["lib/htmlparser"], function(htmlparser) {
    describe("HTMLParser", function() {
        describe("HTML syntax", function() {
            it("Colon in attribute name", function() {
                var input = "<html xml:lang=\"en\"></html>",
                    handler = jasmine.createSpyObj("handler", ["start"]);
                htmlparser.HTMLParser(input, handler);
                expect(handler.start.calls.length).toEqual(1);
                expect(handler.start).toHaveBeenCalledWith("html", [{name: "xml:lang", value: "en", escaped: "en"}], false);
            });

            it("Colon in tag name", function() {
                var input = "<tal:span></tal:span>",
                    handler = jasmine.createSpyObj("handler", ["start"]);
                htmlparser.HTMLParser(input, handler);
                expect(handler.start.calls.length).toEqual(1);
                expect(handler.start).toHaveBeenCalledWith("tal:span", [], false);
            });

            xit("Two consecutive double quotes in attribute", function() {
                var input = "<a data-test='\"\"'></a>",
                    handler = jasmine.createSpyObj("handler", ["start"]);
                htmlparser.HTMLParser(input, handler);
                expect(handler.start.calls.length).toEqual(1);
                expect(handler.start).toHaveBeenCalledWith("a", [{name: "data-test", value: "\"\"", escaped: "\\\"\\\""}], false);
            });
        });
    });
});
