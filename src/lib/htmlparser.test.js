import htmlparser from "./htmlparser";

describe("pat-htmlparser", function() {
    describe("HTML syntax", function() {
        it("Colon in attribute name", function() {
            const input = "<html xml:lang=\"en\"></html>";
            const handler = {start: () => {}};
            const spy = jest.spyOn(handler, "start");
            htmlparser.HTMLParser(input, handler);
            expect(handler.start).toHaveBeenCalledTimes(1);
            expect(handler.start).toHaveBeenCalledWith("html", [{name: "xml:lang", value: "en", escaped: "en"}], false);
        });

        it("Colon in tag name", function() {
            const input = "<tal:span></tal:span>";
            const handler = {start: () => {}};
            const spy = jest.spyOn(handler, "start");
            htmlparser.HTMLParser(input, handler);
            expect(handler.start).toHaveBeenCalledTimes(1);
            expect(handler.start).toHaveBeenCalledWith("tal:span", [], false);
        });

        it("Escape double quotes in attribute", function() {
            const input = "<a data-test='\"\"'></a>";
            const handler = {start: () => {}};
            const spy = jest.spyOn(handler, "start");
            htmlparser.HTMLParser(input, handler);
            expect(handler.start).toHaveBeenCalledTimes(1);
            expect(handler.start).toHaveBeenCalledWith("a", [{name: "data-test", value: "\"\"", escaped: "&quot;&quot;"}], false);
        });
    });
});
