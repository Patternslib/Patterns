import htmlparser from "./htmlparser";

describe("pat-htmlparser", function() {
    describe("HTML syntax", function() {
        it("Colon in attribute name", function() {
            var input = "<html xml:lang=\"en\"></html>",
                handler = jasmine.createSpyObj("handler", ["start"]);
            htmlparser.HTMLParser(input, handler);
            expect(handler.start.calls.count()).toEqual(1);
            expect(handler.start).toHaveBeenCalledWith("html", [{name: "xml:lang", value: "en", escaped: "en"}], false);
        });

        it("Colon in tag name", function() {
            var input = "<tal:span></tal:span>",
                handler = jasmine.createSpyObj("handler", ["start"]);
            htmlparser.HTMLParser(input, handler);
            expect(handler.start.calls.count()).toEqual(1);
            expect(handler.start).toHaveBeenCalledWith("tal:span", [], false);
        });

        it("Escape double quotes in attribute", function() {
            var input = "<a data-test='\"\"'></a>",
                handler = jasmine.createSpyObj("handler", ["start"]);
            htmlparser.HTMLParser(input, handler);
            expect(handler.start.calls.count()).toEqual(1);
            expect(handler.start).toHaveBeenCalledWith("a", [{name: "data-test", value: "\"\"", escaped: "&quot;&quot;"}], false);
        });
    });
});
